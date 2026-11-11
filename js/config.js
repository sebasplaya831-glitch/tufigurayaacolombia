/**
 * ====================================================================
 * TU FIGURA YAA - CONFIGURACIÓN CENTRAL BI-NACIONAL (COLOMBIA & MÉXICO)
 * ====================================================================
 * Soporte completo para Colombia (COP) y México (MXN)
 */

const STORE_CONFIG = {
    brandName: "Tu Figura Yaa",
    tagline: "El Secreto de las Curvas Perfectas • 100% Calidad Colombiana",
    supportEmail: "contacto@tufigurayaa.com",
    // Tasa de cambio oficial y exacta en tiempo real (1 MXN = 188.74 COP)
    exchangeRate: {
        MXN_to_COP: 188.74,
        COP_to_MXN: 1 / 188.74,
        description: "1 MXN = 188.74 COP",
        label: "Tasa oficial: 1 MXN = $188.74 COP"
    },

    // Configuración específica por país
    countries: {
        CO: {
            code: "CO",
            name: "Colombia",
            flag: "🇨🇴",
            currencySymbol: "$",
            currencyCode: "COP",
            currencyLabel: "COP (Pesos Colombianos)",
            whatsappNumber: "573173142714",
            whatsappDisplay: "+57 317 314 27 14",
            address: "Cali, Valle del Cauca - Auténtico Producto Caleño con despachos a nivel nacional",
            shipping: {
                freeShippingCity: "Cali",
                standardShippingCost: 15000,    // $15.000 COP
                freeShippingLabel: "¡Envío GRATIS únicamente en la ciudad de Cali!",
                deliveryTimeEstimated: "24 a 48h en Cali y ciudades principales (2-4 días resto del país)"
            },
            coupons: {},
            bankAccounts: {
                nequi: {
                    name: "Nequi",
                    number: "317 314 2714",
                    holder: "Tu Figura Yaa SAS - NIT 901.458.321-4"
                },
                daviplata: {
                    name: "Daviplata",
                    number: "317 314 2714",
                    holder: "Tu Figura Yaa SAS"
                },
                bancolombia: {
                    name: "Bancolombia Ahorros",
                    number: "048-998231-72",
                    holder: "Tu Figura Yaa Colombia SAS (NIT 901.458.321-4)"
                }
            },
            locations: {
                "Antioquia": ["Medellín", "Bello", "Itagüí", "Envigado", "Rionegro", "Sabaneta", "Apartadó"],
                "Bogotá D.C.": ["Bogotá D.C."],
                "Valle del Cauca": ["Cali", "Palmira", "Buenaventura", "Tuluá", "Cartago", "Buga", "Jamundí"],
                "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Puerto Colombia"],
                "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja"],
                "Cundinamarca": ["Soacha", "Chía", "Zipaquirá", "Facatativá", "Fusagasugá", "Mosquera", "Madrid"],
                "Bolívar": ["Cartagena", "Magangué", "Turbaco", "Arjona"],
                "Tolima": ["Ibagué", "Espinal", "Melgar"],
                "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal"],
                "Caldas": ["Manizales", "Villamaría", "Chinchiná"],
                "Quindío": ["Armenia", "Calarcá", "Montenegro", "Quimbaya"],
                "Norte de Santander": ["Cúcuta", "Los Patios", "Villa del Rosario", "Ocaña"],
                "Huila": ["Neiva", "Pitalito", "Garzón"],
                "Meta": ["Villavicencio", "Acacías", "Granada"],
                "Magdalena": ["Santa Marta", "Ciénaga", "Fundación"],
                "Cesar": ["Valledupar", "Aguachica", "Codazzi"],
                "Córdoba": ["Montería", "Cereté", "Lorica", "Sahagún"],
                "Nariño": ["Pasto", "Ipiales", "Tumaco"],
                "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá"],
                "Cauca": ["Popayán", "Santander de Quilichao"],
                "Sucre": ["Sincelejo", "Corozal"],
                "Casanare": ["Yopal", "Aguazul"],
                "La Guajira": ["Riohacha", "Maicao"],
                "Chocó": ["Quibdó"],
                "Caquetá": ["Florencia"],
                "Putumayo": ["Mocoa", "Puerto Asís"],
                "San Andrés y Providencia": ["San Andrés"]
            }
        },
        MX: {
            code: "MX",
            name: "México",
            flag: "🇲🇽",
            currencySymbol: "$",
            currencyCode: "MXN",
            currencyLabel: "MXN (Pesos Mexicanos)",
            whatsappNumber: "524444971505",
            whatsappDisplay: "+52 444 497 1505",
            address: "San Luis Potosí, SLP - Centro de Distribución y Envíos a toda la República",
            shipping: {
                freeShippingCity: "San Luis Potosí",
                standardShippingCost: 149,   // $149 MXN
                freeShippingLabel: "¡Envío GRATIS únicamente en San Luis Potosí!",
                deliveryTimeEstimated: "24 a 48h en San Luis Potosí y ciudades principales (2-4 días resto del país)"
            },
            coupons: {},
            bankAccounts: {
                spei: {
                    name: "Transferencia SPEI Interbancaria",
                    bank: "BBVA México",
                    clabe: "012 180 015489723610",
                    beneficiary: "Tu Figura Yaa México SA de CV"
                },
                oxxo: {
                    name: "OXXO Pay",
                    referenceDemo: "9348 2018 4729 11",
                    instructions: "Paga en efectivo en cualquier tienda OXXO o 7-Eleven de la República."
                },
                mercadoPago: {
                    name: "Mercado Pago / Tarjetas",
                    account: "pagos@tufigurayaa.mx"
                }
            },
            locations: {
                "Ciudad de México": ["Cuauhtémoc", "Benito Juárez", "Miguel Hidalgo", "Coyoacán", "Álvaro Obregón", "Tlalpan", "Iztapalapa", "Gustavo A. Madero", "Azcapotzalco", "Venustiano Carranza"],
                "Estado de México": ["Naucalpan", "Tlalnepantla", "Ecatepec", "Toluca", "Huixquilucan", "Nezahualcóyotl", "Cuautitlán Izcalli", "Metepec", "Coacalco"],
                "Jalisco": ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Puerto Vallarta", "Tlajomulco"],
                "Nuevo León": ["Monterrey", "San Pedro Garza García", "San Nicolás de los Garza", "Guadalupe", "Apodaca", "Santa Catarina"],
                "Puebla": ["Puebla de Zaragoza", "San Andrés Cholula", "San Pedro Cholula", "Tehuacán", "Atlixco"],
                "Guanajuato": ["León", "Irapuato", "Celaya", "Guanajuato", "San Miguel de Allende", "Salamanca"],
                "Querétaro": ["Santiago de Querétaro", "San Juan del Río", "El Marqués", "Corregidora"],
                "Quintana Roo": ["Cancún (Benito Juárez)", "Playa del Carmen (Solidaridad)", "Chetumal (Othón P. Blanco)", "Tulum", "Cozumel"],
                "Yucatán": ["Mérida", "Valladolid", "Progreso", "Tizimín"],
                "Veracruz": ["Veracruz", "Xalapa", "Boca del Río", "Coatzacoalcos", "Poza Rica", "Córdoba", "Orizaba"],
                "Baja California": ["Tijuana", "Mexicali", "Ensenada", "Playas de Rosarito", "Tecate"],
                "Chihuahua": ["Ciudad Juárez", "Chihuahua", "Delicias", "Cuauhtémoc"],
                "Coahuila": ["Saltillo", "Torreón", "Monclova", "Piedras Negras"],
                "Sonora": ["Hermosillo", "Ciudad Obregón", "Nogales", "San Luis Río Colorado", "Guaymas"],
                "Sinaloa": ["Culiacán", "Mazatlán", "Los Mochis (Ahome)", "Guasave"],
                "Tamaulipas": ["Reynosa", "Matamoros", "Nuevo Laredo", "Tampico", "Ciudad Victoria"],
                "San Luis Potosí": ["San Luis Potosí", "Soledad de Graciano Sánchez", "Ciudad Valles", "Matehuala"],
                "Aguascalientes": ["Aguascalientes", "Jesús María", "Calvillo"],
                "Michoacán": ["Morelia", "Uruapan", "Zamora", "Lázaro Cárdenas"],
                "Hidalgo": ["Pachuca", "Tulancingo", "Tula de Allende", "Mineral de la Reforma"],
                "Morelos": ["Cuernavaca", "Jiutepec", "Cuautla", "Temixco"],
                "Tabasco": ["Villahermosa (Centro)", "Cárdenas", "Comalcalco"],
                "Chiapas": ["Tuxtla Gutiérrez", "Tapachula", "San Cristóbal de las Casas", "Comitán"],
                "Oaxaca": ["Oaxaca de Juárez", "Salina Cruz", "Juchitán", "Santa Cruz Huatulco", "Puerto Escondido"],
                "Guerrero": ["Acapulco", "Chilpancingo", "Zihuatanejo", "Iguala"],
                "Zacatecas": ["Zacatecas", "Guadalupe", "Fresnillo"],
                "Durango": ["Durango", "Gómez Palacio", "Lerdo"],
                "Nayarit": ["Tepic", "Bahía de Banderas"],
                "Colima": ["Colima", "Manzanillo", "Villa de Álvarez"],
                "Campeche": ["San Francisco de Campeche", "Ciudad del Carmen"],
                "Baja California Sur": ["La Paz", "Los Cabos (San José del Cabo / Cabo San Lucas)"],
                "Tlaxcala": ["Tlaxcala", "Apizaco", "Huamantla"]
            }
        }
    },

    // Configuración oficial del Club VIP Tu Figura Yaa
    vipClub: {
        name: "Club VIP Tu Figura Yaa",
        discountPercent: 30, // 30% OFF en todos los productos
        durationDays: 365,   // Membresía con duración de 1 año
        prices: {
            CO: 100000,      // $100.000 COP
            MX: 500          // $500 MXN
        }
    }
};

// Manejo del País Activo
function getActiveCountryCode() {
    try {
        const saved = localStorage.getItem("tufigura_selected_country");
        if (saved && STORE_CONFIG.countries[saved]) {
            return saved;
        }
    } catch (e) {}
    return "CO"; // Por defecto Colombia
}

function setActiveCountryCode(code) {
    if (STORE_CONFIG.countries[code]) {
        try {
            localStorage.setItem("tufigura_selected_country", code);
        } catch (e) {}
    }
}

function getActiveCountry() {
    return STORE_CONFIG.countries[getActiveCountryCode()];
}

// Formateador dinámico según el país activo (COP o MXN)
function formatPrice(amount, countryCode = null) {
    if (isNaN(amount)) amount = 0;
    const country = countryCode ? STORE_CONFIG.countries[countryCode] : getActiveCountry();
    
    if (country.code === "MX") {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0
        }).format(amount) + " MXN";
    }

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(amount) + " COP";
}

// Helper retrocompatible
function formatCOP(amount) {
    return formatPrice(amount, "CO");
}

// Funciones de conversión exacta entre monedas
function convertMXNtoCOP(amountMXN) {
    const rate = STORE_CONFIG.exchangeRate ? STORE_CONFIG.exchangeRate.MXN_to_COP : 188.74;
    return Math.round(amountMXN * rate);
}

function convertCOPtoMXN(amountCOP) {
    const rate = STORE_CONFIG.exchangeRate ? STORE_CONFIG.exchangeRate.MXN_to_COP : 188.74;
    return Math.round(amountCOP / rate);
}

// ====================================================================
// HELPERS DEL CLUB VIP (MEMBRESÍA ANUAL CON 30% OFF)
// ====================================================================
function isVipMember() {
    try {
        const raw = localStorage.getItem("tufigura_vip_membership");
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (!data || !data.active) return false;
        if (data.expiry && new Date(data.expiry) < new Date()) {
            localStorage.removeItem("tufigura_vip_membership");
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}

function getVipMembershipInfo() {
    try {
        const raw = localStorage.getItem("tufigura_vip_membership");
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function activateVipMembership() {
    const country = getActiveCountry();
    const now = new Date();
    const expiry = new Date();
    expiry.setFullYear(now.getFullYear() + 1); // 1 año de duración

    const membershipData = {
        active: true,
        startDate: now.toISOString(),
        expiry: expiry.toISOString(),
        discountPercent: 30,
        countryCode: country.code,
        pricePaid: STORE_CONFIG.vipClub.prices[country.code] || 100000
    };

    try {
        localStorage.setItem("tufigura_vip_membership", JSON.stringify(membershipData));
    } catch (e) {}

    if (typeof updateVipUI === "function") updateVipUI();
    if (typeof renderProducts === "function") renderProducts();
    if (typeof cart !== "undefined" && typeof renderCartDrawer === "function") {
        cart.saveCart();
        renderCartDrawer(cart.getSummary());
    }
    if (typeof showToast === "function") {
        showToast(`👑 ¡Bienvenida al Club VIP Tu Figura Yaa! Tu 30% de Descuento en todos los productos está ACTIVO durante 1 año.`);
    }
}

function cancelVipMembership() {
    try {
        localStorage.removeItem("tufigura_vip_membership");
    } catch (e) {}

    if (typeof updateVipUI === "function") updateVipUI();
    if (typeof renderProducts === "function") renderProducts();
    if (typeof cart !== "undefined" && typeof renderCartDrawer === "function") {
        cart.saveCart();
        renderCartDrawer(cart.getSummary());
    }
    if (typeof showToast === "function") {
        showToast("Membresía VIP pausada.");
    }
}

