// ================== HEADER SCROLL ==================
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.getElementById('myHeader')?.classList.toggle('scrolled', scrollY > 50);
    document.getElementById('logga')?.classList.toggle('scrolled', scrollY > 50);
});

// ================== COOKIES ==================
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('cookie-overlay');
    const banner = document.getElementById('cookie-banner');
    const settings = document.getElementById('cookie-settings');
    const acceptAll = document.getElementById('accept-all');
    const customize = document.getElementById('customize');
    const saveSettings = document.getElementById('save-settings');

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');

    function stangBanner() {
        overlay.style.display = 'none';
        banner.style.display = 'none';
        settings.style.display = 'none';
        document.body.classList.remove('cookie-blocked');
    }

    if (!cookiesAccepted) {
        overlay.style.display = 'block';
        banner.style.display = 'block';
        settings.style.display = 'none';
        document.body.classList.add('cookie-blocked');
    } else {
        stangBanner();
    }

    acceptAll?.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', JSON.stringify({
            essential: true,
            analytics: true,
            marketing: true
        }));
        stangBanner();
    });

    customize?.addEventListener('click', () => {
        banner.style.display = 'none';
        settings.style.display = 'block';
    });

    saveSettings?.addEventListener('click', () => {
        const analytics = document.getElementById('analytics')?.checked || false;
        const marketing = document.getElementById('marketing')?.checked || false;

        localStorage.setItem('cookiesAccepted', JSON.stringify({
            essential: true,
            analytics,
            marketing
        }));
        stangBanner();
    });
});

// ================== FADES ==================
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.2 });
fadeEls.forEach(el => observer.observe(el));

// ================== SLIDES ==================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let isAnimating = false;
setInterval(() => changeSlide(1), 5000);

function changeSlide(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const current = slides[currentSlide];
    current.classList.remove('active');
    current.classList.add('exit-left');

    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    const next = slides[currentSlide];

    next.classList.remove('exit-left');
    next.classList.add('active');
    
    next.style.transform = `translateX(${direction === 1 ? '100%' : '-100%'})`;
    next.style.opacity = '0';
    void next.offsetWidth; 
    next.style.transform = 'translateX(0)';
    next.style.opacity = '1';

    setTimeout(() => {
        current.classList.remove('exit-left');
        isAnimating = false;
    }, 1000);
}

// ================== MENY ==================
function toggleMeny() {
    const meny = document.getElementById("meny");
    meny.classList.toggle("show");
}

// Stäng menyn om man klickar på en länk
document.querySelectorAll("#meny a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("meny").classList.remove("show");
    });
});


window.addEventListener('scroll', () => {
    const meny = document.getElementById('meny');
    if (meny?.classList.contains('visad')) meny.classList.remove('visad');
});

// ================== KUNDVAGN ==================
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 🔥 FIX: PRODUKTER MATCHAS PÅ stripePriceId — INTE NAMN 🔥
function addToCart(name, price, imageUrl, stripePriceId) {
    const cart = getCart();

    const existingItem = cart.find(item => item.stripePriceId === stripePriceId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name,
            price,
            imageUrl,       // 🔥 ingen png-tvingning längre
            quantity: 1,
            stripePriceId
        });
    }

    setCart(cart);
    updateCartCount();
}

// ================== UPDATE CART COUNT ==================
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

function handleAddToCart(button, name, price, imageUrl, stripePriceId) {
    addToCart(name, price, imageUrl, stripePriceId);

    const productDiv = button.closest('.kraftborsten');
    const productImg = productDiv?.querySelector('img');

    if (productImg) {
        flyToCart(productImg);
    }
}



function flyToCart(imageElement) {
    const cartLink = document.querySelector('a[href="cart.html"]');
    if (!cartLink) return;

    const imgRect = imageElement.getBoundingClientRect();
    const cartRect = cartLink.getBoundingClientRect();

    const flyImg = imageElement.cloneNode(true);
    flyImg.style.position = 'fixed';
    flyImg.style.left = imgRect.left + 'px';
    flyImg.style.top = imgRect.top + 'px';
    flyImg.style.width = imgRect.width + 'px';
    flyImg.style.height = imgRect.height + 'px';
    flyImg.style.zIndex = 9999;
    flyImg.style.transition = 'all 0.8s ease';
    flyImg.style.pointerEvents = 'none';

    document.body.appendChild(flyImg);

    requestAnimationFrame(() => {
        flyImg.style.left = cartRect.left + 'px';
        flyImg.style.top = cartRect.top + 'px';
        flyImg.style.width = '20px';
        flyImg.style.height = '20px';
        flyImg.style.opacity = '0.2';
    });

    flyImg.addEventListener('transitionend', () => flyImg.remove());
}


// ================== LOAD CART (cart.html) ==================
function loadCart() {
    const cart = getCart();
    const table = document.getElementById('cart-items');
    const tbody = table?.querySelector('tbody');
    const totalElement = document.getElementById('total');

    if (tbody && totalElement) {
        tbody.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>
                    <div style="display:flex;align-items:center;gap:10px">
                        <button class="remove-btn">🗑️</button>
                        <img src="${item.imageUrl}" style="width:120px;height:150px;object-fit:cover;border-radius:5px">
                    </div>
                </td>
                <td>${item.name}</td>
                <td>
                    <div class="qty-container">
                        <button class="qty-btn minus"><i class="fa-solid fa-minus"></i></button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn plus"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </td>
                <td>${item.price} kr</td>
                <td>${item.price * item.quantity} kr</td>
            `;

            // Ta bort
            row.querySelector('.remove-btn').addEventListener('click', () => {
                const index = cart.findIndex(i => i.stripePriceId === item.stripePriceId);
                cart.splice(index, 1);
                setCart(cart);
                loadCart();
                updateCartCount();
            });

            // Minus
            row.querySelector('.minus').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    setCart(cart);
                    loadCart();
                }
            });

            // Plus
            row.querySelector('.plus').addEventListener('click', () => {
                item.quantity++;
                setCart(cart);
                loadCart();
            });

            tbody.appendChild(row);
            total += item.price * item.quantity;
        });

        totalElement.textContent = `Totalt: ${total} kr`;
    }
}

// ================== CHECKOUT ==================
async function goToCheckout() {
    try {
        const cart = getCart();
        if (cart.length === 0) {
            alert("Din kundvagn är tom!");
            return;
        }

        const response = await fetch("https://pdbygg2-0.onrender.com/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart })
    });


        const data = await response.json();

        if (!data.url) {
            alert("Kunde inte starta Stripe checkout!");
            return;
        }

        window.location.href = data.url;

    } catch (error) {
        console.error(error);
        alert("Något gick fel vid checkout!");
    }
}

// ================== CLEAR CART ==================
function clearCart() {
    localStorage.removeItem('cart');
    loadCart();
    updateCartCount();
}

// ================== INIT ==================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadCart();
});

window.handleAddToCart = handleAddToCart;