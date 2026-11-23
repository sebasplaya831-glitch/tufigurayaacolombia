const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(express.static(__dirname));

// Memoria compartida en servidor
let serverProductsStore = null;
const SERVER_AUTH = {
    email: "tufigurayaacolombia@gmail.com",
    validInitialHashes: [
        "04891646e2e886554db25ec22d6373c4b54c3c115bd11e7f5b21a3168a22ec40", // TuFigura123
        "67f95ab6761cc1a8c11e93b29375d56a72643ecffb448ded0a0a30e1aee00c4c"  // Tu Figura 123
    ],
    customPasswordHash: null
};

function sha256(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
}

// -------------------------------------------------------------
// RUTAS DE LA API
// -------------------------------------------------------------
app.get("/api/products", (req, res) => {
    res.json({
        success: true,
        products: serverProductsStore,
        count: serverProductsStore ? serverProductsStore.length : 0
    });
});

app.post("/api/products", (req, res) => {
    const { products, product } = req.body;
    if (Array.isArray(products)) {
        serverProductsStore = products;
        return res.json({ success: true, count: serverProductsStore.length });
    } else if (product) {
        if (!serverProductsStore) serverProductsStore = [];
        const idx = serverProductsStore.findIndex(p => p.id === product.id);
        if (idx > -1) {
            serverProductsStore[idx] = product;
        } else {
            serverProductsStore.unshift(product);
        }
        return res.json({ success: true, product });
    }
    res.status(400).json({ success: false, error: "Datos de producto no válidos" });
});

app.delete("/api/products/:id", (req, res) => {
    const prodId = req.params.id;
    if (serverProductsStore) {
        serverProductsStore = serverProductsStore.filter(p => p.id !== prodId);
    }
    res.json({ success: true, message: `Producto ${prodId} eliminado` });
});

app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const cleanEmail = (email || "").trim().toLowerCase();
    const inputHash = sha256(password || "");

    const isEmailValid = cleanEmail === SERVER_AUTH.email.toLowerCase();
    const isPasswordValid = SERVER_AUTH.customPasswordHash
        ? inputHash === SERVER_AUTH.customPasswordHash
        : SERVER_AUTH.validInitialHashes.includes(inputHash);

    if (isEmailValid && isPasswordValid) {
        res.json({
            success: true,
            email: SERVER_AUTH.email,
            token: "tfy_srv_" + Date.now()
        });
    } else {
        res.status(401).json({ success: false, error: "Credenciales inválidas" });
    }
});

app.post("/api/auth/change-pwd", (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const currentHash = sha256(currentPassword || "");

    const isCurrentValid = SERVER_AUTH.customPasswordHash
        ? currentHash === SERVER_AUTH.customPasswordHash
        : SERVER_AUTH.validInitialHashes.includes(currentHash);

    if (!isCurrentValid) {
        return res.status(400).json({ success: false, error: "Contraseña actual incorrecta" });
    }
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ success: false, error: "Mínimo 6 caracteres" });
    }

    SERVER_AUTH.customPasswordHash = sha256(newPassword);
    res.json({ success: true, message: "Contraseña actualizada exitosamente" });
});

// -------------------------------------------------------------
// RUTAS DE VISTA
// -------------------------------------------------------------
app.get(["/admin", "/admin/*"], (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tu Figura YAA server activo en puerto ${PORT}`);
});
