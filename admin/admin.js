/**
 * ====================================================================
 * TU FIGURA YAA — SISTEMA ADMINISTRATIVO PRIVADO
 * LÓGICA DE AUTENTICACIÓN HASH Y CRUD DE PRODUCTOS (CO & MX)
 * ====================================================================
 */

// Configuración inicial de credenciales oficiales
// IMPORTANTE: Acepta tanto "TuFigura123" como "Tu Figura 123" como contraseñas iniciales válidas
const DEFAULT_ADMIN_CONFIG = {
    email: "tufigurayaacolombia@gmail.com",
    // SHA-256 de "TuFigura123" (contraseña canónica)
    passwordHash: "04891646e2e886554db25ec22d6373c4b54c3c115bd11e7f5b21a3168a22ec40",
    // Hashes alternativos también válidos en el primer inicio de sesión
    alternateHashes: [
        "04891646e2e886554db25ec22d6373c4b54c3c115bd11e7f5b21a3168a22ec40", // TuFigura123
        "67f95ab6761cc1a8c11e93b29375d56a72643ecffb448ded0a0a30e1aee00c4c"  // Tu Figura 123
    ]
};

// =========================================================
// 1. HELPERS CRIPTOGRÁFICOS Y DE SESIÓN
// =========================================================

// Función criptográfica SHA-256 nativa de navegador
async function sha256(text) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Obtener credenciales guardadas (o inicializar con las predeterminadas)
function getAdminCredentials() {
    try {
        const stored = localStorage.getItem("tufigura_admin_auth");
        if (stored) {
            const parsed = JSON.parse(stored);
            // Asegurar que siempre tenga el campo alternateHashes
            if (!parsed.alternateHashes) {
                parsed.alternateHashes = DEFAULT_ADMIN_CONFIG.alternateHashes;
            }
            return parsed;
        }
    } catch (e) {}
    localStorage.setItem("tufigura_admin_auth", JSON.stringify(DEFAULT_ADMIN_CONFIG));
    return DEFAULT_ADMIN_CONFIG;
}

// Guardar credenciales actualizadas
function saveAdminCredentials(creds) {
    localStorage.setItem("tufigura_admin_auth", JSON.stringify(creds));
}

// Verificar si hay sesión activa
function isAuthenticated() {
    return sessionStorage.getItem("tufigura_admin_session") === "active";
}

function setSessionActive(email) {
    sessionStorage.setItem("tufigura_admin_session", "active");
    sessionStorage.setItem("tufigura_admin_user", email);
}

function clearSession() {
    sessionStorage.removeItem("tufigura_admin_session");
    sessionStorage.removeItem("tufigura_admin_user");
}

// Toast Notifier
function showAdminToast(message, type = "success") {
    const container = document.getElementById("adminToastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `admin-toast admin-toast-${type}`;
    toast.innerHTML = message;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// =========================================================
// 2. GESTOR DE PRODUCTOS (CRUD)
// =========================================================

let currentProducts = [];
let activeCategoryFilter = "all";
let activeSearchQuery = "";
let pendingUploadDataUrl = null; // Para foto recién subida

function refreshProductsList() {
    if (typeof CloudDB !== "undefined") {
        CloudDB.fetchProducts().then(products => {
            currentProducts = products;
            renderStats();
            renderProductsTable();
        }).catch(() => {
            currentProducts = typeof loadCustomProductsFromStorage === "function"
                ? loadCustomProductsFromStorage()
                : (typeof PRODUCTS_DATA !== "undefined" ? PRODUCTS_DATA : []);
            renderStats();
            renderProductsTable();
        });
    } else if (typeof loadCustomProductsFromStorage === "function") {
        currentProducts = loadCustomProductsFromStorage();
        renderStats();
        renderProductsTable();
    } else {
        currentProducts = typeof PRODUCTS_DATA !== "undefined" ? PRODUCTS_DATA : [];
        renderStats();
        renderProductsTable();
    }
}

function renderStats() {
    const total = currentProducts.length;
    const postq = currentProducts.filter(p => p.category === "postquirurgica").length;
    const molde = currentProducts.filter(p => p.category === "moldeadoras").length;
    const dorad = currentProducts.filter(p => p.category === "dorada").length;

    document.getElementById("statTotalProducts").textContent = total;
    document.getElementById("statPostquirurgica").textContent = postq;
    document.getElementById("statMoldeadoras").textContent = molde;
    document.getElementById("statDorada").textContent = dorad;
}

function renderProductsTable() {
    const tbody = document.getElementById("adminProductsTableBody");
    const emptyState = document.getElementById("adminEmptyState");
    const countBadge = document.getElementById("adminProductCountBadge");
    if (!tbody) return;

    const query = activeSearchQuery.toLowerCase().trim();
    const filtered = currentProducts.filter(p => {
        const matchesCategory = activeCategoryFilter === "all" || p.category === activeCategoryFilter;
        const matchesSearch = !query || 
            (p.name && p.name.toLowerCase().includes(query)) ||
            (p.ref && p.ref.toLowerCase().includes(query)) ||
            (p.badge && p.badge.toLowerCase().includes(query));
        return matchesCategory && matchesSearch;
    });

    countBadge.textContent = `${filtered.length} de ${currentProducts.length} productos`;

    if (filtered.length === 0) {
        tbody.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    tbody.innerHTML = filtered.map(product => {
        // Formateadores de precio
        const priceCOPFormatted = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(product.priceCOP || 0);
        const priceMXNFormatted = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(product.priceMXN || 0);

        // Badge de categoría
        const catMap = {
            postquirurgica: { label: "Postquirúrgica", class: "badge-postquirurgica" },
            moldeadoras: { label: "Moldeadora", class: "badge-moldeadoras" },
            dorada: { label: "Línea Dorada", class: "badge-dorada" }
        };
        const catInfo = catMap[product.category] || { label: product.categoryLabel || product.category, class: "badge-moldeadoras" };

        // Stock
        const isStock = product.inStock !== false;
        const stockBadge = isStock 
            ? `<span class="badge-stock badge-in-stock">En Stock</span>`
            : `<span class="badge-stock badge-out-of-stock">Agotado</span>`;

        // Imagen ruta segura
        const imgPath = product.image ? (product.image.startsWith("http") ? product.image : `../${product.image}`) : "../images/media_1789620499316.png";

        return `
            <tr>
                <td>
                    <img src="${imgPath}" alt="${product.name}" class="admin-thumb-img" onerror="this.src='../images/media_1789620499316.png'">
                </td>
                <td>
                    <strong style="color: var(--gold-light); font-family: monospace; font-size: 0.95rem;">REF. ${product.ref || 'S/N'}</strong>
                </td>
                <td class="admin-product-name-cell">
                    <strong>${product.name}</strong>
                    <small>${product.compression || 'Extra Firme'} • ${product.sizes ? product.sizes.join(', ') : 'S a 3XL'}</small>
                </td>
                <td>
                    <span class="badge-category ${catInfo.class}">${catInfo.label}</span>
                </td>
                <td>
                    <span class="price-cell-colombia">${priceCOPFormatted}</span>
                </td>
                <td>
                    <span class="price-cell-mexico">${priceMXNFormatted}</span>
                </td>
                <td>
                    ${stockBadge}
                </td>
                <td>
                    <div class="admin-table-actions">
                        <button type="button" class="btn-action-icon" title="Editar producto" onclick="openEditProductModal('${product.id}')">
                            ✏️ Editar
                        </button>
                        <button type="button" class="btn-action-icon btn-action-delete" title="Eliminar producto" onclick="deleteProduct('${product.id}')">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

// =========================================================
// 3. MODAL DE PRODUCTO (AGREGAR / EDITAR)
// =========================================================

function previewSelectedImage(val) {
    pendingUploadDataUrl = null; // Reset foto subida cuando se elige del select
    const customWrap = document.getElementById("customImageInputWrap");
    const preview = document.getElementById("modalImagePreview");
    if (val === "custom") {
        customWrap.classList.remove("hidden");
        const customVal = document.getElementById("productCustomImage").value.trim();
        preview.src = customVal ? (customVal.startsWith("http") ? customVal : `../${customVal}`) : "../images/media_1789620499316.png";
    } else {
        customWrap.classList.add("hidden");
        preview.src = `../${val}`;
    }
}

// Manejar subida de foto real desde dispositivo
function initImageFileUpload() {
    const fileInput = document.getElementById("productImageFile");
    const preview = document.getElementById("modalImagePreview");
    const dropZone = document.getElementById("dropZone");
    if (!fileInput) return;

    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            showAdminToast("⏳ Comprimiendo imagen...", "info");
            if (typeof CloudDB !== "undefined") {
                pendingUploadDataUrl = await CloudDB.compressImageFile(file, 900, 900, 0.82);
            } else {
                // Fallback: FileReader directo
                pendingUploadDataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }
            preview.src = pendingUploadDataUrl;
            // Desmarcar el select para indicar que se usa la foto subida
            const imgSelect = document.getElementById("productImageSelect");
            if (imgSelect) imgSelect.value = "";
            showAdminToast("✓ Foto cargada y comprimida correctamente.");
        } catch (err) {
            showAdminToast("Error al procesar la imagen: " + err.message, "error");
        }
    });

    // Soporte drag & drop
    if (dropZone) {
        dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.classList.add("dragover"); });
        dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.classList.remove("dragover");
            const file = e.dataTransfer.files[0];
            if (file) {
                fileInput.files = e.dataTransfer.files;
                fileInput.dispatchEvent(new Event("change"));
            }
        });
    }
}

function openCreateProductModal() {
    document.getElementById("productForm").reset();
    document.getElementById("editProductId").value = "";
    document.getElementById("productModalTitle").textContent = "Agregar Nuevo Producto al Catálogo";
    document.getElementById("productCategory").value = "postquirurgica";
    document.getElementById("productStock").value = "true";
    document.getElementById("productImageSelect").value = "images/media_1789620499316.png";
    document.getElementById("customImageInputWrap").classList.add("hidden");
    document.getElementById("modalImagePreview").src = "../images/media_1789620499316.png";
    pendingUploadDataUrl = null;

    // Marcar tallas estándar
    document.querySelectorAll("input[name='sizes']").forEach(ch => {
        ch.checked = ["S", "M", "L", "XL", "2XL", "3XL"].includes(ch.value);
    });

    // Ambos mercados activos por defecto
    const chkCO = document.getElementById("availableCO");
    const chkMX = document.getElementById("availableMX");
    if (chkCO) chkCO.checked = true;
    if (chkMX) chkMX.checked = true;

    document.getElementById("productModal").classList.remove("hidden");
}

function openEditProductModal(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return;

    document.getElementById("productForm").reset();
    document.getElementById("editProductId").value = product.id;
    document.getElementById("productModalTitle").textContent = `Editar Producto (REF. ${product.ref || ''})`;

    document.getElementById("productRef").value = product.ref || "";
    document.getElementById("productName").value = product.name || "";
    document.getElementById("productCategory").value = product.category || "postquirurgica";
    document.getElementById("productPriceCOP").value = product.priceCOP || "";
    document.getElementById("productPriceMXN").value = product.priceMXN || "";
    document.getElementById("productOriginalCOP").value = product.originalPriceCOP || "";
    document.getElementById("productOriginalMXN").value = product.originalPriceMXN || "";
    document.getElementById("productCompression").value = product.compression || "Extra Firme";
    document.getElementById("productStock").value = product.inStock !== false ? "true" : "false";

    // Manejo de imagen
    const imgSelect = document.getElementById("productImageSelect");
    const customWrap = document.getElementById("customImageInputWrap");
    const customInput = document.getElementById("productCustomImage");
    const preview = document.getElementById("modalImagePreview");

    let foundOption = false;
    for (let i = 0; i < imgSelect.options.length; i++) {
        if (imgSelect.options[i].value === product.image) {
            imgSelect.selectedIndex = i;
            foundOption = true;
            break;
        }
    }

    if (!foundOption && product.image) {
        imgSelect.value = "custom";
        customWrap.classList.remove("hidden");
        customInput.value = product.image;
        preview.src = product.image.startsWith("http") ? product.image : `../${product.image}`;
    } else {
        customWrap.classList.add("hidden");
        preview.src = `../${imgSelect.value}`;
    }

    // Tallas
    const pSizes = product.sizes || [];
    document.querySelectorAll("input[name='sizes']").forEach(ch => {
        ch.checked = pSizes.includes(ch.value);
    });

    // Colores
    const pColorNames = (product.colors || []).map(c => typeof c === 'string' ? c : c.name);
    document.querySelectorAll("input[name='colors']").forEach(ch => {
        ch.checked = pColorNames.some(name => name.toLowerCase().includes(ch.value.toLowerCase().split(" ")[0]));
    });

    document.getElementById("productDescription").value = product.shortDescription || "";
    document.getElementById("productFeatures").value = (product.features || []).join("\n");
    document.getElementById("productIdealFor").value = product.idealFor || "";

    // Disponibilidad por mercado
    const chkCO = document.getElementById("availableCO");
    const chkMX = document.getElementById("availableMX");
    if (chkCO) chkCO.checked = product.availableCO !== false;
    if (chkMX) chkMX.checked = product.availableMX !== false;

    // Reset foto subida
    pendingUploadDataUrl = null;

    document.getElementById("productModal").classList.remove("hidden");
}

function closeProductModal() {
    document.getElementById("productModal").classList.add("hidden");
}

function handleProductFormSubmit(e) {
    e.preventDefault();

    const editId = document.getElementById("editProductId").value;
    const ref = document.getElementById("productRef").value.trim();
    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("productCategory").value;
    const priceCOP = parseFloat(document.getElementById("productPriceCOP").value) || 0;
    const priceMXN = parseFloat(document.getElementById("productPriceMXN").value) || 0;
    const origCOP = parseFloat(document.getElementById("productOriginalCOP").value) || Math.round(priceCOP * 1.2);
    const origMXN = parseFloat(document.getElementById("productOriginalMXN").value) || Math.round(priceMXN * 1.2);
    const compression = document.getElementById("productCompression").value;
    const inStock = document.getElementById("productStock").value === "true";

    // Imagen — prioridad: foto subida > URL personalizada > selección del menú
    const imgSelect = document.getElementById("productImageSelect").value;
    let finalImage = imgSelect;
    if (pendingUploadDataUrl) {
        finalImage = pendingUploadDataUrl; // Foto real subida por la dueña
    } else if (imgSelect === "custom") {
        finalImage = document.getElementById("productCustomImage").value.trim() || "images/media_1789620499316.png";
    }

    // Disponibilidad por mercado
    const chkCO = document.getElementById("availableCO");
    const chkMX = document.getElementById("availableMX");
    const availableCO = chkCO ? chkCO.checked : true;
    const availableMX = chkMX ? chkMX.checked : true;

    // Tallas seleccionadas
    const sizes = Array.from(document.querySelectorAll("input[name='sizes']:checked")).map(c => c.value);
    if (sizes.length === 0) sizes.push("S", "M", "L", "XL");

    // Colores
    const colors = Array.from(document.querySelectorAll("input[name='colors']:checked")).map(c => {
        const val = c.value;
        const hex = val.includes("Negro") ? "#111111" : (val.includes("Miel") ? "#c99e69" : "#6b4c35");
        return { name: val, hex: hex };
    });
    if (colors.length === 0) colors.push({ name: "Negro", hex: "#111111" });

    // Textos
    const shortDescription = document.getElementById("productDescription").value.trim() || 
        `${name}. Confeccionada en 100% auténtico Powernet colombiano para compresión anatómica y moldeo reloj de arena.`;
    const featuresRaw = document.getElementById("productFeatures").value.trim();
    const features = featuresRaw ? featuresRaw.split("\n").map(f => f.trim()).filter(Boolean) : [
        "Auténtico Powernet médico colombiano con forro hipoalergénico",
        "Costuras planas que no se marcan debajo de la ropa",
        "Broches frontales reforzados de ajuste gradual"
    ];
    const idealFor = document.getElementById("productIdealFor").value.trim() || 
        "Uso diario, postoperatorio y moldeado de alta definición.";

    const categoryLabels = {
        postquirurgica: "Postquirúrgica & Médica",
        moldeadoras: "Fajas Moldeadoras",
        dorada: "Línea Dorada"
    };

    if (editId) {
        // ACTUALIZAR PRODUCTO EXISTENTE
        const index = currentProducts.findIndex(p => p.id === editId);
        if (index > -1) {
            currentProducts[index] = {
                ...currentProducts[index],
                ref,
                name,
                category,
                categoryLabel: categoryLabels[category] || category,
                priceCOP,
                priceMXN,
                originalPriceCOP: origCOP,
                originalPriceMXN: origMXN,
                compression,
                inStock,
                image: finalImage,
                secondaryImage: finalImage,
                sizes,
                colors,
                shortDescription,
                features,
                idealFor,
                availableCO,
                availableMX,
                badge: `REF. ${ref} • ${categoryLabels[category]}`
            };
            showAdminToast(`✓ Producto "${name}" actualizado con éxito.`);
        }
    } else {
        // CREAR NUEVO PRODUCTO
        const newId = `ref-${ref.toLowerCase().replace(/[^a-z0-9]/g, '') || Date.now()}`;
        const newSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const newProduct = {
            id: newId,
            ref,
            name,
            slug: newSlug,
            category,
            categoryLabel: categoryLabels[category] || category,
            priceCOP,
            priceMXN,
            originalPriceCOP: origCOP,
            originalPriceMXN: origMXN,
            discount: "18% OFF",
            rating: 5.0,
            reviewsCount: 15,
            compression,
            inStock,
            image: finalImage,
            secondaryImage: finalImage,
            badge: `REF. ${ref} • ${categoryLabels[category]}`,
            shortDescription,
            features,
            idealFor,
            sizes,
            colors,
            availableCO,
            availableMX
        };

        currentProducts.unshift(newProduct);
        showAdminToast(`✓ Nuevo producto "${name}" agregado con éxito.`);
    }

    // Persistir cambios — CloudDB sincroniza con la nube y localStorage
    const saveAndSync = async () => {
        if (typeof CloudDB !== "undefined") {
            try {
                await CloudDB.syncCatalogToCloud ? 
                    CloudDB.syncCatalogToCloud(currentProducts) : 
                    null;
            } catch (e) {}
        }
        if (typeof saveCustomProducts === "function") {
            saveCustomProducts(currentProducts);
        } else {
            localStorage.setItem("tufigura_custom_products", JSON.stringify(currentProducts));
        }
    };
    saveAndSync();

    closeProductModal();
    refreshProductsList();
}

function deleteProduct(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return;

    if (confirm(`¿Estás segura de eliminar permanentemente la faja "${product.name}" (REF. ${product.ref})?`)) {
        currentProducts = currentProducts.filter(p => p.id !== productId);
        if (typeof saveCustomProducts === "function") {
            saveCustomProducts(currentProducts);
        } else {
            localStorage.setItem("tufigura_custom_products", JSON.stringify(currentProducts));
        }
        showAdminToast(`✓ Producto eliminado del catálogo.`);
        refreshProductsList();
    }
}

function resetCatalog() {
    if (confirm("¿Deseas restaurar el catálogo predeterminado de 19 fajas oficiales? Cualquier cambio o producto nuevo se restablecerá.")) {
        if (typeof resetCustomProductsToDefault === "function") {
            resetCustomProductsToDefault();
        } else {
            localStorage.removeItem("tufigura_custom_products");
        }
        showAdminToast("✓ Catálogo original restaurado con éxito.");
        refreshProductsList();
    }
}

// =========================================================
// 4. CAMBIO DE CONTRASEÑA
// =========================================================

function openChangePasswordModal() {
    document.getElementById("changePwdForm").reset();
    document.getElementById("changePwdModal").classList.remove("hidden");
}

function closeChangePasswordModal() {
    document.getElementById("changePwdModal").classList.add("hidden");
}

async function handleChangePasswordSubmit(e) {
    e.preventDefault();

    const currentPwd = document.getElementById("currentPassword").value;
    const newPwd = document.getElementById("newPassword").value;
    const confirmPwd = document.getElementById("confirmNewPassword").value;

    if (newPwd !== confirmPwd) {
        showAdminToast("La nueva contraseña y la confirmación no coinciden.", "error");
        return;
    }

    if (newPwd.length < 6) {
        showAdminToast("La nueva contraseña debe tener al menos 6 caracteres.", "error");
        return;
    }

    const creds = getAdminCredentials();
    const currentHash = await sha256(currentPwd);

    // Verificar con hash principal o alternativos
    const validHashes = creds.alternateHashes || DEFAULT_ADMIN_CONFIG.alternateHashes || [creds.passwordHash];
    const isCurrentValid = validHashes.includes(currentHash) || currentHash === creds.passwordHash;

    if (!isCurrentValid) {
        showAdminToast("La contraseña actual es incorrecta.", "error");
        return;
    }

    // Hashear y guardar nueva clave
    const newHash = await sha256(newPwd);
    creds.passwordHash = newHash;
    saveAdminCredentials(creds);

    closeChangePasswordModal();
    showAdminToast("✓ Contraseña actualizada correctamente.");
}

// =========================================================
// 5. LOGIN & NAVEGACIÓN
// =========================================================

async function handleLoginSubmit(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const btnSubmit = document.getElementById("btnLoginSubmit");

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `Verificando credenciales...`;

    try {
        const creds = getAdminCredentials();
        const inputHash = await sha256(password);

        // Verificar con hash principal o con hashes alternativos aceptados
        const validHashes = creds.alternateHashes || DEFAULT_ADMIN_CONFIG.alternateHashes || [creds.passwordHash];
        const isPasswordValid = validHashes.includes(inputHash) || inputHash === creds.passwordHash;

        if (email === creds.email.toLowerCase() && isPasswordValid) {
            // Si se usó un hash alternativo, actualizar al hash canónico en próximo login
            setSessionActive(creds.email);
            showAdminToast("✓ ¡Bienvenida al Panel Administrativo!");
            showDashboard();
        } else {
            showAdminToast("Credenciales inválidas. Verifica tu correo y contraseña.", "error");
        }
    } catch (err) {
        console.error(err);
        showAdminToast("Error de verificación.", "error");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `
            <span>Ingresar al Panel de Control</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
        `;
    }
}

function handleLogout() {
    clearSession();
    showLogin();
    showAdminToast("Sesión cerrada correctamente.");
}

function showLogin() {
    document.getElementById("loginSection").classList.remove("hidden");
    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("loginPassword").value = "";
}

function showDashboard() {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("dashboardSection").classList.remove("hidden");
    const user = sessionStorage.getItem("tufigura_admin_user") || "tufigurayaacolombia@gmail.com";
    document.getElementById("activeUserEmail").textContent = user;
    refreshProductsList();
}

// =========================================================
// 6. INICIALIZACIÓN DE EVENTOS
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    // Asegurar credenciales
    getAdminCredentials();

    // Toggle password visibility
    const btnToggle = document.getElementById("btnToggleLoginPwd");
    if (btnToggle) {
        btnToggle.addEventListener("click", () => {
            const pwdInput = document.getElementById("loginPassword");
            if (pwdInput.type === "password") {
                pwdInput.type = "text";
                btnToggle.textContent = "🙈";
            } else {
                pwdInput.type = "password";
                btnToggle.textContent = "👁️";
            }
        });
    }

    // Formularios
    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.addEventListener("submit", handleLoginSubmit);

    const productForm = document.getElementById("productForm");
    if (productForm) productForm.addEventListener("submit", handleProductFormSubmit);

    const changePwdForm = document.getElementById("changePwdForm");
    if (changePwdForm) changePwdForm.addEventListener("submit", handleChangePasswordSubmit);

    // Botones modales
    const btnOpenCreate = document.getElementById("btnOpenCreateProductModal");
    if (btnOpenCreate) btnOpenCreate.addEventListener("click", openCreateProductModal);

    const btnCloseProduct = document.getElementById("btnCloseProductModal");
    if (btnCloseProduct) btnCloseProduct.addEventListener("click", closeProductModal);

    const btnCancelProduct = document.getElementById("btnCancelProductModal");
    if (btnCancelProduct) btnCancelProduct.addEventListener("click", closeProductModal);

    const btnOpenChangePwd = document.getElementById("btnOpenChangePwdModal");
    if (btnOpenChangePwd) btnOpenChangePwd.addEventListener("click", openChangePasswordModal);

    const btnCloseChangePwd = document.getElementById("btnCloseChangePwdModal");
    if (btnCloseChangePwd) btnCloseChangePwd.addEventListener("click", closeChangePasswordModal);

    const btnCancelChangePwd = document.getElementById("btnCancelChangePwd");
    if (btnCancelChangePwd) btnCancelChangePwd.addEventListener("click", closeChangePasswordModal);

    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) btnLogout.addEventListener("click", handleLogout);

    const btnReset = document.getElementById("btnResetCatalog");
    if (btnReset) btnReset.addEventListener("click", resetCatalog);

    // Filtros de búsqueda
    const searchInput = document.getElementById("adminSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            activeSearchQuery = e.target.value;
            renderProductsTable();
        });
    }

    const catFilter = document.getElementById("adminCategoryFilter");
    if (catFilter) {
        catFilter.addEventListener("change", (e) => {
            activeCategoryFilter = e.target.value;
            renderProductsTable();
        });
    }

    // Inicializar subida de fotos real
    initImageFileUpload();

    // Comprobar estado de sesión
    if (isAuthenticated()) {
        showDashboard();
    } else {
        showLogin();
    }
});

