/**
 * ====================================================================
 * TU FIGURA YAA - APLICACIÓN PRINCIPAL (CONTROLADOR MULTI-PAÍS)
 * ====================================================================
 * Soporte reactivo para selector de país (Colombia 🇨🇴 / México 🇲🇽),
 * conversión de moneda en tiempo real, modales y carrito.
 */

const AppState = {
    activeCategory: "all",
    activeCompression: "all",
    sortBy: "featured",
    searchQuery: "",
    selectedQuickViewProduct: null
};

document.addEventListener("DOMContentLoaded", () => {
    initCountrySwitcher();
    initNavigation();
    initCatalog();
    initCartDrawer();
    initSizeCalculator();
    initCheckout();
    initFAQ();
    initCopyButtons();
    initReviewsSection();
    updateVipUI();
    
    // Sincronizar UI con país inicial
    updateUIForActiveCountry();

    // Suscribir render del carrito
    cart.subscribe(renderCartDrawer);
    renderCartDrawer(cart.getSummary());
});

/**
 * -------------------------------------------------------------
 * SELECTOR DE PAÍS (COLOMBIA 🇨🇴 / MÉXICO 🇲🇽)
 * -------------------------------------------------------------
 */
function initCountrySwitcher() {
    const switchers = document.querySelectorAll(".country-select-btn");
    
    switchers.forEach(btn => {
        btn.addEventListener("click", () => {
            const countryCode = btn.dataset.country;
            if (countryCode && countryCode !== getActiveCountryCode()) {
                switchActiveCountry(countryCode);
            }
        });
    });
}

function switchActiveCountry(countryCode) {
    setActiveCountryCode(countryCode);
    const country = getActiveCountry();

    // Actualizar botones de selector
    document.querySelectorAll(".country-select-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.country === countryCode);
    });

    // Actualizar indicador en navbar
    const activeFlagEl = document.getElementById("activeCountryFlag");
    const activeNameEl = document.getElementById("activeCountryName");
    if (activeFlagEl) activeFlagEl.textContent = country.flag;
    if (activeNameEl) activeNameEl.textContent = country.name;

    // Actualizar textos y enlaces
    updateUIForActiveCountry();
    updateVipUI();

    // Re-renderizar catálogo con nueva moneda
    renderProducts();

    // Re-renderizar carrito con nueva divisa
    renderCartDrawer(cart.getSummary());

    // Actualizar formulario de Checkout
    if (typeof checkout !== "undefined" && checkout.renderFormForActiveCountry) {
        checkout.renderFormForActiveCountry();
    }

    // Si la vista rápida está abierta, refrescar precios
    if (AppState.selectedQuickViewProduct) {
        openQuickView(AppState.selectedQuickViewProduct.id);
    }

    showToast(`Cambiado a ${country.flag} ${country.name} • Precios en ${country.currencyCode}`);
}

function updateUIForActiveCountry() {
    const country = getActiveCountry();

    // Cintillo de anuncios dinámico (Contra Entrega ÚNICAMENTE en Cali y San Luis Potosí)
    const announcementBar = document.getElementById("announcementTickerText");
    if (announcementBar) {
        if (country.code === "MX") {
            announcementBar.innerHTML = `
                <div class="announcement-ticker-item"><span>🇲🇽</span><span>Envíos a todo México • Pago Contra Entrega <strong>ÚNICAMENTE en San Luis Potosí</strong></span></div>
                <div class="announcement-ticker-item"><span>✨</span><span>Envío <strong>GRATIS</strong> únicamente en <strong>San Luis Potosí</strong></span></div>
                <div class="announcement-ticker-item"><span>💱</span><span>Tasa oficial exacta: <strong>1 MXN = $188.74 COP</strong></span></div>
                <div class="announcement-ticker-item"><span>👑</span><span>Club VIP: <strong>$500 MXN / Año</strong> con <strong>30% OFF</strong> en todo</span></div>
            `;
        } else {
            announcementBar.innerHTML = `
                <div class="announcement-ticker-item"><span>🚚</span><span>Envíos a toda Colombia • Pago Contra Entrega <strong>ÚNICAMENTE en Cali</strong></span></div>
                <div class="announcement-ticker-item"><span>✨</span><span>Envío <strong>GRATIS</strong> únicamente en la ciudad de <strong>Cali</strong></span></div>
                <div class="announcement-ticker-item"><span>🇨🇴</span><span>Auténtico <strong>Producto Caleño (Cali, Colombia)</strong></span></div>
                <div class="announcement-ticker-item"><span>👑</span><span>Club VIP: <strong>$100.000 COP / Año</strong> con <strong>30% OFF</strong> en todo</span></div>
            `;
        }
    }

    // Resaltar tarjeta VIP según el país activo
    const cardCO = document.getElementById("vipPriceCardCO");
    const cardMX = document.getElementById("vipPriceCardMX");
    if (cardCO && cardMX) {
        cardCO.classList.toggle("selected-country-vip", country.code === "CO");
        cardMX.classList.toggle("selected-country-vip", country.code === "MX");
    }

    // Botón flotante de WhatsApp oficial
    const floatingWhatsApp = document.getElementById("floatingWhatsApp");
    if (floatingWhatsApp) {
        const welcomeText = encodeURIComponent(`¡Hola Tu Figura Yaa (${country.name})! Me gustaría recibir asesoría personalizada para elegir mi faja.`);
        floatingWhatsApp.href = `https://wa.me/${country.whatsappNumber}?text=${welcomeText}`;
    }

    // Actualizar selector visual de banderas
    document.querySelectorAll(".country-select-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.country === country.code);
    });
    const flagEl = document.getElementById("activeCountryFlag");
    const nameEl = document.getElementById("activeCountryName");
    if (flagEl) flagEl.textContent = country.flag;
    if (nameEl) nameEl.textContent = country.name;
}

/**
 * -------------------------------------------------------------
 * NAVEGACIÓN Y NAVBAR
 * -------------------------------------------------------------
 */
function initNavigation() {
    const navbar = document.querySelector(".navbar");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.querySelector(".nav-links");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    if (mobileMenuBtn && navLinks) {
        // Toggle menú hamburguesa
        mobileMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle("active");
            mobileMenuBtn.setAttribute("aria-expanded", isOpen);
            // Cambiar ícono hamburguesa ↔ X
            mobileMenuBtn.innerHTML = isOpen
                ? `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
                : `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
        });

        // Cerrar menú al hacer clic en cualquier enlace
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
                mobileMenuBtn.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
            });
        });

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener("click", (e) => {
            if (navLinks.classList.contains("active") &&
                !navLinks.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove("active");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
                mobileMenuBtn.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
            }
        });

        // Cerrar menú con tecla Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
                mobileMenuBtn.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
                mobileMenuBtn.focus();
            }
        });
    }
}

/**
 * -------------------------------------------------------------
 * CATÁLOGO Y FILTROS
 * -------------------------------------------------------------
 */
function initCatalog() {
    renderCategoryFilters();
    renderProducts();

    const compressionFilter = document.getElementById("compressionFilter");
    if (compressionFilter) {
        compressionFilter.addEventListener("change", (e) => {
            AppState.activeCompression = e.target.value;
            renderProducts();
        });
    }

    const sortFilter = document.getElementById("sortFilter");
    if (sortFilter) {
        sortFilter.addEventListener("change", (e) => {
            AppState.sortBy = e.target.value;
            renderProducts();
        });
    }

    const searchInput = document.getElementById("catalogSearch");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            AppState.searchQuery = e.target.value.toLowerCase().trim();
            renderProducts();
        });
    }
}

function renderCategoryFilters() {
    const container = document.getElementById("categoryTabs");
    if (!container) return;

    container.innerHTML = CATEGORIES_DATA.map(cat => `
        <button type="button" class="filter-tab ${AppState.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
            ${cat.name}
        </button>
    `).join("");

    container.querySelectorAll(".filter-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            container.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            AppState.activeCategory = btn.dataset.category;
            renderProducts();
        });
    });
}

function filterAndSortProducts() {
    let filtered = [...PRODUCTS_DATA];
    const countryCode = getActiveCountryCode();

    if (AppState.activeCategory !== "all") {
        filtered = filtered.filter(p => p.category === AppState.activeCategory);
    }

    if (AppState.activeCompression !== "all") {
        filtered = filtered.filter(p => p.compression === AppState.activeCompression);
    }

    if (AppState.searchQuery) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(AppState.searchQuery) ||
            p.shortDescription.toLowerCase().includes(AppState.searchQuery) ||
            p.categoryLabel.toLowerCase().includes(AppState.searchQuery)
        );
    }

    if (AppState.sortBy === "price-asc") {
        filtered.sort((a, b) => getProductPrice(a, countryCode) - getProductPrice(b, countryCode));
    } else if (AppState.sortBy === "price-desc") {
        filtered.sort((a, b) => getProductPrice(b, countryCode) - getProductPrice(a, countryCode));
    } else if (AppState.sortBy === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
}

function renderProducts() {
    const grid = document.getElementById("productsGrid");
    const countBadge = document.getElementById("catalogProductCount");
    if (!grid) return;

    const products = filterAndSortProducts();
    const countryCode = getActiveCountryCode();

    if (countBadge) {
        countBadge.textContent = `${products.length} productos disponibles`;
    }

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="empty-catalog-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h3>No encontramos productos con estos filtros</h3>
                <p>Intenta cambiar los criterios de búsqueda o seleccionar otra categoría.</p>
                <button class="btn btn-outline-gold" onclick="resetFilters()">Restablecer Filtros</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = products.map(product => {
        const currentPrice = getProductPrice(product, countryCode);
        const origPrice = getProductOriginalPrice(product, countryCode);
        const fallbackUri = `file:///C:/Users/sebas/.gemini/antigravity/brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/${product.image.replace(/.*brain\/f12024de-9e4a-4cdd-997e-f435f1d74ff8\//, '')}`;

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-badge-group">
                    ${product.badge ? `<span class="badge badge-gold">${product.badge}</span>` : ''}
                </div>

                <div class="product-image-container" onclick="openQuickView('${product.id}')">
                    <img src="${product.image}" alt="${product.name}" class="product-img-main" loading="lazy" 
                         onerror="this.onerror=null; this.src='${fallbackUri}';">
                    <button class="btn-quick-view" type="button" onclick="event.stopPropagation(); openQuickView('${product.id}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Vista Rápida
                    </button>
                </div>

                <div class="product-card-body">
                    <div class="product-meta">
                        <span class="product-category-tag">${product.categoryLabel}</span>
                        <span class="product-compression-tag">Compresión ${product.compression}</span>
                    </div>

                    <h3 class="product-title" onclick="openQuickView('${product.id}')">${product.name}</h3>

                    <div class="product-rating">
                        <span class="stars">★★★★★</span>
                        <span class="rating-number">${product.rating}</span>
                        <span class="reviews-count">(${product.reviewsCount})</span>
                    </div>

                    <div class="product-pricing">
                        ${(typeof isVipMember === "function" && isVipMember()) ? `
                            <span class="price-original" style="text-decoration: line-through; color: var(--text-muted); font-size: 0.9rem;">${formatPrice(currentPrice, countryCode)}</span>
                            <span class="price-current gold-gradient-text font-bold" style="font-size: 1.35rem;">${formatPrice(Math.round(currentPrice * 0.70), countryCode)}</span>
                            <span class="badge badge-gold" style="font-size: 0.65rem; padding: 0.15rem 0.45rem;">👑 30% OFF VIP</span>
                        ` : `
                            <span class="price-current">${formatPrice(currentPrice, countryCode)}</span>
                        `}
                    </div>

                    ${!(typeof isVipMember === "function" && isVipMember()) ? `
                        <div class="vip-member-teaser" onclick="document.getElementById('vipClub').scrollIntoView({behavior:'smooth'})" title="Únete al Club VIP por 1 año y compra al 30% OFF">
                            <span>👑 Club VIP: <strong class="gold-text">${formatPrice(Math.round(currentPrice * 0.70), countryCode)}</strong> <small class="gold-text">(30% OFF)</small></span>
                        </div>
                    ` : ''}

                    <div class="product-selectors">
                        <div class="selector-row">
                            <label class="selector-label">Talla:</label>
                            <div class="size-pill-group" id="sizes-${product.id}">
                                ${product.sizes.slice(0, 5).map((size, idx) => `
                                    <button type="button" class="size-pill ${idx === 1 ? 'selected' : ''}" 
                                            onclick="selectProductSize('${product.id}', '${size}', this)">
                                        ${size}
                                    </button>
                                `).join("")}
                            </div>
                        </div>
                    </div>

                    <div class="product-card-actions">
                        <button type="button" class="btn btn-add-to-cart" onclick="addProductFromCard('${product.id}')">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <span>Añadir al Carrito</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function selectProductSize(productId, size, buttonElement) {
    const parent = buttonElement.closest(".size-pill-group");
    if (parent) {
        parent.querySelectorAll(".size-pill").forEach(p => p.classList.remove("selected"));
        buttonElement.classList.add("selected");
    }
}

function getSelectedSizeForProduct(productId) {
    const container = document.getElementById(`sizes-${productId}`);
    if (container) {
        const selected = container.querySelector(".size-pill.selected");
        if (selected) return selected.textContent.trim();
    }
    return "M";
}

function addProductFromCard(productId) {
    const size = getSelectedSizeForProduct(productId);
    const product = getProductById(productId);
    const defaultColor = product && product.colors ? product.colors[0].name : "Negro";

    cart.addItem(productId, size, defaultColor, 1);
    showToast(`¡"${product.name}" (Talla ${size}) agregado al carrito!`);
    openCartDrawer();
}

function resetFilters() {
    AppState.activeCategory = "all";
    AppState.activeCompression = "all";
    AppState.searchQuery = "";
    AppState.sortBy = "featured";

    const compSelect = document.getElementById("compressionFilter");
    if (compSelect) compSelect.value = "all";

    const sortSelect = document.getElementById("sortFilter");
    if (sortSelect) sortSelect.value = "featured";

    const searchInput = document.getElementById("catalogSearch");
    if (searchInput) searchInput.value = "";

    renderCategoryFilters();
    renderProducts();
}

/**
 * -------------------------------------------------------------
 * CARRITO LATERAL (DRAWER)
 * -------------------------------------------------------------
 */
function initCartDrawer() {
    const openBtns = document.querySelectorAll(".open-cart-btn");
    const closeBtn = document.getElementById("closeCartDrawerBtn");
    const overlay = document.getElementById("cartDrawerOverlay");

    openBtns.forEach(btn => btn.addEventListener("click", openCartDrawer));
    if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
    if (overlay) overlay.addEventListener("click", closeCartDrawer);

    const applyCouponBtn = document.getElementById("applyCouponBtn");
    const couponInput = document.getElementById("couponCodeInput");
    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener("click", () => {
            const res = cart.applyCoupon(couponInput.value);
            if (res.success) {
                showToast(`¡Cupón "${res.coupon.code}" aplicado con éxito! ✨`);
                couponInput.value = "";
            } else {
                alert(res.message);
            }
        });
    }

    const checkoutBtn = document.getElementById("goToCheckoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            closeCartDrawer();
            openCheckoutModal();
        });
    }

    const cartWhatsAppBtn = document.getElementById("cartWhatsAppFastBtn");
    if (cartWhatsAppBtn) {
        cartWhatsAppBtn.addEventListener("click", () => {
            const summary = cart.getSummary();
            const country = getActiveCountry();
            if (summary.items.length === 0) return;

            let msg = `👑 *¡Hola Tu Figura Yaa (${country.name})!* Deseo ordenar estos productos:\n`;
            summary.items.forEach(i => {
                msg += `\n• *${i.name}* (Talla: ${i.size}, Color: ${i.color}) x${i.quantity} = ${formatPrice(i.totalPrice, country.code)}`;
            });
            msg += `\n\n*Total:* ${formatPrice(summary.total, country.code)}`;
            msg += `\n¿Tienen disponibilidad para envío inmediato a mi ciudad en ${country.name}?`;

            const url = `https://wa.me/${country.whatsappNumber}?text=${encodeURIComponent(msg)}`;
            window.open(url, "_blank");
        });
    }
}

function openCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartDrawerOverlay");
    if (drawer && overlay) {
        drawer.classList.add("open");
        overlay.classList.add("active");
        document.body.classList.add("modal-open");
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartDrawerOverlay");
    if (drawer && overlay) {
        drawer.classList.remove("open");
        overlay.classList.remove("active");
        document.body.classList.remove("modal-open");
    }
}

function renderCartDrawer(summary) {
    const country = summary.country || getActiveCountry();

    // Contador del header
    const badges = document.querySelectorAll(".cart-counter-badge");
    badges.forEach(b => {
        b.textContent = summary.count;
        b.classList.toggle("hidden", summary.count === 0);
    });

    // Notificación de envío exclusivo por ciudad
    const progressBar = document.getElementById("freeShippingBarFill");
    const progressNotice = document.getElementById("freeShippingNotice");
    if (progressNotice) {
        if (country.code === "CO") {
            progressNotice.innerHTML = `🚚 Envíos a toda Colombia • <strong>Envío GRATIS únicamente en Cali</strong>`;
        } else {
            progressNotice.innerHTML = `🇲🇽 Envíos a todo México • <strong>Envío GRATIS únicamente en San Luis Potosí</strong>`;
        }
    }
    if (progressBar) {
        progressBar.style.width = "100%";
        progressBar.classList.add("completed");
    }

    // Lista de items
    const itemsList = document.getElementById("cartDrawerItems");
    const emptyState = document.getElementById("cartDrawerEmpty");
    const footer = document.getElementById("cartDrawerFooter");

    if (summary.items.length === 0) {
        if (itemsList) itemsList.innerHTML = "";
        if (emptyState) emptyState.classList.remove("hidden");
        if (footer) footer.classList.add("hidden");
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    if (footer) footer.classList.remove("hidden");

    if (itemsList) {
        itemsList.innerHTML = summary.items.map(item => `
            <div class="cart-item-row" data-key="${item.key}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-variant">Talla: <strong>${item.size}</strong> • Color: <strong>${item.color}</strong></p>
                    <div class="cart-item-price-row">
                        <span class="cart-item-price">${formatPrice(item.price, country.code)}</span>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-stepper">
                            <button type="button" class="stepper-btn" onclick="cart.updateQuantity('${item.key}', -1)">-</button>
                            <span class="stepper-val">${item.quantity}</span>
                            <button type="button" class="stepper-btn" onclick="cart.updateQuantity('${item.key}', 1)">+</button>
                        </div>
                        <button type="button" class="btn-remove-item" onclick="cart.removeItem('${item.key}')" title="Eliminar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    // Totales
    const subtotalEl = document.getElementById("cartSubtotalVal");
    const discountRow = document.getElementById("cartDiscountRow");
    const discountEl = document.getElementById("cartDiscountVal");
    const shippingEl = document.getElementById("cartShippingVal");
    const totalEl = document.getElementById("cartTotalVal");

    if (subtotalEl) subtotalEl.textContent = formatPrice(summary.subtotal, country.code);
    
    if (discountRow && discountEl) {
        if (summary.discount > 0) {
            discountRow.classList.remove("hidden");
            if (summary.isVipMember) {
                discountRow.querySelector("span").textContent = "👑 Descuento Club VIP (30%):";
            } else {
                discountRow.querySelector("span").textContent = "Descuento aplicado:";
            }
            discountEl.textContent = `-${formatPrice(summary.discount, country.code)}`;
        } else {
            discountRow.classList.add("hidden");
        }
    }

    // Banner VIP en el carrito
    let vipDrawerNotice = document.getElementById("cartDrawerVipNotice");
    if (!vipDrawerNotice && footer) {
        vipDrawerNotice = document.createElement("div");
        vipDrawerNotice.id = "cartDrawerVipNotice";
        footer.insertBefore(vipDrawerNotice, footer.firstChild);
    }
    if (vipDrawerNotice) {
        if (summary.isVipMember) {
            vipDrawerNotice.innerHTML = `
                <div class="cart-vip-active-banner">
                    <span>👑 <strong>Socia Club VIP Activa:</strong> 30% de descuento aplicado en todo tu pedido.</span>
                </div>
            `;
        } else {
            const vipPrice = STORE_CONFIG.vipClub.prices[country.code];
            vipDrawerNotice.innerHTML = `
                <div class="cart-vip-invite-banner">
                    <div>
                        <strong>👑 ¿Deseas 30% OFF en este pedido?</strong>
                        <p>Únete al Club VIP por ${formatPrice(vipPrice, country.code)} (válido por 1 año completo).</p>
                    </div>
                    <button type="button" class="btn btn-gold btn-sm" onclick="activateVipMembership()">Activar 30%</button>
                </div>
            `;
        }
    }

    if (shippingEl) {
        if (country.code === "CO") {
            shippingEl.innerHTML = `<span class="gold-text">GRATIS en Cali</span> <span class="text-xs text-muted">($15.000 resto país)</span>`;
        } else {
            shippingEl.innerHTML = `<span class="gold-text">GRATIS en San Luis Potosí</span> <span class="text-xs text-muted">($149 resto)</span>`;
        }
    }

    if (totalEl) totalEl.textContent = formatPrice(summary.total, country.code);
}

/**
 * -------------------------------------------------------------
 * VISTA RÁPIDA (QUICK VIEW)
 * -------------------------------------------------------------
 */
function openQuickView(productId) {
    const product = getProductById(productId);
    if (!product) return;

    AppState.selectedQuickViewProduct = product;
    const modal = document.getElementById("quickViewModal");
    const content = document.getElementById("quickViewContent");
    if (!modal || !content) return;

    const countryCode = getActiveCountryCode();
    const currentPrice = getProductPrice(product, countryCode);
    const origPrice = getProductOriginalPrice(product, countryCode);
    const isVip = typeof isVipMember === "function" && isVipMember();
    const vipPrice = Math.round(currentPrice * 0.70);

    let selectedSize = product.sizes[0];
    let selectedColor = product.colors[0].name;
    const fallbackUri = `file:///C:/Users/sebas/.gemini/antigravity/brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/${product.image.replace(/.*brain\/f12024de-9e4a-4cdd-997e-f435f1d74ff8\//, '')}`;

    content.innerHTML = `
        <div class="quick-view-grid">
            <div class="qv-gallery">
                <img src="${product.image}" id="qvMainImage" class="qv-main-img" alt="${product.name}" onerror="this.onerror=null; this.src='${fallbackUri}';">
                <div class="qv-thumbs">
                    <img src="${product.image}" class="qv-thumb active" onclick="document.getElementById('qvMainImage').src='${product.image}'" onerror="this.onerror=null; this.src='${fallbackUri}';">
                    ${product.secondaryImage ? `<img src="${product.secondaryImage}" class="qv-thumb" onclick="document.getElementById('qvMainImage').src='${product.secondaryImage}'" onerror="this.onerror=null; this.src='${fallbackUri}';">` : ''}
                </div>
            </div>

            <div class="qv-details">
                <div class="qv-meta">
                    <span class="badge badge-gold">${product.categoryLabel}</span>
                    <span class="badge badge-outline">Compresión ${product.compression}</span>
                </div>

                <h2 class="qv-title">${product.name}</h2>

                <div class="qv-rating">
                    <span class="stars">★★★★★</span>
                    <span class="rating-number">${product.rating}</span>
                    <span class="reviews-count">(${product.reviewsCount} opiniones verificadas)</span>
                </div>

                <div class="qv-pricing">
                    ${isVip ? `
                        <span class="price-original" style="text-decoration: line-through; color: var(--text-muted); font-size: 1.05rem;">${formatPrice(currentPrice, countryCode)}</span>
                        <span class="price-current gold-gradient-text font-bold" style="font-size: 1.6rem;">${formatPrice(vipPrice, countryCode)}</span>
                        <span class="badge badge-gold">👑 30% OFF Club VIP</span>
                    ` : `
                        <span class="price-current">${formatPrice(currentPrice, countryCode)}</span>
                    `}
                </div>
                ${!isVip ? `
                    <div class="vip-member-teaser" style="margin-top: -0.35rem; margin-bottom: 1rem; cursor: pointer;" onclick="closeQuickView(); document.getElementById('vipClub').scrollIntoView({behavior:'smooth'})">
                        <span>👑 Precio Club VIP: <strong class="gold-text">${formatPrice(vipPrice, countryCode)}</strong> <small class="gold-text">(30% OFF con membresía)</small></span>
                    </div>
                ` : ''}

                <p class="qv-desc">${product.shortDescription}</p>

                <div class="qv-features">
                    <h4>Beneficios Clave:</h4>
                    <ul>
                        ${product.features.map(f => `<li>• ${f}</li>`).join("")}
                    </ul>
                </div>

                <div class="qv-selectors">
                    <div class="selector-group">
                        <label>Talla Seleccionada: <strong id="qvSelectedSizeLabel">${selectedSize}</strong></label>
                        <div class="size-pill-group" id="qvSizesGroup">
                            ${product.sizes.map((s, idx) => `
                                <button type="button" class="size-pill ${idx === 0 ? 'selected' : ''}" 
                                        onclick="updateQuickViewSize('${s}', this)">${s}</button>
                            `).join("")}
                        </div>
                    </div>

                    <div class="selector-group">
                        <label>Color: <strong id="qvSelectedColorLabel">${selectedColor}</strong></label>
                        <div class="color-swatch-group">
                            ${product.colors.map((c, idx) => `
                                <button type="button" class="color-swatch ${idx === 0 ? 'selected' : ''}" 
                                        style="background-color: ${c.hex};" 
                                        title="${c.name}"
                                        onclick="updateQuickViewColor('${c.name}', this)">
                                </button>
                            `).join("")}
                        </div>
                    </div>
                </div>

                <div class="qv-actions">
                    <button type="button" class="btn btn-gold btn-large" id="qvAddToCartBtn" 
                            onclick="addCurrentQuickViewToCart()">
                        Añadir al Carrito
                    </button>
                    <button type="button" class="btn btn-outline" onclick="openSizeCalculatorModal()">
                        📏 Guía de Tallas
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

function updateQuickViewSize(size, btn) {
    btn.closest(".size-pill-group").querySelectorAll(".size-pill").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    const label = document.getElementById("qvSelectedSizeLabel");
    if (label) label.textContent = size;
}

function updateQuickViewColor(color, btn) {
    btn.closest(".color-swatch-group").querySelectorAll(".color-swatch").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    const label = document.getElementById("qvSelectedColorLabel");
    if (label) label.textContent = color;
}

function addCurrentQuickViewToCart() {
    if (!AppState.selectedQuickViewProduct) return;
    const size = document.getElementById("qvSelectedSizeLabel")?.textContent || "M";
    const color = document.getElementById("qvSelectedColorLabel")?.textContent || "Negro";
    
    cart.addItem(AppState.selectedQuickViewProduct.id, size, color, 1);
    closeQuickView();
    showToast(`¡"${AppState.selectedQuickViewProduct.name}" agregado al carrito! ✨`);
    openCartDrawer();
}

function closeQuickView() {
    const modal = document.getElementById("quickViewModal");
    if (modal) modal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

/**
 * -------------------------------------------------------------
 * CALCULADORA DE TALLAS
 * -------------------------------------------------------------
 */
function initSizeCalculator() {
    const calcForm = document.getElementById("sizeCalculatorForm");
    if (!calcForm) return;

    calcForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const waist = document.getElementById("calcWaist").value;
        const hip = document.getElementById("calcHip").value;
        const bust = document.getElementById("calcBust")?.value;
        const experienced = document.getElementById("calcExperienced")?.checked;
        const goal = document.getElementById("calcGoal")?.value || "general";

        const result = calculateRecommendedSize(waist, hip, bust, experienced, goal);
        renderSizeResult(result);
    });

    document.querySelectorAll(".open-size-modal-btn").forEach(btn => {
        btn.addEventListener("click", openSizeCalculatorModal);
    });
}

function openSizeCalculatorModal() {
    const modal = document.getElementById("sizeGuideModal");
    if (modal) {
        modal.classList.add("active");
        document.body.classList.add("modal-open");
    }
}

function closeSizeCalculatorModal() {
    const modal = document.getElementById("sizeGuideModal");
    if (modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }
}

function renderSizeResult(result) {
    const box = document.getElementById("sizeCalculatorResult");
    if (!box) return;

    if (result.error) {
        box.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
        box.classList.remove("hidden");
        return;
    }

    const country = getActiveCountry();
    const faja = result.perfectFaja;
    const fajaObj = faja ? getProductById(faja.id) : null;
    const currentPrice = fajaObj ? getProductPrice(fajaObj, country.code) : (country.code === "MX" ? faja.priceMXN : faja.priceCOP);
    const fallbackUri = faja ? `file:///C:/Users/sebas/.gemini/antigravity/brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/${faja.image.replace(/.*brain\/f12024de-9e4a-4cdd-997e-f435f1d74ff8\//, '')}` : '';

    box.innerHTML = `
        <div class="recommended-size-card">
            <span class="rec-subhead">Tu Talla Recomendada es:</span>
            <div class="rec-size-badge">${result.size}</div>
            <p class="rec-advice"><strong>${result.advice}</strong></p>
            <p class="rec-tip">${result.experienceTip}</p>
        </div>

        ${faja ? `
            <div class="perfect-faja-recommendation-box">
                <div class="perfect-faja-header">
                    <span class="badge badge-gold">👑 Tu Faja Perfecta Recomendada</span>
                    <span class="perfect-faja-tag">${faja.categoryLabel}</span>
                </div>
                <div class="perfect-faja-body">
                    <img src="${faja.image}" alt="${faja.name}" class="perfect-faja-thumb" onerror="this.onerror=null; this.src='${fallbackUri}';">
                    <div class="perfect-faja-info">
                        <h4 class="perfect-faja-title">${faja.name}</h4>
                        <div class="perfect-faja-price">${formatPrice(currentPrice, country.code)}</div>
                        <p class="perfect-faja-reason">${faja.reason}</p>
                        <div class="perfect-faja-actions">
                            <button type="button" class="btn btn-gold btn-sm" onclick="selectAndOpenFaja('${faja.id}', '${result.size}')">
                                Elegir Esta Faja en Talla ${result.size} ✨
                            </button>
                            <button type="button" class="btn btn-outline btn-sm" onclick="filterByCalculatedSize('${result.size}')">
                                Ver Todo el Catálogo en ${result.size}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ` : `
            <div style="margin-top: 1rem; text-align: center;">
                <button type="button" class="btn btn-gold btn-sm" onclick="filterByCalculatedSize('${result.size}')">
                    Ver fajas disponibles en talla ${result.size}
                </button>
            </div>
        `}
    `;
    box.classList.remove("hidden");
}

function selectAndOpenFaja(fajaId, size) {
    closeSizeCalculatorModal();
    openQuickView(fajaId);
    setTimeout(() => {
        const sizeBtns = document.querySelectorAll("#qvSizesGroup .size-pill");
        sizeBtns.forEach(btn => {
            if (btn.textContent.trim() === size) {
                updateQuickViewSize(size, btn);
            }
        });
    }, 150);
}

function filterByCalculatedSize(size) {
    closeSizeCalculatorModal();
    const catalogSection = document.getElementById("catalogo");
    if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: "smooth" });
    }
    showToast(`Mostrando catálogo. Te recomendamos elegir talla ${size} al agregar al carrito.`);
}

/**
 * -------------------------------------------------------------
 * CHECKOUT MODAL
 * -------------------------------------------------------------
 */
function initCheckout() {
    checkout.init();

    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            checkout.processOrder();
        });
    }
}

function openCheckoutModal() {
    const modal = document.getElementById("checkoutModal");
    const summary = cart.getSummary();
    const country = getActiveCountry();

    if (summary.items.length === 0) {
        alert("Agrega al menos un producto al carrito antes de proceder.");
        return;
    }

    // Actualizar resumen
    const checkoutTotalEl = document.getElementById("checkoutSummaryTotal");
    const checkoutItemsCount = document.getElementById("checkoutSummaryCount");
    if (checkoutTotalEl) checkoutTotalEl.textContent = formatPrice(summary.total, country.code);
    if (checkoutItemsCount) checkoutItemsCount.textContent = `${summary.count} producto(s)`;

    checkout.renderFormForActiveCountry();

    if (modal) {
        modal.classList.add("active");
        document.body.classList.add("modal-open");
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById("checkoutModal");
    if (modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }
}

/**
 * -------------------------------------------------------------
 * FAQ ACCORDION
 * -------------------------------------------------------------
 */
function initFAQ() {
    const headers = document.querySelectorAll(".faq-item-header");
    headers.forEach(header => {
        header.addEventListener("click", () => {
            const parent = header.closest(".faq-item");
            const isOpen = parent.classList.contains("open");

            document.querySelectorAll(".faq-item").forEach(item => item.classList.remove("open"));

            if (!isOpen) {
                parent.classList.add("open");
            }
        });
    });
}

/**
 * -------------------------------------------------------------
 * COPIAR DATOS BANCARIOS / CLABE / OXXO
 * -------------------------------------------------------------
 */
function initCopyButtons() {
    document.querySelectorAll(".btn-copy-account").forEach(btn => {
        btn.onclick = () => {
            const textToCopy = btn.dataset.copy;
            if (navigator.clipboard && textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = `✓ ¡Copiado!`;
                    setTimeout(() => { btn.innerHTML = originalText; }, 2000);
                });
            }
        };
    });
}

/**
 * -------------------------------------------------------------
 * TOAST NOTIFICATIONS
 * -------------------------------------------------------------
 */
function showToast(message) {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">✨</span>
            <span class="toast-message">${message}</span>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => toast.remove(), 400);
    }, 3200);
}

/**
 * =============================================================
 * CLUB VIP TU FIGURA YAA (MEMBRESÍA ANUAL 30% OFF)
 * =============================================================
 */
function updateVipUI() {
    const isVip = typeof isVipMember === "function" && isVipMember();
    const navVipBadge = document.getElementById("navVipBadge");
    const activeBadge = document.getElementById("vipStatusActiveBadge");
    const ctaBox = document.getElementById("vipCtaBox");
    const activeCard = document.getElementById("vipActiveCard");
    const expiryText = document.getElementById("vipExpiryText");

    if (navVipBadge) {
        navVipBadge.classList.toggle("hidden", !isVip);
    }

    if (activeBadge) {
        activeBadge.classList.toggle("hidden", !isVip);
    }

    if (ctaBox && activeCard) {
        if (isVip) {
            ctaBox.classList.add("hidden");
            activeCard.classList.remove("hidden");
            const info = getVipMembershipInfo();
            if (info && info.expiry && expiryText) {
                const dateObj = new Date(info.expiry);
                expiryText.textContent = `Vigencia de tu membresía activa hasta: ${dateObj.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}.`;
            }
        } else {
            ctaBox.classList.remove("hidden");
            activeCard.classList.add("hidden");
        }
    }
}

/**
 * =============================================================
 * COMENTARIOS Y EXPERIENCIAS DE CLIENTAS CON FOTOS
 * =============================================================
 */
const INITIAL_REVIEWS_DATA = [
    {
        id: "rev_1",
        author: "Valentina Morales",
        location: "Cali, Colombia",
        product: "Faja Sisa Broches Short Medio (REF. 705)",
        rating: 5,
        date: "Hace 2 días",
        comment: "Compré la REF. 705 para mi postoperatorio y ha sido la mejor inversión. La compresión del Powernet caleño es perfecta, no te maltrata y el forro de aloe vera cuida la piel. Me llegó a Cali al día siguiente con pago contra entrega y envío gratis.",
        photo: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1789620499316.png",
        verified: true
    },
    {
        id: "rev_2",
        author: "Mariana Rodríguez",
        location: "San Luis Potosí, México",
        product: "Cinturilla 13 Varillas Broches y Cierre (REF. 819)",
        rating: 5,
        date: "Hace 4 días",
        comment: "Vivo en San Luis Potosí y me entregaron el pedido el mismo día con pago contra entrega en efectivo. La Línea Dorada de 13 varillas te deja una cintura diminuta al instante sin doblarse al sentarse. ¡100% recomendada!",
        photo: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927929390.jpg",
        verified: true
    },
    {
        id: "rev_3",
        author: "Camila Echeverry",
        location: "Medellín, Colombia",
        product: "Corset Reloj de Arena Escote Corazón (REF. 812)",
        rating: 5,
        date: "Hace 1 semana",
        comment: "Adquirí la membresía del Club VIP por los $100.000 COP y con el 30% de descuento me ahorré más de lo que costó en mi primera orden. El corset levanta el busto y define la cintura de forma espectacular. ¡Amor total por el producto caleño!",
        photo: "../../brain/f12024de-9e4a-4cdd-997e-f435f1d74ff8/.user_uploaded/media_1791927902887.png",
        verified: true
    }
];

let currentReviewRating = 5;
let selectedReviewPhotoBase64 = null;

function getStoredReviews() {
    try {
        const raw = localStorage.getItem("tufigura_client_reviews");
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}
    return [...INITIAL_REVIEWS_DATA];
}

function saveStoredReviews(reviews) {
    try {
        localStorage.setItem("tufigura_client_reviews", JSON.stringify(reviews));
    } catch (e) {
        console.error("Error guardando opiniones en localStorage:", e);
    }
}

function initReviewsSection() {
    renderReviews();
    setupStarPicker();
}

function setupStarPicker() {
    const container = document.getElementById("starRatingPicker");
    if (!container) return;

    const stars = container.querySelectorAll(".star-picker-btn");
    const label = document.getElementById("ratingTextLabel");

    stars.forEach(btn => {
        btn.addEventListener("click", () => {
            const rating = parseInt(btn.dataset.rating, 10);
            setRating(rating);
        });

        btn.addEventListener("mouseenter", () => {
            const rating = parseInt(btn.dataset.rating, 10);
            highlightStars(rating);
        });
    });

    container.addEventListener("mouseleave", () => {
        highlightStars(currentReviewRating);
    });
}

function setRating(rating) {
    currentReviewRating = rating;
    highlightStars(rating);
    const label = document.getElementById("ratingTextLabel");
    if (label) {
        const labels = {
            1: "1.0 - Muy insatisfecha",
            2: "2.0 - Regular",
            3: "3.0 - Buena",
            4: "4.0 - Muy buena",
            5: "5.0 de 5 estrellas (¡Excelente!)"
        };
        label.textContent = labels[rating] || `${rating}.0 de 5 estrellas`;
    }
}

function highlightStars(rating) {
    const container = document.getElementById("starRatingPicker");
    if (!container) return;
    const stars = container.querySelectorAll(".star-picker-btn");
    stars.forEach(btn => {
        const val = parseInt(btn.dataset.rating, 10);
        btn.classList.toggle("active", val <= rating);
    });
}

function handleReviewPhotoSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona una imagen válida (JPG, PNG o WEBP).");
        return;
    }

    if (file.size > 8 * 1024 * 1024) {
        alert("La imagen no debe pesar más de 8MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        selectedReviewPhotoBase64 = e.target.result;
        const previewImg = document.getElementById("reviewPhotoPreviewImg");
        const previewName = document.getElementById("reviewPhotoPreviewName");
        const wrapper = document.getElementById("reviewPhotoPreviewWrapper");
        if (previewImg) previewImg.src = selectedReviewPhotoBase64;
        if (previewName) previewName.textContent = file.name;
        if (wrapper) wrapper.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
}

function removeSelectedReviewPhoto() {
    selectedReviewPhotoBase64 = null;
    const input = document.getElementById("reviewPhotoInput");
    if (input) input.value = "";
    const wrapper = document.getElementById("reviewPhotoPreviewWrapper");
    if (wrapper) wrapper.classList.add("hidden");
}

function submitClientReview(event) {
    event.preventDefault();
    const name = document.getElementById("reviewAuthorName")?.value.trim();
    const city = document.getElementById("reviewAuthorCity")?.value.trim();
    const product = document.getElementById("reviewProductSelect")?.value.trim();
    const comment = document.getElementById("reviewCommentText")?.value.trim();

    if (!name || !city || !product || !comment) {
        alert("Por favor completa los campos obligatorios (*) de tu comentario.");
        return;
    }

    const newReview = {
        id: "rev_" + Date.now(),
        author: name,
        location: city,
        product: product,
        rating: currentReviewRating,
        date: "Hoy",
        comment: comment,
        photo: selectedReviewPhotoBase64 || null,
        verified: true
    };

    const reviews = getStoredReviews();
    reviews.unshift(newReview);
    saveStoredReviews(reviews);
    renderReviews();

    // Limpiar formulario
    document.getElementById("clientReviewForm").reset();
    removeSelectedReviewPhoto();
    setRating(5);

    showToast(`¡Gracias ${name}! Tu experiencia y fotografía se publicaron en la comunidad oficial ✨`);

    // Desplazar suavemente a los comentarios
    document.getElementById("reviewsFeedGrid")?.scrollIntoView({ behavior: "smooth" });
}

function renderReviews() {
    const grid = document.getElementById("reviewsFeedGrid");
    if (!grid) return;

    const reviews = getStoredReviews();

    grid.innerHTML = reviews.map(rev => {
        const initial = rev.author ? rev.author.charAt(0).toUpperCase() : "C";
        const starsHtml = "★".repeat(rev.rating) + "☆".repeat(5 - rev.rating);

        return `
            <div class="review-card" data-review-id="${rev.id}">
                <div>
                    <div class="review-header">
                        <div class="reviewer-avatar-circle">${initial}</div>
                        <div>
                            <h4 class="reviewer-name">${rev.author}</h4>
                            <span class="reviewer-location">${rev.location} • <small>${rev.date}</small></span>
                        </div>
                    </div>

                    <div class="product-rating">
                        <span class="stars">${starsHtml}</span>
                        <span class="gold-text font-bold">${rev.rating}.0</span>
                    </div>

                    <p class="review-text">"${rev.comment}"</p>

                    ${rev.photo ? `
                        <div class="review-attached-photo-box" onclick="openPhotoZoomModal('${rev.photo}')" title="Clic para ampliar foto de clienta">
                            <img src="${rev.photo}" alt="Foto de experiencia con la faja" class="review-attached-photo-img" loading="lazy">
                            <div class="photo-overlay-tag">
                                <span>📷 Foto de Clienta</span>
                                <small>Ampliar 🔍</small>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="review-footer">
                    <span class="verified-buyer-tag">✓ Compra Verificada</span>
                    <span class="review-product-tag">${rev.product}</span>
                </div>
            </div>
        `;
    }).join("");
}

function openPhotoZoomModal(photoSrc) {
    let modal = document.getElementById("photoZoomModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "photoZoomModal";
        modal.className = "modal-backdrop";
        modal.innerHTML = `
            <div class="modal-container photo-zoom-modal-container">
                <div class="modal-header">
                    <span class="modal-title">📷 Fotografía Compartida por Clienta</span>
                    <button type="button" class="modal-close-btn" onclick="closePhotoZoomModal()">✕</button>
                </div>
                <div class="modal-body photo-zoom-modal-body">
                    <img id="photoZoomModalImg" src="" alt="Foto de resultado ampliada" class="photo-zoom-full-img">
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closePhotoZoomModal();
        });
    }

    const img = document.getElementById("photoZoomModalImg");
    if (img) img.src = photoSrc;
    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

function closePhotoZoomModal() {
    const modal = document.getElementById("photoZoomModal");
    if (modal) modal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

