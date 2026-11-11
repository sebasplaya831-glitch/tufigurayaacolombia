/**
 * ====================================================================
 * TU FIGURA YAA - SISTEMA DE CARRITO MULTI-DIVISA (localStorage)
 * ====================================================================
 * Soporte reactivo para cambios de país entre Colombia y México.
 */

class CartManager {
    constructor() {
        this.storageKey = "tufigura_cart_v2";
        this.couponKey = "tufigura_coupon_v2";
        this.items = this.loadCart();
        this.appliedCoupon = this.loadCoupon();
        this.listeners = [];
    }

    loadCart() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error al cargar carrito desde localStorage:", e);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
            this.notifyListeners();
        } catch (e) {
            console.error("Error al guardar carrito en localStorage:", e);
        }
    }

    loadCoupon() {
        try {
            const country = getActiveCountry();
            const code = localStorage.getItem(this.couponKey);
            if (code && country.coupons[code]) {
                return { code, ...country.coupons[code] };
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    saveCoupon(coupon) {
        if (coupon) {
            localStorage.setItem(this.couponKey, coupon.code);
            this.appliedCoupon = coupon;
        } else {
            localStorage.removeItem(this.couponKey);
            this.appliedCoupon = null;
        }
        this.saveCart();
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(cb => cb(this.getSummary()));
    }

    /**
     * Agrega un producto al carrito
     */
    addItem(productId, size = "M", color = "Negro", quantity = 1) {
        const product = getProductById(productId);
        if (!product) return false;

        const itemKey = `${productId}_${size}_${color}`;
        const existingIndex = this.items.findIndex(item => item.key === itemKey);

        if (existingIndex > -1) {
            this.items[existingIndex].quantity += quantity;
        } else {
            this.items.push({
                key: itemKey,
                id: product.id,
                name: product.name,
                image: product.image,
                categoryLabel: product.categoryLabel,
                size: size,
                color: color,
                quantity: quantity
            });
        }

        this.saveCart();
        return true;
    }

    updateQuantity(itemKey, delta) {
        const index = this.items.findIndex(item => item.key === itemKey);
        if (index > -1) {
            const newQty = this.items[index].quantity + delta;
            if (newQty <= 0) {
                this.removeItem(itemKey);
            } else {
                this.items[index].quantity = newQty;
                this.saveCart();
            }
        }
    }

    removeItem(itemKey) {
        this.items = this.items.filter(item => item.key !== itemKey);
        this.saveCart();
    }

    clearCart() {
        this.items = [];
        this.appliedCoupon = null;
        localStorage.removeItem(this.couponKey);
        this.saveCart();
    }

    applyCoupon(code) {
        const country = getActiveCountry();
        const cleanCode = (code || "").trim().toUpperCase();
        
        if (country.coupons[cleanCode]) {
            const coupon = { code: cleanCode, ...country.coupons[cleanCode] };
            this.saveCoupon(coupon);
            return { success: true, coupon };
        }
        return { success: false, message: `Cupón no válido para ${country.name}.` };
    }

    removeCoupon() {
        this.saveCoupon(null);
    }

    /**
     * Calcula resumen dinámico según la divisa del país activo y estado VIP
     */
    getSummary(destinationCity = null) {
        const country = getActiveCountry();
        const count = this.items.reduce((acc, item) => acc + item.quantity, 0);
        const vipActive = typeof isVipMember === "function" && isVipMember();

        // Mapear items con el precio actual en la moneda activa
        const enrichedItems = this.items.map(item => {
            const product = getProductById(item.id);
            const unitPrice = product ? getProductPrice(product, country.code) : 0;
            return {
                ...item,
                price: unitPrice,
                totalPrice: unitPrice * item.quantity
            };
        });

        const subtotal = enrichedItems.reduce((acc, item) => acc + item.totalPrice, 0);
        
        // Descuento oficial del Club VIP Tu Figura Yaa (30% OFF en todos los productos)
        let vipDiscount = 0;
        if (vipActive && subtotal > 0) {
            vipDiscount = Math.round(subtotal * 0.30);
        }

        // Descuento de cupón (si existiera)
        let couponDiscount = 0;
        if (this.appliedCoupon) {
            if (this.appliedCoupon.discountPercent) {
                couponDiscount = Math.round(subtotal * (this.appliedCoupon.discountPercent / 100));
            } else if (this.appliedCoupon.discountAmount) {
                couponDiscount = Math.min(this.appliedCoupon.discountAmount, subtotal);
            }
        }

        const totalDiscount = vipDiscount + couponDiscount;

        // Envío según país y ciudad de destino (Gratis exclusivamente en Cali para CO y San Luis Potosí para MX)
        const freeCity = (country.shipping.freeShippingCity || "").toLowerCase();
        const destCity = (destinationCity || "").toLowerCase().trim();
        const isFreeShipping = Boolean(destCity && (destCity.includes(freeCity) || freeCity.includes(destCity)));
        const shippingCost = isFreeShipping || subtotal === 0 ? 0 : country.shipping.standardShippingCost;

        const total = Math.max(0, subtotal - totalDiscount + shippingCost);

        return {
            country: country,
            items: enrichedItems,
            count,
            subtotal,
            discount: totalDiscount,
            vipDiscount: vipDiscount,
            isVipMember: vipActive,
            vipDiscountPercent: 30,
            appliedCoupon: this.appliedCoupon,
            shippingCost,
            isFreeShipping,
            freeShippingCity: country.shipping.freeShippingCity,
            destinationCity: destinationCity,
            total
        };
    }
}

// Instancia global
const cart = new CartManager();
