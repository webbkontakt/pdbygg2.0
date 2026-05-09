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

// ================== FADES ==================
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.2 });
fadeEls.forEach(el => observer.observe(el));

// ================== MENY ==================
function toggleMeny() {
    const meny = document.getElementById("meny");
    meny.classList.toggle("show");
}

document.querySelectorAll("#meny a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("meny").classList.remove("show");
    });
});

// ================== SHOPIFY BUY BUTTON INIT ==================
(function () {
  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      loadScript();
    }
  } else {
    loadScript();
  }

  function loadScript() {
    var script = document.createElement('script');
    script.async = true;
    script.src = scriptURL;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    script.onload = ShopifyBuyInit;
  }

  function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
      domain: 'huu0xn-e1.myshopify.com',
      storefrontAccessToken: 'f66ff6755aa4d8ec01b3c288d3dd90b3',
    });

    ShopifyBuy.UI.onReady(client).then(function (ui) {
      
      // GEMENSAMMA KNAPP-INSTÄLLNINGAR
      const commonOptions = {
        "product": {
          "styles": {
            "product": { "margin-left": "0px", "margin-bottom": "0px", "padding-top": "0px" },
            "button": {
              "height": "40px",
              "width": "100%",
              "font-size": "14px",
              "background-color": "#7ac039",
              "border-radius": "5px",
              ":hover": { "background-color": "#b5d854" }
            }
          },
          "contents": { "img": false, "title": false, "price": false, "options": false },
          "text": { "button": "KÖP" }
        },
        "cart": {
          "popup": false,
          "contents": {
            "button": true, // Aktiverar Checkout-knappen
            "footer": true  // Visar summan och knappen längst ner
          },
          "styles": { 
            "button": { 
              "background-color": "#7ac039",
              ":hover": { "background-color": "#b5d854" }
            } 
          },
          "text": {
            "title": "Kundvagn",
            "total": "Totalt",
            "empty": "Din kundvagn är tom.",
            "notice": "Frakt och rabattkoder läggs till i kassan.",
            "button": "TILL KASSAN"
          }
        },
        "toggle": {
          "styles": {
            "toggle": { "background-color": "#7ac039", "count": { "font-size": "14px" } }
          }
        }
      };

      // PRODUKT 1: KRAFTBORSTEN
      ui.createComponent('product', {
        id: '10766895120722',
        node: document.getElementById('product-component-1778246133497'),
        moneyFormat: '%7B%7Bamount_with_space_separator%7D%7D%20kr',
        options: commonOptions
      });

      // PRODUKT 2: HINKLÅSET
      ui.createComponent('product', {
        id: '10766910390610', // <-- DUBBELKOLLA DETTA ID FRÅN SHOPIFY ADMIN
        node: document.getElementById('product-component-1778259314915'),
        moneyFormat: '%7B%7Bamount_with_space_separator%7D%7D%20kr',
        options: commonOptions
      });

      // KUNDVAGNS-TRIGGER (Öppna/Stäng med din egen ikon)
      var cartTrigger = document.getElementById('toggle-cart');
      if (cartTrigger) {
        cartTrigger.addEventListener('click', function () {
          ui.toggleCart(); 
        });
      }
      // KUNDVAGNS-TRIGGER
var cartTrigger = document.getElementById('toggle-cart');
if (cartTrigger) {
    cartTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation(); // Hindrar klicket från att sprida sig till bakgrunden
        
        if (ui.cart.isVisible) {
            ui.cart.closeCart();
        } else {
            ui.cart.openCart();
        }
    });
}
    });
  }
  if (ui.cart.isVisible) {
    document.body.style.overflow = 'hidden'; // Låser bakgrunden
    ui.cart.closeCart();
} else {
    document.body.style.overflow = ''; // Släpper bakgrunden
    ui.cart.openCart();
}
})();