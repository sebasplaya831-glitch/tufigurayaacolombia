/**
 * ====================================================================
 * TU FIGURA YAA - CHECKOUT BINACIONAL (COLOMBIA & MÉXICO)
 * ====================================================================
 * Adapta dinámicamente formularios, ubicaciones, métodos de pago,
 * persistencia de pedidos y envío de comprobantes a WhatsApp.
 */

class CheckoutManager {
    constructor() {
        this.formData = {};
        this.selectedPaymentMethod = "contraentrega";
        this.currentOrder = null;
    }

    init() {
        this.renderFormForActiveCountry();
        this.bindEvents();
    }

    renderFormForActiveCountry() {
        const country = getActiveCountry();
        const container = document.getElementById("checkoutDynamicFormFields");
        const paymentOptionsContainer = document.getElementById("checkoutPaymentOptionsGroup");

        if (!container || !paymentOptionsContainer) return;

        // Establecer método de pago inicial según país (OXXO eliminado)
        this.selectedPaymentMethod = country.code === "MX" ? "bancoppel" : "transferencia";

        // 1. Renderizar campos de dirección específicos por país
        if (country.code === "MX") {
            container.innerHTML = `
                <div class="calc-form-grid" style="margin-bottom: 0.75rem;">
                    <div class="form-group">
                        <label class="form-label">Estado de la República (*):</label>
                        <select class="form-select" id="checkoutRegion" required>
                            <option value="">Selecciona tu Estado</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Municipio / Alcaldía (*):</label>
                        <select class="form-select" id="checkoutCity" disabled required>
                            <option value="">Selecciona estado primero</option>
                        </select>
                    </div>
                </div>

                <div class="calc-form-grid" style="margin-bottom: 0.75rem;">
                    <div class="form-group">
                        <label class="form-label">Código Postal / CP (*):</label>
                        <input type="text" class="form-input" id="checkoutPostalCode" placeholder="Ej: 06700" maxlength="5" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Colonia (*):</label>
                        <input type="text" class="form-input" id="checkoutSublocality" placeholder="Ej: Roma Norte" required>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 0.75rem;">
                    <label class="form-label">Calle y Número Exterior / Interior (*):</label>
                    <input type="text" class="form-input" id="checkoutAddress" placeholder="Ej: Av. Álvaro Obregón 151, Int. 4B" required>
                </div>

                <div class="calc-form-grid" style="margin-bottom: 0.75rem;">
                    <div class="form-group">
                        <label class="form-label">Entre qué calles (Referencias):</label>
                        <input type="text" class="form-input" id="checkoutCrossStreets" placeholder="Ej: Entre Orizaba y Jalapa">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Notas para la entrega:</label>
                        <input type="text" class="form-input" id="checkoutNotes" placeholder="Ej: Portón café, dejar en caseta">
                    </div>
                </div>
            `;
        } else {
            // Formulario Colombia
            container.innerHTML = `
                <div class="calc-form-grid" style="margin-bottom: 0.75rem;">
                    <div class="form-group">
                        <label class="form-label">Cédula / CC (*Transportadora):</label>
                        <input type="text" class="form-input" id="checkoutDocId" placeholder="Ej: 1037654321" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Departamento (*):</label>
                        <select class="form-select" id="checkoutRegion" required>
                            <option value="">Selecciona departamento</option>
                        </select>
                    </div>
                </div>

                <div class="calc-form-grid" style="margin-bottom: 0.75rem;">
                    <div class="form-group">
                        <label class="form-label">Ciudad / Municipio (*):</label>
                        <select class="form-select" id="checkoutCity" disabled required>
                            <option value="">Selecciona departamento primero</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Barrio / Sector:</label>
                        <input type="text" class="form-input" id="checkoutSublocality" placeholder="Ej: El Poblado">
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 0.75rem;">
                    <label class="form-label">Dirección Completa de Entrega (*):</label>
                    <input type="text" class="form-input" id="checkoutAddress" placeholder="Ej: Cra 43A # 18 Sur - 45, Apto 502" required>
                </div>

                <div class="form-group" style="margin-bottom: 0.75rem;">
                    <label class="form-label">Notas para el mensajero:</label>
                    <input type="text" class="form-input" id="checkoutNotes" placeholder="Ej: Portería / Torre 2">
                </div>
            `;
        }

        // 2. Renderizar métodos de pago según país (OXXO ELIMINADO TOTALMENTE)
        if (country.code === "MX") {
            paymentOptionsContainer.innerHTML = `
                <label class="payment-option-card">
                    <input type="radio" name="paymentMethod" value="bancoppel" checked>
                    <div>
                        <strong>🏦 Transferencia Bancaria BanCoppel Débito / SPEI</strong>
                        <p class="text-sm text-muted">Acreditación directa e inmediata sin comisiones. Transfiere con CLABE o número de tarjeta.</p>
                    </div>
                </label>

                <label class="payment-option-card" id="optionCardContraentregaMX">
                    <input type="radio" name="paymentMethod" value="contraentrega_mx" id="radioContraentregaMX">
                    <div>
                        <strong>💵 Pago Contra Entrega en Efectivo <span class="badge badge-gold" id="badgeContraentregaMX">Exclusivo San Luis Potosí</span></strong>
                        <p class="text-sm text-muted" id="descContraentregaMX">Disponible ÚNICAMENTE en la ciudad de San Luis Potosí. Pagas en efectivo al mensajero.</p>
                    </div>
                </label>

                <label class="payment-option-card">
                    <input type="radio" name="paymentMethod" value="mercadopago">
                    <div>
                        <strong>💳 Tarjeta de Crédito / Débito (Mercado Pago)</strong>
                        <p class="text-sm text-muted">Visa, Mastercard, American Express de cualquier banco mexicano.</p>
                    </div>
                </label>

                <label class="payment-option-card">
                    <input type="radio" name="paymentMethod" value="whatsapp">
                    <div>
                        <strong>💬 Confirmar y Asesorar por WhatsApp Directo</strong>
                        <p class="text-sm text-muted">Una asesora oficial de México te guiará y tomará tus datos al instante.</p>
                    </div>
                </label>
            `;
        } else {
            paymentOptionsContainer.innerHTML = `
                <label class="payment-option-card" id="optionCardTransferenciaCO">
                    <input type="radio" name="paymentMethod" value="transferencia" id="radioTransferenciaCO" checked>
                    <div>
                        <strong>📲 Transferencia Nequi / Daviplata / Bancolombia</strong>
                        <p class="text-sm text-muted">Paga de inmediato mediante Nequi al 317 314 2714 y envía tu comprobante.</p>
                    </div>
                </label>

                <label class="payment-option-card" id="optionCardContraentregaCO">
                    <input type="radio" name="paymentMethod" value="contraentrega" id="radioContraentregaCO">
                    <div>
                        <strong>💵 Pago Contra Entrega en Efectivo <span class="badge badge-gold" id="badgeContraentregaCO">Exclusivo Cali</span></strong>
                        <p class="text-sm text-muted" id="descContraentregaCO">Disponible ÚNICAMENTE en la ciudad de Cali. Pagas en efectivo al mensajero al recibir.</p>
                    </div>
                </label>

                <label class="payment-option-card">
                    <input type="radio" name="paymentMethod" value="tarjeta_pse">
                    <div>
                        <strong>💳 Pasarela PSE / Tarjeta Débito y Crédito (Wompi)</strong>
                        <p class="text-sm text-muted">Pago seguro digital a través de cualquier banco colombiano.</p>
                    </div>
                </label>

                <label class="payment-option-card">
                    <input type="radio" name="paymentMethod" value="whatsapp">
                    <div>
                        <strong>💬 Confirmar y Asesorar por WhatsApp Directo</strong>
                        <p class="text-sm text-muted">Una asesora oficial de Colombia te guiará de inmediato.</p>
                    </div>
                </label>
            `;
        }

        this.populateRegions();
        this.updatePaymentDetailsUI();
        this.updateContraentregaAvailability();
    }

    populateRegions() {
        const country = getActiveCountry();
        const regionSelect = document.getElementById("checkoutRegion");
        if (!regionSelect) return;

        const label = country.code === "MX" ? "tu Estado" : "tu Departamento";
        regionSelect.innerHTML = `<option value="">Selecciona ${label}</option>`;
        const regions = Object.keys(country.locations).sort();
        
        regions.forEach(reg => {
            const option = document.createElement("option");
            option.value = reg;
            option.textContent = reg;
            regionSelect.appendChild(option);
        });

        regionSelect.addEventListener("change", (e) => this.onRegionChange(e.target.value));
    }

    onRegionChange(regionName) {
        const country = getActiveCountry();
        const citySelect = document.getElementById("checkoutCity");
        if (!citySelect) return;

        const label = country.code === "MX" ? "Municipio / Alcaldía" : "Ciudad / Municipio";
        citySelect.innerHTML = `<option value="">Selecciona ${label}</option>`;

        if (!regionName || !country.locations[regionName]) {
            citySelect.disabled = true;
            this.selectedCity = "";
            this.updateContraentregaAvailability();
            return;
        }

        citySelect.disabled = false;
        const cities = country.locations[regionName];
        cities.forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });

        const otherOption = document.createElement("option");
        otherOption.value = "Otro municipio";
        otherOption.textContent = "Otro municipio / localidad";
        citySelect.appendChild(otherOption);

        citySelect.onchange = () => {
            this.selectedCity = citySelect.value;
            this.updateCheckoutSummaryTotals();
            this.updateContraentregaAvailability();
        };
    }

    updateContraentregaAvailability() {
        const country = getActiveCountry();
        const city = (this.selectedCity || "").trim().toLowerCase();

        if (country.code === "CO") {
            const radio = document.getElementById("radioContraentregaCO");
            const card = document.getElementById("optionCardContraentregaCO");
            const badge = document.getElementById("badgeContraentregaCO");
            const desc = document.getElementById("descContraentregaCO");
            const isCali = city.includes("cali");

            if (this.selectedCity) {
                if (isCali) {
                    if (radio) radio.disabled = false;
                    if (card) { card.style.opacity = "1"; card.style.pointerEvents = "auto"; }
                    if (badge) { badge.textContent = "✓ Disponible en Cali"; badge.className = "badge badge-gold"; }
                    if (desc) desc.textContent = "Disponible en Cali: Pagas en efectivo al mensajero en la puerta de tu casa con envío GRATIS.";
                } else {
                    if (radio) {
                        radio.disabled = true;
                        if (this.selectedPaymentMethod === "contraentrega") {
                            this.selectedPaymentMethod = "transferencia";
                            const transRadio = document.getElementById("radioTransferenciaCO");
                            if (transRadio) transRadio.checked = true;
                            this.updatePaymentDetailsUI();
                        }
                    }
                    if (card) { card.style.opacity = "0.6"; card.style.pointerEvents = "none"; }
                    if (badge) { badge.textContent = "Exclusivo Cali (No disponible en tu ciudad)"; badge.className = "badge"; badge.style.background = "#555"; badge.style.color = "#fff"; }
                    if (desc) desc.textContent = `No disponible en ${this.selectedCity}. El pago contra entrega es exclusivo para Cali. Para tu ciudad selecciona Transferencia Nequi/Daviplata o PSE.`;
                }
            } else {
                if (badge) badge.textContent = "Exclusivo Cali";
            }
        } else if (country.code === "MX") {
            const radio = document.getElementById("radioContraentregaMX");
            const card = document.getElementById("optionCardContraentregaMX");
            const badge = document.getElementById("badgeContraentregaMX");
            const desc = document.getElementById("descContraentregaMX");
            const isSLP = city.includes("san luis potosí") || city.includes("san luis potosi");

            if (this.selectedCity) {
                if (isSLP) {
                    if (radio) radio.disabled = false;
                    if (card) { card.style.opacity = "1"; card.style.pointerEvents = "auto"; }
                    if (badge) { badge.textContent = "✓ Disponible en San Luis Potosí"; badge.className = "badge badge-gold"; }
                    if (desc) desc.textContent = "Disponible en San Luis Potosí: Pagas en efectivo al recibir tu faja con envío GRATIS.";
                } else {
                    if (radio) {
                        radio.disabled = true;
                        if (this.selectedPaymentMethod === "contraentrega_mx") {
                            this.selectedPaymentMethod = "bancoppel";
                            const bancoppelRadio = document.querySelector('input[name="paymentMethod"][value="bancoppel"]');
                            if (bancoppelRadio) bancoppelRadio.checked = true;
                            this.updatePaymentDetailsUI();
                        }
                    }
                    if (card) { card.style.opacity = "0.6"; card.style.pointerEvents = "none"; }
                    if (badge) { badge.textContent = "Exclusivo San Luis Potosí (No disponible)"; badge.className = "badge"; badge.style.background = "#555"; badge.style.color = "#fff"; }
                    if (desc) desc.textContent = `No disponible en ${this.selectedCity}. El pago contra entrega es exclusivo para San Luis Potosí. Para tu ciudad selecciona Transferencia Bancaria BanCoppel.`;
                }
            } else {
                if (badge) badge.textContent = "Exclusivo San Luis Potosí";
            }
        }
    }

    updateCheckoutSummaryTotals() {
        const country = getActiveCountry();
        const summary = cart.getSummary(this.selectedCity);
        const checkoutTotalEl = document.getElementById("checkoutSummaryTotal");
        const checkoutItemsCount = document.getElementById("checkoutSummaryCount");
        if (checkoutTotalEl) checkoutTotalEl.textContent = formatPrice(summary.total, country.code);
        if (checkoutItemsCount) {
            const shipInfo = summary.isFreeShipping 
                ? " • ¡Envío GRATIS!" 
                : (this.selectedCity ? ` • Envío: ${formatPrice(summary.shippingCost, country.code)}` : ` • Envío gratis solo en ${country.shipping.freeShippingCity}`);
            checkoutItemsCount.textContent = `${summary.count} producto(s)${shipInfo}`;
        }
    }

    bindEvents() {
        const optionsGroup = document.getElementById("checkoutPaymentOptionsGroup");
        if (optionsGroup) {
            optionsGroup.addEventListener("change", (e) => {
                if (e.target.name === "paymentMethod") {
                    this.selectedPaymentMethod = e.target.value;
                    this.updatePaymentDetailsUI();
                }
            });
        }
    }

    updatePaymentDetailsUI() {
        const country = getActiveCountry();
        const detailsBox = document.getElementById("checkoutPaymentDetailsContainer");
        if (!detailsBox) return;

        if (country.code === "MX") {
            if (this.selectedPaymentMethod === "bancoppel") {
                detailsBox.innerHTML = `
                    <div class="payment-card-showcase-box">
                        <div class="payment-card-banner">
                            <img src="images/pago_mexico_bancoppel.jpg" alt="Datos de Pago BanCoppel Débito México" class="payment-card-img-preview">
                        </div>
                        <div class="payment-card-data-rows">
                            <div class="bank-account-card">
                                <div>
                                    <small class="text-muted">Tarjeta Débito BanCoppel:</small><br>
                                    <strong class="font-mono">4169 1614 4795 5013</strong>
                                </div>
                                <button type="button" class="btn-copy-account" data-copy="4169161447955013">Copiar Tarjeta</button>
                            </div>
                            <div class="bank-account-card">
                                <div>
                                    <small class="text-muted">CLABE Interbancaria (SPEI):</small><br>
                                    <strong class="font-mono">137700105053226103</strong>
                                </div>
                                <button type="button" class="btn-copy-account" data-copy="137700105053226103">Copiar CLABE</button>
                            </div>
                            <div class="bank-account-card">
                                <div>
                                    <small class="text-muted">Beneficiario / Titular:</small><br>
                                    <strong>YAA</strong>
                                </div>
                                <span class="badge badge-gold">BanCoppel México</span>
                            </div>
                        </div>
                        <p class="text-sm text-gold" style="margin-top: 0.5rem;">📸 Al realizar tu transferencia bancaria, haz clic en "Enviar Comprobante" para validar tu pago vía WhatsApp.</p>
                    </div>
                `;
            } else if (this.selectedPaymentMethod === "contraentrega_mx") {
                detailsBox.innerHTML = `
                    <div class="payment-notice-box">
                        <p class="text-sm">🚚 <strong>Pago Contra Entrega en Efectivo (Exclusivo San Luis Potosí):</strong> Pagas en efectivo al mensajero al momento de recibir tu faja en tu domicilio con Envío GRATIS.</p>
                    </div>
                `;
            } else if (this.selectedPaymentMethod === "mercadopago") {
                detailsBox.innerHTML = `
                    <div class="payment-notice-box">
                        <p class="text-sm">🔒 <strong>Mercado Pago México:</strong> Podrás pagar de forma 100% segura con tus tarjetas de débito o crédito mexicanas.</p>
                    </div>
                `;
            } else {
                detailsBox.innerHTML = "";
            }
        } else {
            // Detalles Colombia
            if (this.selectedPaymentMethod === "transferencia") {
                detailsBox.innerHTML = `
                    <div class="payment-card-showcase-box">
                        <div class="payment-card-banner">
                            <img src="images/pago_colombia_nequi.jpg" alt="Datos de Pago Nequi Colombia" class="payment-card-img-preview">
                        </div>
                        <div class="payment-card-data-rows">
                            <div class="bank-account-card">
                                <div>
                                    <small class="text-muted">Nequi / Daviplata:</small><br>
                                    <strong class="font-mono">317 314 2714</strong>
                                </div>
                                <button type="button" class="btn-copy-account" data-copy="3173142714">Copiar Nequi</button>
                            </div>
                            <div class="bank-account-card">
                                <div>
                                    <small class="text-muted">Titular Nequi:</small><br>
                                    <strong>YAA</strong>
                                </div>
                                <span class="badge badge-gold">Cuenta Oficial</span>
                            </div>
                            <div class="bank-account-card">
                                <div>
                                    <small class="text-muted">Bancolombia Ahorros:</small><br>
                                    <strong class="font-mono">048-998231-72</strong>
                                </div>
                                <button type="button" class="btn-copy-account" data-copy="04899823172">Copiar Cuenta</button>
                            </div>
                        </div>
                        <p class="text-sm text-gold" style="margin-top: 0.5rem;">📸 Al hacer tu pago en Nequi, haz clic en "Enviar Comprobante" para adjuntar tu soporte por WhatsApp a la vendedora.</p>
                    </div>
                `;
            } else if (this.selectedPaymentMethod === "contraentrega") {
                detailsBox.innerHTML = `
                    <div class="payment-notice-box">
                        <p class="text-sm">🚚 <strong>Pago Contra Entrega en Efectivo (Exclusivo Cali):</strong> Pagas en efectivo al mensajero en la puerta de tu casa en Cali con Envío GRATIS.</p>
                    </div>
                `;
            } else if (this.selectedPaymentMethod === "tarjeta_pse") {
                detailsBox.innerHTML = `
                    <div class="payment-notice-box">
                        <p class="text-sm">🔒 <strong>Wompi / PSE:</strong> Pago seguro digital a través de cualquier entidad bancaria en Colombia.</p>
                    </div>
                `;
            } else {
                detailsBox.innerHTML = "";
            }
        }

        // Re-vincular botones de copiar
        if (typeof initCopyButtons === "function") {
            initCopyButtons();
        }
    }

    validateForm() {
        const country = getActiveCountry();
        const name = document.getElementById("checkoutName")?.value.trim();
        const phone = document.getElementById("checkoutPhone")?.value.trim();
        const region = document.getElementById("checkoutRegion")?.value.trim();
        const city = document.getElementById("checkoutCity")?.value.trim();
        const address = document.getElementById("checkoutAddress")?.value.trim();

        if (!name || !phone || !region || !city || !address) {
            alert("Por favor completa los campos obligatorios (*) para la entrega.");
            return false;
        }

        // Validación estricta de Contra Entrega: ÚNICAMENTE Cali y San Luis Potosí
        const cityLower = city.toLowerCase();
        if (this.selectedPaymentMethod === "contraentrega" && !cityLower.includes("cali")) {
            alert(`El pago Contra Entrega está disponible ÚNICAMENTE en la ciudad de Cali. Para tu ciudad (${city}), por favor selecciona Transferencia Nequi / Bancolombia o PSE.`);
            return false;
        }

        if (this.selectedPaymentMethod === "contraentrega_mx" && !cityLower.includes("san luis potosí") && !cityLower.includes("san luis potosi")) {
            alert(`El pago Contra Entrega está disponible ÚNICAMENTE en la ciudad de San Luis Potosí. Para tu ciudad (${city}), por favor selecciona Transferencia BanCoppel Débito o Tarjeta.`);
            return false;
        }

        if (country.code === "MX") {
            const postalCode = document.getElementById("checkoutPostalCode")?.value.trim();
            const sublocality = document.getElementById("checkoutSublocality")?.value.trim();
            if (!postalCode || !sublocality) {
                alert("Por favor ingresa tu Código Postal (CP) y Colonia en México.");
                return false;
            }

            this.formData = {
                name,
                phone,
                region, // Estado
                city,   // Municipio/Alcaldía
                postalCode,
                sublocality, // Colonia
                address,
                crossStreets: document.getElementById("checkoutCrossStreets")?.value.trim() || "N/A",
                notes: document.getElementById("checkoutNotes")?.value.trim() || "Ninguna"
            };
        } else {
            const docId = document.getElementById("checkoutDocId")?.value.trim();
            if (!docId) {
                alert("Por favor ingresa tu Cédula / CC para la guía de la transportadora.");
                return false;
            }

            this.formData = {
                name,
                phone,
                docId,
                region, // Departamento
                city,   // Ciudad
                sublocality: document.getElementById("checkoutSublocality")?.value.trim() || "N/A",
                address,
                notes: document.getElementById("checkoutNotes")?.value.trim() || "Ninguna"
            };
        }

        return true;
    }

    generateOrderNumber() {
        const country = getActiveCountry();
        const prefix = country.code === "MX" ? "TYA-MX" : "TYA-CO";
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${Date.now().toString().slice(-4)}${randomNum.toString().slice(-2)}`;
    }

    getPaymentMethodDisplayName(methodKey, countryCode) {
        const names = {
            bancoppel: "Transferencia Bancaria BanCoppel Débito / SPEI (México)",
            contraentrega_mx: "Pago Contra Entrega en Efectivo (Exclusivo San Luis Potosí)",
            mercadopago: "Tarjeta de Crédito / Débito (Mercado Pago)",
            transferencia: "Transferencia Nequi / Bancolombia (Colombia)",
            contraentrega: "Pago Contra Entrega en Efectivo (Exclusivo Cali)",
            tarjeta_pse: "Pasarela PSE / Tarjeta (Wompi)",
            whatsapp: "Coordinación y Asesoría Directa por WhatsApp"
        };
        return names[methodKey] || methodKey;
    }

    generateWhatsAppProofMessage(order) {
        const country = STORE_CONFIG.countries[order.countryCode] || getActiveCountry();
        const flag = country.flag;
        const currency = country.currencyCode;

        let itemsText = "";
        order.items.forEach((item, index) => {
            itemsText += `\n ${index + 1}. *${item.name}*` +
                         `\n    ▪ Talla: *${item.size}* | Color: *${item.color}*` +
                         `\n    ▪ Cantidad: ${item.quantity} x ${formatPrice(item.price, country.code)}` +
                         `\n    ▪ Subtotal: ${formatPrice(item.totalPrice, country.code)}`;
        });

        const shippingText = order.isFreeShipping 
            ? `¡Envío GRATIS (${order.customer.city})! ✨` 
            : `${formatPrice(order.shippingCost, country.code)} (Paquetería nacional • Envío gratis solo en ${country.shipping.freeShippingCity})`;

        let addressText = "";
        if (country.code === "MX") {
            addressText = 
`👤 *Cliente:* ${order.customer.name}
📱 *Teléfono:* ${order.customer.phone}
📫 *Estado:* ${order.customer.region}
🏙️ *Municipio / Alcaldía:* ${order.customer.city}
📮 *C.P.:* ${order.customer.postalCode}
🏘️ *Colonia:* ${order.customer.sublocality}
🏠 *Dirección:* ${order.customer.address}
🛣️ *Entre calles:* ${order.customer.crossStreets || 'N/A'}
📝 *Notas de entrega:* ${order.customer.notes || 'Ninguna'}`;
        } else {
            addressText = 
`👤 *Cliente:* ${order.customer.name}
🪪 *Cédula/CC:* ${order.customer.docId || 'N/A'}
📱 *Teléfono:* ${order.customer.phone}
📫 *Departamento:* ${order.customer.region}
🏙️ *Ciudad / Municipio:* ${order.customer.city}
🏠 *Dirección:* ${order.customer.address}
🏘️ *Barrio:* ${order.customer.sublocality || 'N/A'}
📝 *Notas de entrega:* ${order.customer.notes || 'Ninguna'}`;
        }

        const message = 
`👑 ${flag} *¡HOLA TU FIGURA YAA (${country.name.toUpperCase()})!*
*COMPROBANTE DE PAGO Y DETALLES DEL PEDIDO*

Adjunto mi comprobante de pago para validar mi orden y programar mi despacho. Aquí están los datos completos de mi compra:

🔖 *ORDEN REGISTRADA:* #${order.orderNumber}
📅 *Fecha:* ${new Date(order.createdAt).toLocaleDateString(country.code === "MX" ? 'es-MX' : 'es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}

📦 *PRODUCTOS SOLICITADOS:*${itemsText}

─────────────────────
💰 *Subtotal:* ${formatPrice(order.subtotal, country.code)}
🚚 *Envío:* ${shippingText}
⭐️ *TOTAL A PAGAR (${currency}):* *${formatPrice(order.total, country.code)}*
─────────────────────

💳 *MÉTODO DE PAGO REGISTRADO:*
*${order.paymentMethodName}*

📍 *DATOS DE ENTREGA (${country.name.toUpperCase()}):*
${addressText}

📸 *Adjunto a continuación la captura / foto de mi comprobante de transferencia para validar y coordinar el despacho prioritario. ¡Muchas gracias!* ✨`;

        return message;
    }

    processOrder() {
        if (!this.validateForm()) return;

        const summary = cart.getSummary(this.formData.city);
        if (summary.items.length === 0) {
            alert("Tu carrito de compras está vacío.");
            return;
        }

        const country = getActiveCountry();
        const orderId = this.generateOrderNumber();
        const paymentMethodDisplayName = this.getPaymentMethodDisplayName(this.selectedPaymentMethod, country.code);

        // 1. GUARDAR PEDIDO EN EL SISTEMA ANTES DE ENVIAR A WHATSAPP
        const orderData = {
            orderNumber: orderId,
            countryCode: country.code,
            countryName: country.name,
            createdAt: new Date().toISOString(),
            status: "Pendiente de Comprobante",
            customer: { ...this.formData },
            items: summary.items.map(i => ({
                id: i.id,
                name: i.name,
                size: i.size,
                color: i.color,
                quantity: i.quantity,
                price: i.price,
                totalPrice: i.totalPrice,
                image: i.image
            })),
            subtotal: summary.subtotal,
            shippingCost: summary.shippingCost,
            isFreeShipping: summary.isFreeShipping,
            total: summary.total,
            currency: country.currencyCode,
            paymentMethod: this.selectedPaymentMethod,
            paymentMethodName: paymentMethodDisplayName
        };

        // Guardar pedido persistente
        this.currentOrder = ordersManager.saveOrder(orderData);

        // 2. Generar mensaje profesional de WhatsApp con datos reales
        const whatsappText = this.generateWhatsAppProofMessage(this.currentOrder);
        const encodedUrl = `https://wa.me/${country.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

        // 3. Renderizar pantalla de confirmación con botón "Enviar comprobante"
        this.renderConfirmation(this.currentOrder, encodedUrl);
        
        // 4. Limpiar carrito
        cart.clearCart();
    }

    renderConfirmation(order, whatsappUrl) {
        const country = STORE_CONFIG.countries[order.countryCode] || getActiveCountry();
        const modalBody = document.getElementById("checkoutModalBody");
        if (!modalBody) return;

        const isTransfer = order.paymentMethod === "bancoppel" || order.paymentMethod === "transferencia";
        const paymentCardImg = order.countryCode === "MX" ? "images/pago_mexico_bancoppel.jpg" : "images/pago_colombia_nequi.jpg";

        modalBody.innerHTML = `
            <div class="order-success-card">
                <div class="success-icon-badge">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <h3 class="success-title">¡Pedido Guardado con Éxito! ${country.flag}</h3>
                <p class="order-code">Orden Registrada: <strong>#${order.orderNumber}</strong></p>
                
                <div class="order-highlight-box">
                    <p class="gold-text font-bold" style="font-size: 1.25rem;">⭐️ Total a Pagar: ${formatPrice(order.total, order.countryCode)}</p>
                    <p class="text-sm">Método de pago: <strong>${order.paymentMethodName}</strong></p>
                    <p class="text-sm">Destino: ${order.customer.city}, ${order.customer.region} (${country.name})</p>
                    <p class="text-sm text-muted">Cliente: ${order.customer.name} • 📱 ${order.customer.phone}</p>
                </div>

                ${isTransfer ? `
                    <!-- Datos Visuales de Pago según el país con la tarjeta oficial -->
                    <div class="confirmation-payment-card-box">
                        <h4 class="payment-card-instruction-title">💳 Realiza tu transferencia a la cuenta oficial de Tu Figura Yaa:</h4>
                        <img src="${paymentCardImg}" alt="Datos de Pago Oficiales ${country.name}" class="confirmation-card-img">
                        <div class="payment-data-quick-copy">
                            ${order.countryCode === "MX" ? `
                                <div class="bank-account-card">
                                    <span>Tarjeta BanCoppel: <strong>4169 1614 4795 5013</strong> (Titular: YAA)</span>
                                    <button type="button" class="btn-copy-account" data-copy="4169161447955013">Copiar</button>
                                </div>
                                <div class="bank-account-card">
                                    <span>CLABE: <strong>137700105053226103</strong></span>
                                    <button type="button" class="btn-copy-account" data-copy="137700105053226103">Copiar CLABE</button>
                                </div>
                            ` : `
                                <div class="bank-account-card">
                                    <span>Nequi / Daviplata: <strong>317 314 2714</strong> (Titular: YAA)</span>
                                    <button type="button" class="btn-copy-account" data-copy="3173142714">Copiar Nequi</button>
                                </div>
                            `}
                        </div>
                    </div>
                ` : ''}

                <!-- Botón de Enviar Comprobante / Confirmación a WhatsApp -->
                <div class="whatsapp-dispatch-card">
                    <h4 style="color:#fff; margin-bottom: 0.5rem; font-size: 1.1rem;">📲 Enviar Comprobante a la Vendedora</h4>
                    <p class="text-sm" style="margin-bottom: 1rem; color: #d1d1d6;">Haz clic en el siguiente botón para abrir WhatsApp con la vendedora oficial de <strong>${country.name} (${country.whatsappDisplay})</strong> con el resumen detallado de tu orden para adjuntar tu comprobante:</p>
                    
                    <a href="${whatsappUrl}" target="_blank" class="btn btn-whatsapp-large btn-send-proof" id="btnSendProofWhatsApp" onclick="checkout.onProofSent('${order.orderNumber}')">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                        <span>Enviar Comprobante por WhatsApp</span>
                    </a>
                </div>

                <div class="modal-footer-centered">
                    <button type="button" class="btn btn-outline" onclick="closeCheckoutModal()">Cerrar y Volver a la Tienda</button>
                </div>
            </div>
        `;

        if (typeof initCopyButtons === "function") {
            initCopyButtons();
        }
    }

    onProofSent(orderNumber) {
        ordersManager.updateOrderStatus(orderNumber, "Comprobante Enviado");
        if (typeof showToast === "function") {
            showToast("Comprobante enviado. Tu vendedora te responderá enseguida.");
        }
    }
}

const checkout = new CheckoutManager();
