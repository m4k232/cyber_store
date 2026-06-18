const products = [
    { id: 1, category: "sneakers", name: "Neon Stride V1", price: 150, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80", badge: "LIMITED RELEASE", description: "Engineered with luminescent mesh fabric and ultra-responsive kinetic soles for maximum energy return." },
    { id: 2, category: "sneakers", name: "Cyber Runner High", price: 180, image: "https://images.unsplash.com/photo-1597045566677-6cf4252f5713?auto=format&fit=crop&w=500&q=80", badge: "HOT", description: "High-top silhouette featuring smart auto-lacing technology and reinforced synthetic leather." },
    { id: 3, category: "sneakers", name: "HoloKicks X", price: 220, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=80", badge: "NEW ARRIVAL", description: "Embedded holographic side panels that react to movement, layered over a carbon-fiber chassis." },
    { id: 4, category: "sneakers", name: "Stealth Glide", price: 140, image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=500&q=80", badge: "COLLECTIBLE", description: "Matte black finish with sound-dampening outsoles. Perfect for navigating the urban grid unnoticed." },
    { id: 5, category: "hoodies", name: "Neon Flux Hoodie", price: 85, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80", badge: "", description: "Premium heavyweight cotton infused with glowing thread. Features an oversized, matrix-defying hood." },
    { id: 6, category: "hoodies", name: "Void Walker Pullover", price: 95, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&q=80", badge: "HOT", description: "A minimalist aesthetic hiding complex thermal-regulation tech inside. Ultimate comfort in any realm." },
    { id: 7, category: "hoodies", name: "Cyberpunk Essential", price: 75, image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=500&q=80", badge: "", description: "Durable, multi-pocket utility hoodie designed for the modern netrunner. Weather-resistant." },
    { id: 8, category: "tshirts", name: "Glitch Graphic Tee", price: 35, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=80", badge: "NEW", description: "100% organic cotton with a digitally corrupted logo print that looks different from every angle." },
    { id: 9, category: "tshirts", name: "Synthwave Longsleeve", price: 45, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=500&q=80", badge: "", description: "Breathable and sleek. The grid lines on the sleeves subtly reflect light for late-night visibility." },
    { id: 10, category: "hoodies", name: "Spectral Overcoat", price: 120, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=500&q=80", badge: "TECHWEAR", description: "Heavyweight weather-resistant overlay with integrated strap systems and deep utility pockets." },
    { id: 11, category: "tshirts", name: "Netrunner Tee", price: 40, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80", badge: "CYBER", description: "Bio-engineered organic cotton base-layer featuring moisture-wicking and active cooling fibers." },
    { id: 12, category: "tshirts", name: "Neo-Tokyo Crop Tee", price: 38, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=500&q=80", badge: "STREETWEAR", description: "Breathable design featuring high-density reflective ink print of neo-tokyo grid coordinates." }
];

let currentCategory = 'all';

let cart = JSON.parse(localStorage.getItem('cybersneaks_cart')) || [];
// Upgrade legacy cart items to have a default size of 42
cart = cart.map(item => {
    if (!item.size) {
        item.size = "42";
    }
    return item;
});

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartToggle = document.getElementById('cart-toggle');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartBadge = document.getElementById('cart-badge');
const cartActiveView = document.getElementById('cart-active-view');

// Checkout Modal DOM Elements
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutBtn = document.getElementById('close-checkout');
const checkoutOverlay = document.getElementById('checkout-overlay');
const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout-btn');
const checkoutModalForm = document.getElementById('checkout-modal-form');

const checkoutNameInput = document.getElementById('checkout-name');
const checkoutPhoneInput = document.getElementById('checkout-phone');
const checkoutCountryInput = document.getElementById('checkout-country');
const checkoutAddressInput = document.getElementById('checkout-address');

const checkoutSuccessView = document.getElementById('checkout-success-view');
const checkoutCloseSuccessBtn = document.getElementById('close-checkout-success-btn');

// Init
function init() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
    initSizes();
}

function renderProducts() {
    const filtered = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);
    productsGrid.innerHTML = filtered.map(product => `
        <div class="card">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <img src="${product.image}" alt="${product.name}">
            <div class="card-info">
                <h3>${product.name}</h3>
                <div class="price">$${product.price}</div>
                <button class="details-toggle-btn" onclick="openModal(${product.id})">View Details</button>
            </div>
        </div>
    `).join('');
}

// Modal Elements
const productModal = document.getElementById('product-modal');
const modalOverlay = productModal.querySelector('.modal-overlay');
const modalClose = productModal.querySelector('.modal-close');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDescription = document.getElementById('modal-description');
const modalAddToCart = document.getElementById('modal-add-to-cart');

// Tab Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

window.openModal = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalTitle.textContent = product.name;
    modalPrice.textContent = `$${product.price}`;
    modalDescription.textContent = product.description;
    
    const sizeSelector = document.querySelector('.size-selector');
    if (sizeSelector) {
        sizeSelector.classList.remove('warning-flash');
    }
    const sizeGuidePopover = document.getElementById('size-guide-popover');
    if (sizeGuidePopover) {
        sizeGuidePopover.classList.add('hidden');
    }
    
    modalAddToCart.onclick = function() {
        if (!selectedSize) {
            if (sizeSelector) {
                sizeSelector.classList.remove('warning-flash');
                void sizeSelector.offsetWidth; // trigger reflow
                sizeSelector.classList.add('warning-flash');
            }
            return;
        }
        
        addToCart(product.id, selectedSize);
        
        const originalText = modalAddToCart.textContent;
        modalAddToCart.textContent = "✓ Added to Cart!";
        modalAddToCart.classList.add('success-state');
        
        setTimeout(() => {
            modalAddToCart.textContent = originalText;
            modalAddToCart.classList.remove('success-state');
        }, 2000);
    };
    
    selectedSize = null; 
    document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
    productModal.classList.remove('hidden');
};

function closeModal() {
    productModal.classList.add('hidden');
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

window.addToCart = function(id, size) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === id && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, size: size, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    
    // Trigger pulse animation
    cartBadge.classList.remove('badge-pulse');
    void cartBadge.offsetWidth; // trigger reflow
    cartBadge.classList.add('badge-pulse');
};

window.updateQuantity = function(id, size, delta) {
    const itemIndex = cart.findIndex(item => item.id === id && item.size === size);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        saveCart();
        updateCartUI();
    }
};

function saveCart() {
    localStorage.setItem('cybersneaks_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;

    // Update Items List in Drawer
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 2rem; font-style: italic;">Your cyber-vault is empty.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-size">Size: EU ${item.size}</div>
                    <div class="price">$${item.price}</div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, '${item.size}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, '${item.size}', 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = `$${total.toFixed(2)}`;

    // Update Checkout Button State
    const proceedBtn = document.getElementById('proceed-to-checkout-btn');
    if (proceedBtn) {
        proceedBtn.disabled = cart.length === 0;
    }
}

// Sidebar Toggle Logic
function toggleCart() {
    cartSidebar.classList.toggle('hidden');
    cartOverlay.classList.toggle('hidden');
}

function closeCart() {
    cartSidebar.classList.add('hidden');
    cartOverlay.classList.add('hidden');
}

// Checkout Modal Actions
function openCheckoutModal() {
    closeCart();
    checkoutModal.classList.remove('hidden');
}

function closeCheckoutModal() {
    checkoutModal.classList.add('hidden');
    checkoutModalForm.classList.remove('hidden');
    checkoutSuccessView.classList.add('hidden');
    checkoutModalForm.reset();
}

let selectedSize = null;
function initSizes() {
    const sizeGrid = document.getElementById('modal-size-grid');
    if (!sizeGrid) return;
    const sizes = [39, 40, 41, 42, 43, 44, 45];
    sizeGrid.innerHTML = sizes.map(size => '<button class="size-btn" data-size="' + size + '">EU ' + size + '</button>').join('');
    
    const sizeBtns = sizeGrid.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            selectedSize = e.target.dataset.size;
        });
    });
}

function setupEventListeners() {
    // Restoration of Product Tabs switcher logic inside modal
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetContent = document.getElementById(`tab-${btn.dataset.tab}`);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // Category navigation filter logic with transition
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.dataset.category === currentCategory) return;
            catBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            
            productsGrid.classList.add('grid-fade');
            setTimeout(() => {
                renderProducts();
                productsGrid.classList.remove('grid-fade');
            }, 200);
        });
    });

    cartToggle.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Checkout Modal buttons
    if (proceedToCheckoutBtn) {
        proceedToCheckoutBtn.addEventListener('click', openCheckoutModal);
    }
    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
    }
    if (checkoutOverlay) {
        checkoutOverlay.addEventListener('click', closeCheckoutModal);
    }
    if (checkoutCloseSuccessBtn) {
        checkoutCloseSuccessBtn.addEventListener('click', closeCheckoutModal);
    }

    // Phone format custom validator (starts with +)
    if (checkoutPhoneInput) {
        checkoutPhoneInput.addEventListener('input', () => {
            if (!checkoutPhoneInput.value.trim().startsWith('+')) {
                checkoutPhoneInput.setCustomValidity("Phone number must start with '+' (e.g. +123456789)");
            } else {
                checkoutPhoneInput.setCustomValidity("");
            }
        });
    }

    // Checkout Form submission
    if (checkoutModalForm) {
        checkoutModalForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Additional JS safety check
            if (!checkoutPhoneInput.value.trim().startsWith('+')) {
                checkoutPhoneInput.setCustomValidity("Phone number must start with '+' (e.g. +123456789)");
                checkoutPhoneInput.reportValidity();
                return;
            }

            const submitBtn = document.getElementById('submit-order-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "AUTHORIZING VAULT...";
            submitBtn.disabled = true;

            const orderData = {
                name: checkoutNameInput.value.trim(),
                contact: checkoutPhoneInput.value.trim(),
                country: checkoutCountryInput.value.trim(),
                address: checkoutAddressInput.value.trim(),
                cart: cart.map(item => ({
                    name: `${item.name} (Size: EU ${item.size})`,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size
                })),
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };

            try {
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                if (response.ok) {
                    cart = [];
                    saveCart();
                    updateCartUI();
                    checkoutModalForm.classList.add('hidden');
                    checkoutSuccessView.classList.remove('hidden');
                } else {
                    alert("Authorization failed. Please check connection and values.");
                }
            } catch (err) {
                console.error("Checkout Error:", err);
                alert("Grid database offline. Transaction aborted.");
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Size Guide popover listeners
    const sizeGuideBtn = document.getElementById('size-guide-btn');
    const sizeGuidePopover = document.getElementById('size-guide-popover');
    const closeSizeGuideBtn = document.getElementById('close-size-guide');
    
    if (sizeGuideBtn && sizeGuidePopover) {
        sizeGuideBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sizeGuidePopover.classList.toggle('hidden');
        });
    }
    
    if (closeSizeGuideBtn && sizeGuidePopover) {
        closeSizeGuideBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sizeGuidePopover.classList.add('hidden');
        });
    }
    
    document.addEventListener('click', (e) => {
        if (sizeGuidePopover && !sizeGuidePopover.classList.contains('hidden')) {
            if (!sizeGuidePopover.contains(e.target) && e.target !== sizeGuideBtn) {
                sizeGuidePopover.classList.add('hidden');
            }
        }
    });
}

// Start App
init();