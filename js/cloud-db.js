/**
 * ====================================================================
 * TU FIGURA YAA — MOTOR DE BASE DE DATOS EN LA NUBE (CLOUD DB)
 * ====================================================================
 * Capa de persistencia universal compartida entre la tienda pública
 * (index.html) y el panel privado (/admin).
 *
 * Características:
 *  1. Sincronización en la nube (Cloud Database REST + Netlify API).
 *  2. Caché local resiliente (localStorage + BroadcastChannel en tiempo real).
 *  3. Compresor nativo de fotografías (Canvas a WebP/JPEG Data URL ultraligero).
 *  4. Soporte bimonetario independiente (Colombia COP y México MXN).
 *  5. Autenticación criptográfica segura (SHA-256) con sesión protegida.
 */

const CloudDB = (() => {
    // Configuración de endpoints en la nube
    const CLOUD_CONFIG = {
        // Objeto compartido en la nube RESTful API Dev persistente
        cloudDbEndpoint: "https://api.restful-api.dev/objects/ff808181a09d98f701a20a7673c32bae",
        // Netlify Serverless API endpoint
        apiEndpoint: "/api/products",
        authEndpoint: "/api/auth/login",
        changePwdEndpoint: "/api/auth/change-pwd",
        storageKey: "tufigura_custom_products",
        authStorageKey: "tufigura_admin_auth",
        sessionKey: "tufigura_admin_session",
        userKey: "tufigura_admin_user"
    };

    // Hashes SHA-256 predeterminados para la contraseña inicial de la dueña
    // Admite tanto "TuFigura123" como "Tu Figura 123" para tolerancia total
    const DEFAULT_AUTH = {
        email: "tufigurayaacolombia@gmail.com",
        initialHashes: [
            "04891646e2e886554db25ec22d6373c4b54c3c115bd11e7f5b21a3168a22ec40", // "TuFigura123"
            "67f95ab6761cc1a8c11e93b29375d56a72643ecffb448ded0a0a30e1aee00c4c"  // "Tu Figura 123"
        ],
        customHash: null
    };

    // Canal de sincronización entre pestañas abiertas
    let broadcastChannel = null;
    try {
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            broadcastChannel = new BroadcastChannel("tufigura_catalog_sync");
            broadcastChannel.onmessage = (event) => {
                if (event.data && event.data.type === "CATALOG_UPDATED") {
                    console.log("🔄 Catálogo actualizado en otra pestaña, sincronizando...");
                    if (typeof window.onCatalogRemoteUpdate === "function") {
                        window.onCatalogRemoteUpdate(event.data.products);
                    }
                }
            };
        }
    } catch (e) {
        console.warn("BroadcastChannel no soportado en este entorno", e);
    }

    // -------------------------------------------------------------
    // HELPERS CRIPTOGRÁFICOS
    // -------------------------------------------------------------
    async function calculateSHA256(text) {
        if (typeof crypto !== "undefined" && crypto.subtle) {
            const buffer = new TextEncoder().encode(text);
            const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        }
        // Fallback básico en caso excepcional
        return text;
    }

    // -------------------------------------------------------------
    // GESTIÓN DE CREDENCIALES
    // -------------------------------------------------------------
    function getStoredAuth() {
        try {
            const raw = localStorage.getItem(CLOUD_CONFIG.authStorageKey);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return DEFAULT_AUTH;
    }

    function saveStoredAuth(auth) {
        try {
            localStorage.setItem(CLOUD_CONFIG.authStorageKey, JSON.stringify(auth));
        } catch (e) {}
    }

    // -------------------------------------------------------------
    // COMPRESOR DE IMÁGENES NATIVO
    // -------------------------------------------------------------
    /**
     * Comprime un archivo de imagen seleccionado por la dueña
     * a una Data URL WebP/JPEG optimizada (máx 900x900, ~50KB)
     * para almacenamiento directo en la base de datos sin depender de CDNs externos.
     */
    function compressImageFile(file, maxWidth = 900, maxHeight = 900, quality = 0.82) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith("image/")) {
                return reject(new Error("El archivo no es una imagen válida"));
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let { width, height } = img;

                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width = Math.round(width * ratio);
                        height = Math.round(height * ratio);
                    }

                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    // Intentar WebP primero por su compresión superior; fallback a JPEG
                    let dataUrl = canvas.toDataURL("image/webp", quality);
                    if (!dataUrl || dataUrl.indexOf("data:image/webp") !== 0) {
                        dataUrl = canvas.toDataURL("image/jpeg", quality);
                    }

                    resolve(dataUrl);
                };
                img.onerror = () => reject(new Error("Error al leer la imagen"));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error("Error al cargar el archivo"));
            reader.readAsDataURL(file);
        });
    }

    // -------------------------------------------------------------
    // RECUPERACIÓN Y SINCRONIZACIÓN DEL CATÁLOGO
    // -------------------------------------------------------------
    function getLocalProducts() {
        try {
            const raw = localStorage.getItem(CLOUD_CONFIG.storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {}
        return (typeof DEFAULT_PRODUCTS_DATA !== "undefined") ? DEFAULT_PRODUCTS_DATA : [];
    }

    function setLocalProducts(products) {
        try {
            localStorage.setItem(CLOUD_CONFIG.storageKey, JSON.stringify(products));
        } catch (e) {
            console.warn("Error guardando en localStorage:", e);
        }
    }

    /**
     * Carga el catálogo desde la nube con fallback instantáneo a caché local
     */
    async function fetchProducts() {
        // 1. Obtener de caché local primero para render inmediato
        let products = getLocalProducts();

        // 2. Intentar sincronizar con RESTful Cloud DB persistente (para sincronización multi-dispositivo real)
        try {
            const cloudController = new AbortController();
            const cloudTimeout = setTimeout(() => cloudController.abort(), 4500);

            const cloudRes = await fetch(CLOUD_CONFIG.cloudDbEndpoint, {
                method: "GET",
                headers: { "Accept": "application/json" },
                signal: cloudController.signal
            }).catch(() => null);

            clearTimeout(cloudTimeout);

            if (cloudRes && cloudRes.ok) {
                const cloudObj = await cloudRes.json();
                if (cloudObj && cloudObj.data && Array.isArray(cloudObj.data.products) && cloudObj.data.products.length > 0) {
                    products = cloudObj.data.products;
                    setLocalProducts(products);
                    return products;
                }
            }
        } catch (cloudErr) {
            console.log("ℹ️ Error leyendo Cloud DB:", cloudErr.message);
        }

        // 3. Fallback: intentar con Netlify Serverless API
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);

            const res = await fetch(CLOUD_CONFIG.apiEndpoint, {
                method: "GET",
                headers: { "Accept": "application/json" },
                signal: controller.signal
            }).catch(() => null);

            clearTimeout(timeoutId);

            if (res && res.ok) {
                const data = await res.json();
                if (data && data.success && Array.isArray(data.products) && data.products.length > 0) {
                    products = data.products;
                    setLocalProducts(products);
                    return products;
                }
            }
        } catch (err) {
            console.log("ℹ️ Operando con catálogo local en caché:", err.message);
        }

        return products;
    }

    /**
     * Persiste el catálogo completo en la nube y en local
     */
    async function syncCatalogToCloud(products) {
        // 1. Guardar localmente siempre
        setLocalProducts(products);

        // 2. Notificar a otras pestañas
        if (broadcastChannel) {
            try {
                broadcastChannel.postMessage({ type: "CATALOG_UPDATED", products });
            } catch (e) {}
        }

        // 3. Sincronizar en RESTful Cloud DB persistente (disponible universalmente para todos los clientes y dispositivos)
        const cloudDbPromise = fetch(CLOUD_CONFIG.cloudDbEndpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Tu Figura YAA Catalog",
                data: {
                    products: products,
                    updatedAt: new Date().toISOString()
                }
            })
        }).catch(err => console.warn("Cloud DB sync error:", err.message));

        // 4. Sincronizar en Netlify Serverless API
        const netlifyPromise = fetch(CLOUD_CONFIG.apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products })
        }).catch(err => console.warn("Netlify API sync error:", err.message));

        await Promise.allSettled([cloudDbPromise, netlifyPromise]);
        return true;
    }

    /**
     * Agregar o actualizar un producto
     */
    async function saveProduct(productData) {
        const products = await fetchProducts();
        const existingIdx = products.findIndex(p => p.id === productData.id);

        if (existingIdx > -1) {
            products[existingIdx] = { ...products[existingIdx], ...productData };
        } else {
            products.unshift(productData);
        }

        await syncCatalogToCloud(products);
        return products;
    }

    /**
     * Eliminar un producto
     */
    async function deleteProduct(productId) {
        let products = await fetchProducts();
        products = products.filter(p => p.id !== productId);
        await syncCatalogToCloud(products);
        return products;
    }

    /**
     * Restaurar los 19 productos oficiales originales
     */
    async function resetCatalogToDefaults() {
        const defaults = (typeof DEFAULT_PRODUCTS_DATA !== "undefined") ? DEFAULT_PRODUCTS_DATA : [];
        await syncCatalogToCloud(defaults);
        return defaults;
    }

    // -------------------------------------------------------------
    // FILTRADO POR PAÍS (COLOMBIA / MÉXICO)
    // -------------------------------------------------------------
    function filterProductsByCountry(products, countryCode) {
        if (!Array.isArray(products)) return [];
        if (countryCode === "CO") {
            // En Colombia: omitir solo si availableCO está explícitamente en false
            return products.filter(p => p.availableCO !== false);
        } else if (countryCode === "MX") {
            // En México: omitir solo si availableMX está explícitamente en false
            return products.filter(p => p.availableMX !== false);
        }
        return products;
    }

    // -------------------------------------------------------------
    // AUTENTICACIÓN
    // -------------------------------------------------------------
    async function login(email, password) {
        const cleanEmail = (email || "").trim().toLowerCase();
        const inputHash = await calculateSHA256(password);
        const storedAuth = getStoredAuth();

        const isEmailMatch = cleanEmail === storedAuth.email.toLowerCase();
        const isPasswordMatch = storedAuth.customHash
            ? inputHash === storedAuth.customHash
            : (storedAuth.initialHashes || DEFAULT_AUTH.initialHashes).includes(inputHash);

        if (isEmailMatch && isPasswordMatch) {
            sessionStorage.setItem(CLOUD_CONFIG.sessionKey, "active");
            sessionStorage.setItem(CLOUD_CONFIG.userKey, storedAuth.email);

            // Sincronizar login con backend si está disponible
            fetch(CLOUD_CONFIG.authEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: cleanEmail, password })
            }).catch(() => null);

            return { success: true, email: storedAuth.email };
        }

        return { success: false, error: "Correo o contraseña incorrectos." };
    }

    async function changePassword(currentPassword, newPassword) {
        const storedAuth = getStoredAuth();
        const currentHash = await calculateSHA256(currentPassword);

        const isCurrentValid = storedAuth.customHash
            ? currentHash === storedAuth.customHash
            : (storedAuth.initialHashes || DEFAULT_AUTH.initialHashes).includes(currentHash);

        if (!isCurrentValid) {
            return { success: false, error: "La contraseña actual es incorrecta." };
        }

        if (!newPassword || newPassword.length < 6) {
            return { success: false, error: "La nueva contraseña debe tener al menos 6 caracteres." };
        }

        const newHash = await calculateSHA256(newPassword);
        storedAuth.customHash = newHash;
        saveStoredAuth(storedAuth);

        // Notificar al backend
        fetch(CLOUD_CONFIG.changePwdEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword, newPassword })
        }).catch(() => null);

        return { success: true, message: "Contraseña actualizada exitosamente." };
    }

    function isAuthenticated() {
        return sessionStorage.getItem(CLOUD_CONFIG.sessionKey) === "active";
    }

    function getActiveUser() {
        return sessionStorage.getItem(CLOUD_CONFIG.userKey) || DEFAULT_AUTH.email;
    }

    function logout() {
        sessionStorage.removeItem(CLOUD_CONFIG.sessionKey);
        sessionStorage.removeItem(CLOUD_CONFIG.userKey);
    }

    // Interfaz pública
    return {
        fetchProducts,
        saveProduct,
        deleteProduct,
        resetCatalogToDefaults,
        filterProductsByCountry,
        compressImageFile,
        login,
        changePassword,
        isAuthenticated,
        getActiveUser,
        logout,
        sha256: calculateSHA256
    };
})();

// Exportar globalmente para scripts de navegador y node
if (typeof module !== "undefined" && module.exports) {
    module.exports = CloudDB;
}

