window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.getElementById('myHeader')?.classList.toggle('scrolled', scrollY > 50);
    document.getElementById('logga')?.classList.toggle('scrolled', scrollY > 50);
});

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('cookie-overlay');
    const banner = document.getElementById('cookie-banner');
    const settings = document.getElementById('cookie-settings');
    const acceptAll = document.getElementById('accept-all');
    const customize = document.getElementById('customize');
    const saveSettings = document.getElementById('save-settings');

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');

    function stangBanner() {
        if (!overlay) return;
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
        banner.style.display = 'none';
        settings.style.display = 'none';
        document.body.classList.remove('cookie-blocked');
    }

    if (!cookiesAccepted && overlay) {
        overlay.style.display = 'block';
        overlay.style.pointerEvents = 'auto';
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

const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.2 });
fadeEls.forEach(el => observer.observe(el));

function toggleMeny() {
    const meny = document.getElementById("meny");
    meny.classList.toggle("show");
}

document.querySelectorAll("#meny a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("meny").classList.remove("show");
    });
});

(function () {
    var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    function loadScript() {
        var script = document.createElement('script');
        script.async = true; 
        script.src = scriptURL;
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        script.onload = ShopifyBuyInit;
    }
    if (window.ShopifyBuy) { 
        if (window.ShopifyBuy.UI) { 
            ShopifyBuyInit(); 
        } else { 
            loadScript(); 
        } 
    } else { 
        loadScript(); 
    }

    function städaKundvagn() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (!doc) return;

                const textNodes = [];
                const walk = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false);
                let n;
                while (n = walk.nextNode()) {
                    if (n.nodeValue.includes('$')) {
                        n.nodeValue = n.nodeValue.replace('$', '').replace('.00', '').trim() + ' kr';
                    }
                }

                const subtotal = doc.querySelector('.shopify-buy__cart-subtotal__title');
                if (subtotal && (subtotal.textContent.toLowerCase().includes('subtotal') || subtotal.textContent.includes('Total'))) {
                    subtotal.textContent = 'Totalt:';
                }
            } catch (e) {}
        });
    }

    setInterval(städaKundvagn, 100);

    function ShopifyBuyInit() {
        var client = ShopifyBuy.buildClient({
            domain: 'huu0xn-e1.myshopify.com',
            storefrontAccessToken: 'f66ff6755aa4d8ec01b3c288d3dd90b3',
            language: 'sv-SE'
        });

        ShopifyBuy.UI.onReady(client).then(function (ui) {
            const commonMoney = "{{amount}} kr";

            ui.createComponent('cart', {
                node: document.getElementById('shopify-cart-trigger'),
                moneyFormat: commonMoney,
                options: {
                    "global": {
                        "moneyFormat": commonMoney
                    },
                    "lineItem": {
                        "moneyFormat": commonMoney
                    },
                    "cart": {
                        "popup": true,
                        "moneyFormat": commonMoney,
                        "styles": {
                            "button": {
                                "background-color": "#79bc55",
                                ":hover": { "background-color": "#6da94d" },
                                ":focus": { "background-color": "#6da94d" },
                                "border-radius": "6px"
                            }
                        },
                        "text": { 
                            "title": "Kundvagn", 
                            "total": "Totalt",
                            "empty": "Din kundvagn är tom.",
                            "notice": "Frakt och rabattkoder finns i kassan.",
                            "button": "Slutför köp"
                        },
                        "DOMEvents": {
                            "render": function (component) {
                                const antalSpan = document.getElementById('vagn-antal');
                                if (antalSpan) {
                                    antalSpan.textContent = component.model.lineItems.reduce((total, item) => total + item.quantity, 0);
                                }
                                städaKundvagn();
                            }
                        }
                    },
                    "toggle": {
                        "sticky": false,
                        "styles": {
                            "toggle": {
                                "background-color": "transparent",
                                "icon": { "fill": "#4ea733" },
                                "count": { "background-color": "transparent" }
                            }
                        }
                    }
                }
            });

            const prodOptions = {
                "product": {
                    "moneyFormat": commonMoney,
                    "styles": {
                        "product": {
                            "@media (min-width: 601px)": {
                                "max-width": "calc(25% - 20px)",
                                "margin-left": "20px",
                                "margin-bottom": "50px"
                            }
                        },
                        "button": {
                            "background-color": "#79bc55",
                            ":hover": { "background-color": "#6da94d" },
                            ":focus": { "background-color": "#6da94d" },
                            "border-radius": "6px",
                            "padding-left": "20px",
                            "padding-right": "20px",
                            "width": "100%"
                        }
                    },
                    "contents": { "img": false, "title": false, "price": false },
                    "text": { "button": "KÖP" }
                }
            };

            var n1 = document.getElementById('product-component-1778246133497');
            if (n1) { ui.createComponent('product', { id: '10766895120722', node: n1, options: prodOptions }); }

            var n2 = document.getElementById('product-component-1778259314915');
            if (n2) { ui.createComponent('product', { id: '10766910390610', node: n2, options: prodOptions }); }
        });
    }
})();