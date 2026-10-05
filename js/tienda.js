// Web/js/tienda.js
let allProducts = [];
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('checkout-card-num').innerText = CONFIG.CARD_NUMBER;
	document.getElementById('checkout-phone-num').innerText = CONFIG.PHONE_NUMBER;
    fetchProducts();
});

// 1. Cargar catálogo dinámico desde Supabase
async function fetchProducts() {
    const grid = document.getElementById('catalog-grid');
    
    const { data, error } = await supabaseClient
        .from('shop_items')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-16 text-center text-sm font-bold text-red-400">
                No se pudo cargar el catálogo. Revisa tu conexión.
            </div>`;
        return;
    }

    allProducts = data;
    renderCatalog();
}

// 2. Renderizar catálogo
function renderCatalog() {
    const grid = document.getElementById('catalog-grid');
    grid.innerHTML = "";

    const filtered = currentCategory === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === currentCategory);

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-12 text-center text-sm text-gray-500">No hay artículos en esta categoría.</div>`;
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = "p-5 bg-cardbg border border-cardborder rounded-2xl flex flex-col justify-between hover:border-cyan-800 transition duration-300 relative group";
        
        const badgeHtml = p.badge ? `<span class="absolute top-4 right-4 px-2 py-0.5 text-[9px] font-black bg-cyan-950 text-neoncian border border-cyan-800 rounded uppercase">${p.badge}</span>` : "";

        card.innerHTML = `
            ${badgeHtml}
            <div>
                <div class="w-full h-32 bg-darkbg/80 border border-cardborder rounded-xl flex items-center justify-center p-3 mb-4 group-hover:scale-105 transition">
                    <img src="${p.image_url}" alt="${p.name}" class="max-h-24 max-w-full object-contain pixelated" onerror="this.src='assets/sprites/ui/icon_watt.png'">
                </div>
                <h4 class="font-bold text-white text-base">${p.name}</h4>
                <p class="text-[11px] text-neoncian font-mono mt-0.5 mb-2">${p.stat_desc || ''}</p>
                <p class="text-xs text-gray-400 leading-relaxed mb-4">${p.description || ''}</p>
            </div>
            <div>
                <div class="text-xl font-black text-neongold mb-3">${Number(p.price_cup).toLocaleString()} <span class="text-xs text-gray-400">CUP</span></div>
                <button onclick="addToCart('${p.id}')" class="w-full py-2.5 bg-cardbg border-2 border-neongold/80 text-neongold font-black text-xs uppercase tracking-wider rounded-lg hover:bg-neongold hover:text-black transition active:scale-95 flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    Añadir al Carrito
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => {
        b.className = "cat-btn px-4 py-2 text-xs font-bold rounded-lg border border-cardborder bg-cardbg text-gray-400 hover:text-white transition";
    });
    btn.className = "cat-btn px-4 py-2 text-xs font-bold rounded-lg border border-cyan-500 bg-cyan-950 text-neoncian transition";
    renderCatalog();
}

function addToCart(productId) {
    const prod = allProducts.find(p => p.id === productId);
    if (prod) {
        cart.addItem(prod);
        toggleCartDrawer(true);
    }
}

// 3. Control del Drawer del Carrito
function toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer');
    if (open) {
        renderCartItems();
        drawer.classList.remove('hidden');
    } else {
        drawer.classList.add('hidden');
    }
}

function renderCartItems() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total-cup');
    const checkoutSec = document.getElementById('cart-checkout-section');
    list.innerHTML = "";

    if (cart.items.length === 0) {
        list.innerHTML = `<div class="py-12 text-center text-sm text-gray-500">Tu carrito está vacío.</div>`;
        totalEl.innerText = "0 CUP";
        checkoutSec.style.display = "none";
        return;
    }

    checkoutSec.style.display = "block";
    totalEl.innerText = cart.getTotalCUP().toLocaleString() + " CUP";

    cart.items.forEach(item => {
        const row = document.createElement('div');
        row.className = "flex items-center justify-between p-3 bg-darkbg border border-cardborder rounded-xl";
        row.innerHTML = `
            <div class="flex items-center gap-3">
                <img src="${item.image_url}" class="w-10 h-10 object-contain pixelated">
                <div>
                    <div class="text-xs font-bold text-white">${item.name}</div>
                    <div class="text-[11px] text-neongold font-mono">${(item.price_cup * item.qty).toLocaleString()} CUP</div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="cart.updateQty('${item.id}', -1); renderCartItems()" class="w-6 h-6 bg-cardborder rounded text-xs font-black">-</button>
                <span class="text-xs font-bold px-1">${item.qty}</span>
                <button onclick="cart.updateQty('${item.id}', 1); renderCartItems()" class="w-6 h-6 bg-cardborder rounded text-xs font-black">+</button>
                <button onclick="cart.removeItem('${item.id}'); renderCartItems()" class="text-red-400 text-xs ml-2">✕</button>
            </div>
        `;
        list.appendChild(row);
    });
}

function copyCheckoutCard() {
    navigator.clipboard.writeText(CONFIG.CARD_NUMBER.replace(/\s+/g, '')).then(() => {
        const btn = document.getElementById('btn-copy-card');
        btn.innerText = "✓ Copiado";
        setTimeout(() => btn.innerText = "Copiar", 2000);
    });
}

// 4. Procesar compra del carrito con Transfermóvil
async function submitCartOrder() {
    const user = document.getElementById('checkout-username').value.trim();
    const sms = document.getElementById('checkout-sms-code').value.trim();
    const btn = document.getElementById('btn-submit-order');
    const msg = document.getElementById('checkout-msg');

    if (!user) { alert("Por favor ingresa tu nombre de usuario del juego."); return; }
    if (!sms || sms.length < 5) { alert("Por favor ingresa el código del SMS de Transfermóvil."); return; }

    btn.disabled = true;
    btn.innerText = "Registrando pedido...";
    msg.classList.remove('hidden');
    msg.className = "text-xs font-bold text-center text-neoncian mt-2";
    msg.innerText = "Conectando con la central de Supabase...";

    const cartPayload = cart.items.map(i => ({ id: i.id, qty: i.qty }));

    const { data, error } = await supabaseClient.rpc('create_cart_order', {
        p_username: user,
        p_cart_items: cartPayload,
        p_telebanca_code: sms
    });

    btn.disabled = false;
    btn.innerText = "⚡ Confirmar y Enviar Comprobante";

    if (error || !data || !data.success) {
        msg.className = "text-xs font-bold text-center text-red-400 mt-2";
        msg.innerText = "❌ " + ((data && data.error) ? data.error : error.message);
    } else {
        // 1. Limpiar campos y cerrar el carrito
        msg.classList.add('hidden');
        document.getElementById('checkout-sms-code').value = "";
        cart.clear();
        toggleCartDrawer(false);

        // 2. Configurar el Modal de Éxito
        const shortOrderId = data.order_id.substring(0, 8);
        document.getElementById('success-order-id').innerText = `ORDEN #${shortOrderId}`;
        
        // 3. Crear mensaje pre-redactado para WhatsApp con los datos del pedido
        const waText = encodeURIComponent(
            `Hola, realicé el pedido #${shortOrderId} por ${data.total_cup} CUP en KILOWAT.\nUsuario: ${user}\nCódigo Transfermóvil: ${sms}`
        );
        document.getElementById('btn-whatsapp-support').href = `https://wa.me/${CONFIG.WHATSAPP_SUPPORT}?text=${waText}`;

        // 4. Mostrar ventana emergente al jugador
        document.getElementById('modal-success-order').classList.remove('hidden');
    }
}