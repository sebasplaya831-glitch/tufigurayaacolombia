/**
 * ====================================================================
 * TU FIGURA YAA — NETLIFY SERVERLESS FUNCTION API
 * ====================================================================
 * Endpoint serverless para Netlify Functions:
 *  - GET    /api/products          (Lectura pública del catálogo)
 *  - POST   /api/products          (Crear nuevo producto - Administrador)
 *  - PUT    /api/products/:id      (Actualizar producto - Administrador)
 *  - DELETE /api/products/:id      (Eliminar producto - Administrador)
 *  - POST   /api/auth/login        (Autenticación segura con SHA-256)
 *  - POST   /api/auth/change-pwd   (Actualización de contraseña)
 */

const crypto = require("crypto");

// Almacenamiento en memoria para la instancia de función
let productsStore = null;

// Credenciales oficiales predeterminadas
const DEFAULT_AUTH = {
    email: "tufigurayaacolombia@gmail.com",
    // Hashes válidos para contraseña inicial ("TuFigura123" y "Tu Figura 123")
    validInitialHashes: [
        "04891646e2e886554db25ec22d6373c4b54c3c115bd11e7f5b21a3168a22ec40", // TuFigura123
        "67f95ab6761cc1a8c11e93b29375d56a72643ecffb448ded0a0a30e1aee00c4c"  // Tu Figura 123
    ],
    customPasswordHash: null
};

function sha256(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
}

exports.handler = async (event, context) => {
    // Cabeceras CORS
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    const path = event.path.replace(/\/\.netlify\/functions\/api/, "").replace(/^\/api/, "") || "/";
    const method = event.httpMethod;

    try {
        // -------------------------------------------------------------
        // 1. AUTENTICACIÓN: LOGIN
        // -------------------------------------------------------------
        if (path === "/auth/login" && method === "POST") {
            const body = JSON.parse(event.body || "{}");
            const email = (body.email || "").trim().toLowerCase();
            const password = body.password || "";
            const inputHash = sha256(password);

            const isEmailValid = email === DEFAULT_AUTH.email.toLowerCase();
            const isPasswordValid = DEFAULT_AUTH.customPasswordHash
                ? inputHash === DEFAULT_AUTH.customPasswordHash
                : DEFAULT_AUTH.validInitialHashes.includes(inputHash);

            if (isEmailValid && isPasswordValid) {
                const token = "tfy_token_" + Buffer.from(email + ":" + Date.now()).toString("base64");
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        token,
                        email: DEFAULT_AUTH.email,
                        message: "Inicio de sesión exitoso"
                    })
                };
            } else {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ success: false, error: "Credenciales inválidas" })
                };
            }
        }

        // -------------------------------------------------------------
        // 2. AUTENTICACIÓN: CAMBIO DE CONTRASEÑA
        // -------------------------------------------------------------
        if (path === "/auth/change-pwd" && method === "POST") {
            const body = JSON.parse(event.body || "{}");
            const currentPwd = body.currentPassword || "";
            const newPwd = body.newPassword || "";
            const currentHash = sha256(currentPwd);

            const isCurrentValid = DEFAULT_AUTH.customPasswordHash
                ? currentHash === DEFAULT_AUTH.customPasswordHash
                : DEFAULT_AUTH.validInitialHashes.includes(currentHash);

            if (!isCurrentValid) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ success: false, error: "La contraseña actual no es correcta" })
                };
            }

            if (!newPwd || newPwd.length < 6) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ success: false, error: "La nueva contraseña debe tener mínimo 6 caracteres" })
                };
            }

            DEFAULT_AUTH.customPasswordHash = sha256(newPwd);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: "Contraseña actualizada exitosamente" })
            };
        }

        // -------------------------------------------------------------
        // 3. CATÁLOGO: OBTENER PRODUCTOS (GET /api/products)
        // -------------------------------------------------------------
        if ((path === "/products" || path === "/products/") && method === "GET") {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    products: productsStore || null,
                    count: productsStore ? productsStore.length : 0
                })
            };
        }

        // -------------------------------------------------------------
        // 4. CATÁLOGO: GUARDAR/ACTUALIZAR CATÁLOGO COMPLETO
        // -------------------------------------------------------------
        if ((path === "/products" || path === "/products/") && method === "POST") {
            const body = JSON.parse(event.body || "{}");
            if (Array.isArray(body.products)) {
                productsStore = body.products;
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        count: productsStore.length,
                        message: "Catálogo sincronizado exitosamente en el servidor"
                    })
                };
            } else if (body.product) {
                if (!productsStore) productsStore = [];
                const idx = productsStore.findIndex(p => p.id === body.product.id);
                if (idx > -1) {
                    productsStore[idx] = body.product;
                } else {
                    productsStore.unshift(body.product);
                }
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        product: body.product,
                        message: "Producto guardado con éxito"
                    })
                };
            }
        }

        // -------------------------------------------------------------
        // 5. CATÁLOGO: ELIMINAR PRODUCTO (DELETE /api/products/:id)
        // -------------------------------------------------------------
        const deleteMatch = path.match(/^\/products\/([a-zA-Z0-9_-]+)$/);
        if (deleteMatch && method === "DELETE") {
            const prodId = deleteMatch[1];
            if (productsStore) {
                productsStore = productsStore.filter(p => p.id !== prodId);
            }
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: `Producto ${prodId} eliminado del catálogo`
                })
            };
        }

        // -------------------------------------------------------------
        // RUTA NO ENCONTRADA
        // -------------------------------------------------------------
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: "Endpoint no encontrado: " + path })
        };

    } catch (err) {
        console.error("Error en API Serverless:", err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: err.message })
        };
    }
};

