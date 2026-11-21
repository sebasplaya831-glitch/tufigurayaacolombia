/**
 * ====================================================================
 * TU FIGURA YAA - SISTEMA DE PEDIDOS & PANEL ADMINISTRATIVO
 * ====================================================================
 * Persistencia en localStorage ("tufigura_orders"), trazabilidad completa,
 * métricas en tiempo real y panel de gestión para Colombia y México.
 */

class OrdersManager {
    constructor() {
        this.storageKey = "tufigura_orders";
    }

    getOrders() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Error al leer pedidos de localStorage:", e);
            return [];
        }
    }

    saveOrder(orderData) {
        try {
            const orders = this.getOrders();
            const newOrder = {
                ...orderData,
                createdAt: orderData.createdAt || new Date().toISOString(),
                status: orderData.status || "Pendiente de Comprobante"
            };
            orders.unshift(newOrder); // Más reciente primero
            localStorage.setItem(this.storageKey, JSON.stringify(orders));
            return newOrder;
        } catch (e) {
            console.error("Error al guardar pedido en localStorage:", e);
            return null;
        }
    }

    getOrderById(orderId) {
        const orders = this.getOrders();
        return orders.find(o => o.orderNumber === orderId || o.id === orderId) || null;
    }

    updateOrderStatus(orderId, newStatus) {
        try {
            const orders = this.getOrders();
            const index = orders.findIndex(o => o.orderNumber === orderId || o.id === orderId);
            if (index > -1) {
                orders[index].status = newStatus;
                orders[index].updatedAt = new Date().toISOString();
                localStorage.setItem(this.storageKey, JSON.stringify(orders));
                return true;
            }
            return false;
        } catch (e) {
            console.error("Error actualizando estado del pedido:", e);
            return false;
        }
    }

    deleteOrder(orderId) {
        try {
            const orders = this.getOrders().filter(o => o.orderNumber !== orderId && o.id !== orderId);
            localStorage.setItem(this.storageKey, JSON.stringify(orders));
            return true;
        } catch (e) {
            return false;
        }
    }
}

const ordersManager = new OrdersManager();

// ====================================================================
// PANEL ADMINISTRATIVO VISUAL
// ====================================================================
class AdminPanelUI {
    constructor() {
        this.activeCountryFilter = "all";
        this.activeStatusFilter = "all";
        this.searchQuery = "";
    }

    init() {
        this.injectAdminElements();
    }

    injectAdminElements() {
        // Enlazar botón o link existente en el DOM
        const existingBtn = document.getElementById("btnOpenAdminPanel");
        if (existingBtn) {
            existingBtn.onclick = (e) => {
                if (e) e.preventDefault();
                this.open();
            };
        } else {
            // Inyectar botón de acceso en el footer si no existe
            const footerBottom = document.querySelector(".footer-bottom");
            if (footerBottom) {
                const adminTrigger = document.createElement("button");
                adminTrigger.type = "button";
                adminTrigger.id = "btnOpenAdminPanel";
                adminTrigger.className = "btn-admin-access";
                adminTrigger.innerHTML = `⚙️ Panel de Pedidos / Admin`;
                adminTrigger.onclick = () => this.open();
                footerBottom.appendChild(adminTrigger);
            }
        }

        // Crear contenedor del modal administrativo si no existe
        if (!document.getElementById("adminPanelModal")) {
            const modal = document.createElement("div");
            modal.id = "adminPanelModal";
            modal.className = "modal-backdrop admin-modal-backdrop";
            modal.innerHTML = `
                <div class="modal-container admin-modal-container">
                    <div class="modal-header">
                        <div class="admin-modal-title-group">
                            <h3 class="modal-title">📦 Panel Administrativo de Pedidos</h3>
                            <span class="admin-badge-brand">Tu Figura Yaa • Colombia & México</span>
                        </div>
                        <button type="button" class="modal-close-btn" onclick="adminPanel.close()">✕</button>
                    </div>
                    <div class="modal-body admin-modal-body" id="adminModalContent">
                        <!-- Contenido dinámico renderizado por render() -->
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }

    open() {
        const modal = document.getElementById("adminPanelModal");
        if (modal) {
            modal.classList.add("active");
            document.body.classList.add("modal-open");
            this.render();
        }
    }

    close() {
        const modal = document.getElementById("adminPanelModal");
        if (modal) {
            modal.classList.remove("active");
            document.body.classList.remove("modal-open");
        }
    }

    render() {
        const container = document.getElementById("adminModalContent");
        if (!container) return;

        const allOrders = ordersManager.getOrders();
        
        // Filtros
        let filtered = allOrders.filter(o => {
            const matchCountry = this.activeCountryFilter === "all" || o.countryCode === this.activeCountryFilter;
            const matchStatus = this.activeStatusFilter === "all" || o.status === this.activeStatusFilter;
            const search = this.searchQuery.toLowerCase();
            const matchSearch = !search || 
                (o.orderNumber && o.orderNumber.toLowerCase().includes(search)) ||
                (o.customer && o.customer.name && o.customer.name.toLowerCase().includes(search)) ||
                (o.customer && o.customer.phone && o.customer.phone.includes(search)) ||
                (o.customer && o.customer.city && o.customer.city.toLowerCase().includes(search));
            return matchCountry && matchStatus && matchSearch;
        });

        // Totales calculados
        const totalCOP = allOrders.filter(o => o.countryCode === "CO").reduce((sum, o) => sum + (o.total || 0), 0);
        const totalMXN = allOrders.filter(o => o.countryCode === "MX").reduce((sum, o) => sum + (o.total || 0), 0);

        container.innerHTML = `
            <!-- Barra de Métricas Rápidas -->
            <div class="admin-stats-grid">
                <div class="admin-stat-card">
                    <span class="admin-stat-num">${allOrders.length}</span>
                    <span class="admin-stat-label">Total Pedidos</span>
                </div>
                <div class="admin-stat-card">
                    <span class="admin-stat-num font-gold">${formatPrice(totalCOP, "CO")}</span>
                    <span class="admin-stat-label">🇨🇴 Ventas Colombia</span>
                </div>
                <div class="admin-stat-card">
                    <span class="admin-stat-num font-gold">${formatPrice(totalMXN, "MX")}</span>
                    <span class="admin-stat-label">🇲🇽 Ventas México</span>
                </div>
            </div>

            <!-- Controles y Filtros -->
            <div class="admin-filters-bar">
                <div class="admin-filter-group">
                    <label>País:</label>
                    <select class="form-select form-select-sm" id="adminFilterCountry" onchange="adminPanel.setCountryFilter(this.value)">
                        <option value="all" ${this.activeCountryFilter === 'all' ? 'selected' : ''}>Todos (🇨🇴 & 🇲🇽)</option>
                        <option value="CO" ${this.activeCountryFilter === 'CO' ? 'selected' : ''}>🇨🇴 Colombia</option>
                        <option value="MX" ${this.activeCountryFilter === 'MX' ? 'selected' : ''}>🇲🇽 México</option>
                    </select>
                </div>

                <div class="admin-filter-group">
                    <label>Estado:</label>
                    <select class="form-select form-select-sm" id="adminFilterStatus" onchange="adminPanel.setStatusFilter(this.value)">
                        <option value="all" ${this.activeStatusFilter === 'all' ? 'selected' : ''}>Todos los estados</option>
                        <option value="Pendiente de Comprobante" ${this.activeStatusFilter === 'Pendiente de Comprobante' ? 'selected' : ''}>Pendiente de Comprobante</option>
                        <option value="Comprobante Enviado" ${this.activeStatusFilter === 'Comprobante Enviado' ? 'selected' : ''}>Comprobante Enviado</option>
                        <option value="Pago Verificado" ${this.activeStatusFilter === 'Pago Verificado' ? 'selected' : ''}>Pago Verificado</option>
                        <option value="Despachado" ${this.activeStatusFilter === 'Despachado' ? 'selected' : ''}>Despachado</option>
                        <option value="Entregado" ${this.activeStatusFilter === 'Entregado' ? 'selected' : ''}>Entregado</option>
                    </select>
                </div>

                <div class="admin-search-box">
                    <input type="text" class="form-input form-input-sm" placeholder="Buscar por cliente, orden o tel..." 
                           value="${this.searchQuery}" oninput="adminPanel.setSearch(this.value)">
                </div>
            </div>

            <!-- Tabla de Pedidos -->
            <div class="admin-table-wrapper">
                ${filtered.length === 0 ? `
                    <div class="admin-empty-state">
                        <p>No hay pedidos registrados con estos filtros.</p>
                    </div>
                ` : `
                    <table class="admin-orders-table">
                        <thead>
                            <tr>
                                <th>Orden</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Destino</th>
                                <th>Productos</th>
                                <th>Total</th>
                                <th>Método de Pago</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filtered.map(order => {
                                const flag = order.countryCode === "MX" ? "🇲🇽" : "🇨🇴";
                                const dateFormatted = new Date(order.createdAt).toLocaleDateString("es-ES", {
                                    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                                });
                                const itemsSummary = (order.items || []).map(i => `${i.quantity}x ${i.name} (${i.size}/${i.color})`).join("<br>");
                                
                                return `
                                    <tr>
                                        <td><strong>#${order.orderNumber}</strong><br><small class="text-muted">${flag} ${order.countryCode}</small></td>
                                        <td><small>${dateFormatted}</small></td>
                                        <td>
                                            <strong>${order.customer?.name || 'Cliente'}</strong><br>
                                            <small class="text-muted">📱 ${order.customer?.phone || ''}</small>
                                        </td>
                                        <td>
                                            <span>${order.customer?.city || ''}, ${order.customer?.region || ''}</span><br>
                                            <small class="text-muted">${order.customer?.address || ''}</small>
                                        </td>
                                        <td class="admin-items-cell"><small>${itemsSummary}</small></td>
                                        <td><strong class="gold-text">${formatPrice(order.total, order.countryCode)}</strong></td>
                                        <td><small class="badge badge-outline">${order.paymentMethodName || order.paymentMethod}</small></td>
                                        <td>
                                            <select class="admin-status-select" onchange="adminPanel.updateStatus('${order.orderNumber}', this.value)">
                                                <option value="Pendiente de Comprobante" ${order.status === 'Pendiente de Comprobante' ? 'selected' : ''}>⏳ Pendiente</option>
                                                <option value="Comprobante Enviado" ${order.status === 'Comprobante Enviado' ? 'selected' : ''}>📩 Comprobante Enviado</option>
                                                <option value="Pago Verificado" ${order.status === 'Pago Verificado' ? 'selected' : ''}>✅ Pago Verificado</option>
                                                <option value="Despachado" ${order.status === 'Despachado' ? 'selected' : ''}>🚚 Despachado</option>
                                                <option value="Entregado" ${order.status === 'Entregado' ? 'selected' : ''}>🎉 Entregado</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div class="admin-row-actions">
                                                <button type="button" class="btn-admin-icon" title="Contactar cliente por WhatsApp" 
                                                        onclick="adminPanel.contactCustomer('${order.orderNumber}')">
                                                    💬
                                                </button>
                                                <button type="button" class="btn-admin-icon btn-admin-danger" title="Eliminar orden" 
                                                        onclick="adminPanel.deleteOrder('${order.orderNumber}')">
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join("")}
                        </tbody>
                    </table>
                `}
            </div>
        `;
    }

    setCountryFilter(val) {
        this.activeCountryFilter = val;
        this.render();
    }

    setStatusFilter(val) {
        this.activeStatusFilter = val;
        this.render();
    }

    setSearch(val) {
        this.searchQuery = val.trim();
        this.render();
    }

    updateStatus(orderNumber, newStatus) {
        ordersManager.updateOrderStatus(orderNumber, newStatus);
        if (typeof showToast === "function") {
            showToast(`Estado de #${orderNumber} actualizado a: ${newStatus}`);
        }
    }

    deleteOrder(orderNumber) {
        if (confirm(`¿Estás seguro de eliminar el registro del pedido #${orderNumber}?`)) {
            ordersManager.deleteOrder(orderNumber);
            this.render();
            if (typeof showToast === "function") {
                showToast(`Pedido #${orderNumber} eliminado.`);
            }
        }
    }

    contactCustomer(orderNumber) {
        const order = ordersManager.getOrderById(orderNumber);
        if (!order || !order.customer?.phone) {
            alert("No hay teléfono registrado para este pedido.");
            return;
        }

        const phoneClean = order.customer.phone.replace(/\D/g, "");
        const country = STORE_CONFIG.countries[order.countryCode] || getActiveCountry();
        const prefix = order.countryCode === "MX" ? "52" : "57";
        const fullPhone = phoneClean.startsWith(prefix) ? phoneClean : `${prefix}${phoneClean}`;

        const msg = encodeURIComponent(`Hola ${order.customer.name}, te saludamos de Tu Figura Yaa (${country.name}). Te contactamos respecto a tu orden #${order.orderNumber}. ¿Tienes alguna duda o confirmación de tu comprobante de pago? Estamos atentos para despachar tu pedido. ✨`);
        window.open(`https://wa.me/${fullPhone}?text=${msg}`, "_blank");
    }
}

const adminPanel = new AdminPanelUI();
document.addEventListener("DOMContentLoaded", () => {
    adminPanel.init();
});
