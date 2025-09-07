// scroll to top
window.scrollTo(0, 0);
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
// Loading Screen
window.addEventListener("load", function () {
  document.getElementById("loading-screen").style.display = "none";
});
// end Loading Screen


// dropdown
const dropdownBtns = document.querySelectorAll(".dropdown-btn");
dropdownBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    btn.parentElement.classList.toggle("open");
  });
});
// end dropdown

// search form
const searchIcon = document.getElementById("search");
const searchForm = document.getElementById("search-form");

searchIcon.addEventListener("click", (e) => {
  e.preventDefault();
  searchForm.classList.toggle("active");
});
// end search form

// change header color
window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// end change header color
// hamburger menu
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});


// end hamburger menu

// checkout
// start cart && Cart Sidebar
document.addEventListener('DOMContentLoaded', () => {
  console.log('Cart script loaded');

  const cartSidebar = document.getElementById('cartSidebar');
  const cartLink = document.getElementById('cart');       
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCountBadge = document.getElementById('cart-count');
  const subtotalEl = document.getElementById('subtotal');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (!cartLink || !cartSidebar) {
    console.warn('Cart elements missing — check that #cart and #cartSidebar exist in HTML');
    return;
  }

  let cart = {};

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {

      localStorage.setItem("checkoutCart", JSON.stringify(cart));


      window.location.href = "checkout.html";
    });
  }

  cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.toggle('open');
  });

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));
  }
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      cart = {};
      renderCart();
    });
  }

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productEl = e.target.closest('.product');
      if (!productEl) return console.warn('product element not found for clicked button');

      const nameEl = productEl.querySelector('.product-title') || productEl.querySelector('h3');
      const priceEl = productEl.querySelector('.product-price');
      const imgEl = productEl.querySelector('img.product-img') || productEl.querySelector('img');

      const name = nameEl ? nameEl.innerText.trim() : ('item-' + Date.now());
      const price = priceEl
        ? parseFloat(priceEl.dataset.price ?? priceEl.innerText.replace(/[^0-9.]/g, '')) || 0
        : 0;
      const imgSrc = imgEl ? imgEl.src : '';

      if (cart[name]) cart[name].qty++;
      else cart[name] = { name, price, qty: 1, imgSrc };

      renderCart();


      flyToCart(imgEl, cartLink);

      cartSidebar.classList.add('open');
    });
  });

  function renderCart() {
    cartItemsContainer.innerHTML = '';
    let subtotal = 0, totalQty = 0;
    Object.values(cart).forEach(item => {
      subtotal += item.price * item.qty;
      totalQty += item.qty;

      const itemRow = document.createElement('div');
      itemRow.className = 'cart-item';
      itemRow.style.display = 'flex';
      itemRow.style.gap = '10px';
      itemRow.style.alignItems = 'center';
      itemRow.innerHTML = `
        <img src="${item.imgSrc}" alt="${item.name}" style="width:56px;height:56px;object-fit:cover;border-radius:8px">
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <strong style="font-size:14px">${item.name}</strong>
            <button class="remove-item" data-name="${item.name}" style="background:#b98815;color:#fff;border:none;border-radius:6px;padding:4px 6px;cursor:pointer">✖</button>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:13px;color:#555">
            <span>Qty: <span class="qty">${item.qty}</span></span>
            <span>$${(item.price * item.qty).toFixed(2)}</span>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(itemRow);
    });

    cartCountBadge.textContent = totalQty;
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.name;
        delete cart[key];
        renderCart();
      });
    });

    if (Object.keys(cart).length === 0) {
      cartItemsContainer.innerHTML = '<p style="color:#777">Your cart is empty.</p>';
    }
  }

  function flyToCart(sourceEl, cartIcon) {
    if (!sourceEl || !cartIcon) return;

    const layer = document.getElementById('fx-layer');
    if (!layer) return;

    const from = sourceEl.getBoundingClientRect();
    const to   = cartIcon.getBoundingClientRect();

    let cloneImg;
    if (sourceEl.tagName === 'IMG' && sourceEl.currentSrc) {
      cloneImg = sourceEl.cloneNode(true);
    } else {
      const bg = getComputedStyle(sourceEl).backgroundImage;
      const match = bg && bg.match(/url\(["']?(.+?)["']?\)/);
      if (!match) return;
      cloneImg = new Image();
      cloneImg.src = match[1];
      cloneImg.alt = 'flying';
    }

    cloneImg.classList.add('fly-img');
    layer.appendChild(cloneImg);

    Object.assign(cloneImg.style, {
      left: from.left + 'px',
      top:  from.top  + 'px',
      width:  from.width  + 'px',
      height: from.height + 'px',
      transform: 'translate(0,0) scale(1)',
      opacity: '1'
    });

    cloneImg.getBoundingClientRect();

    const fromCenterX = from.left + from.width/2;
    const fromCenterY = from.top  + from.height/2;
    const toCenterX   = to.left   + to.width/2;
    const toCenterY   = to.top    + to.height/2;

    const translateX = toCenterX - fromCenterX;
    const translateY = toCenterY - fromCenterY;

    cloneImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.2)`;
    cloneImg.style.opacity   = '0';

    const cleanup = () => cloneImg && cloneImg.remove();
    cloneImg.addEventListener('transitionend', cleanup, { once: true });
    setTimeout(cleanup, 1200);
  }

  renderCart();

  document.addEventListener('click', (e) => {
    if (!cartSidebar.classList.contains('open')) return;
    const inside = cartSidebar.contains(e.target) || cartLink.contains(e.target);
    if (!inside) cartSidebar.classList.remove('open');
  });
});
// end cart

// start men women perfume button
document.addEventListener('DOMContentLoaded', function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const products   = Array.from(document.querySelectorAll('.product'));

  function showGroup(group){
    products.forEach((card, i) => {
      const shouldShow = card.classList.contains(group);

      if (shouldShow) {
        if (card.classList.contains('is-hidden')) {
          card.classList.remove('is-hidden');
          card.classList.add('is-hiding');

          setTimeout(() => {
            card.classList.remove('is-hiding');
          }, 20 + i * 80);
        }
      }

      else {
        if (!card.classList.contains('is-hidden')) {
          card.classList.add('is-hiding');
          card.addEventListener('transitionend', function onEnd(e){
            if (e.propertyName === 'opacity') {
              card.classList.add('is-hidden');
              card.classList.remove('is-hiding');
              card.removeEventListener('transitionend', onEnd);
            }
          }, { once: true });
        }
      }
    });
  }
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showGroup(btn.dataset.filter);
    });
  });
  showGroup('women');
});

// end men women perfume button

// ______________________________________________
// dot & nextBtn & prevBtn 
const slider = document.getElementById("slider");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;
const totalSlides = slider.children.length;

function updateSlide() {
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;

  dots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.style.backgroundColor = "#4a2c02"; 
    } else {
      dot.style.backgroundColor = "#9CA3AF"; 
    }
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener("mouseenter", () => {
    dot.style.backgroundColor = "#b98815";  
  });

  dot.addEventListener("mouseleave", () => {
    if (index === currentIndex) {
      dot.style.backgroundColor = "#6d4f26";  
    } else {
      dot.style.backgroundColor = "#9CA3AF";  
    }
  });

  dot.addEventListener("click", () => {
    currentIndex = index;
    updateSlide();
  });
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlide();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlide();
});

updateSlide();

// end Slider Functionality
// ______________________________________________
// quiz Functionality Data step
const modal = document.getElementById("quizModal");
const modalBox = document.getElementById("modalBox");
const quizContent = document.getElementById("quizContent");
const closeBtn = document.querySelector(".close");
const startBtns = document.querySelectorAll("#btn-main-1, #btn-main-2");

let currentStep = 0;
let selectedType = "";
let selectedTime = "";

// Steps data
const steps = [
  {
    question: "Choose your fragrance type:",
    choices: [
      { src: "assets/img/flowers1.png", color: "linear-gradient(to right, pink, lavender)", value: "Flowers" },
      { src: "assets/img/fruits1.png", color: "linear-gradient(to right, #ff7f50, #ffd700)", value: "Fruits" },
      { src: "assets/img/woods1.png", color: "linear-gradient(to right, #8b4513, #654321)", value: "Woods" }
    ]
  },
  {
    question: "When will you use it?",
    choices: [
      { src: "assets/img/day.png", color: "linear-gradient(to right, #87ceeb, #f0e68c)", value: "Day" },
      { src: "assets/img/night.png",color:"linear-gradient(to right, #2c3e50, #34495e)", value: "Night" },
      { src: "assets/img/special.png",color:"linear-gradient(to right, #ff69b4, #8a2be2)", value: "Special" }
    ]
  }
];

// Open modal
startBtns.forEach(btn => btn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  currentStep = 0;
  selectedType = "";
  selectedTime = "";
  modalBox.style.background = "white";
  renderStep();
}));

// Close modal
closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

// Render step
function renderStep() {
  if(currentStep < steps.length){
    const step = steps[currentStep];
    quizContent.innerHTML = `<h2>${step.question}</h2>
      <div class="choices">
        ${step.choices.map((c,i)=>`<img src="${c.src}" class="choice-img" data-index="${i}">`).join("")}
      </div>`;

    document.querySelectorAll(".choice-img").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const choice = step.choices[btn.dataset.index];
        if(currentStep === 0){
          selectedType = choice.value;
          modalBox.style.background = choice.color; 
        }
        else selectedTime = choice.value;
        currentStep++;
        renderStep();
      });
    });
  } else {
    renderResult();
  }
}

// Render results
function renderResult() {
  const images = {
    Flowers: {
      Day: ["assets/img/flowers-day1.png", "assets/img/flowers-day2.png", "assets/img/flowers-day3.png"],
      Night: ["assets/img/flowers-night1.png", "assets/img/flowers-night2.png", "assets/img/flowers-night3.png"],
      Special: ["assets/img/flowers-day1.png", "assets/img/flowers-night1.png", "assets/img/flowers-night2.png"]
    },
    Fruits: {
      Day: ["assets/img/fruits-day1.png", "assets/img/fruits-day2.png", "assets/img/fruits-day3.png"],
      Night: ["assets/img/fruits-night1.png", "assets/img/fruits-night2.png", "assets/img/fruits-day1.png"],
      Special: ["assets/img/fruits-day2.png", "assets/img/fruits-day3.png", "assets/img/fruits-night1.png"]
    },
    Woods: {
      Day: ["assets/img/fruits-day2.png", "assets/img/fruits-night1.png", "assets/img/fruits-day1.png"],
      Night: ["assets/img/fruits-day1.png", "assets/img/fruits-day2.png", "assets/img/fruits-night1.png"],
      Special: ["assets/img/fruits-night1.png", "assets/img/fruits-day1.png", "assets/img/fruits-day2.png"]
    }
  }; // هذا السميك صحيح الآن

  const resultImages = images[selectedType][selectedTime] || [];

  quizContent.innerHTML = `<h2>Your Recommendations:</h2>
    <div class="results">
      ${resultImages.map(src=>`<div class="perfume-card"><img src="${src}"></div>`).join("")}
    </div>`;

  document.querySelectorAll(".perfume-card").forEach((el,i)=>{
    setTimeout(()=> el.classList.add("show"), i*300);
  });
}

// fade-in-up
window.addEventListener("load", () => {
  document.querySelectorAll(".fade-in-up").forEach(el => {
    setTimeout(() => {
      el.classList.add("show");
    }, 200); // فوق &&تحت
      });
});
// fade-in-up4
window.addEventListener("load", () => {
  document.querySelectorAll(".fade-in-up-4").forEach(el => {
    setTimeout(() => {
      el.classList.add("show");
    }, 200); // فوق &&تحت
      });
});
// fade-in-up2
window.addEventListener("load", () => {
  document.querySelectorAll(".fade-in-up-2").forEach(el => {
    setTimeout(() => {
      el.classList.add("show");
    }, 200); //يمين &&يسار
  });
});
// fade-in-up3
window.addEventListener("load", () => {
  document.querySelectorAll(".fade-in-up-3").forEach(el => {
    setTimeout(() => {
      el.classList.add("show");
    }, 200); //يمين &&يسار
  });
});
// scroll reveal
window.addEventListener("scroll", () => {
  const elements = document.querySelectorAll(".scroll-reveal");
  const triggerBottom = window.innerHeight * 0.85; 

  elements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;

    if (boxTop < triggerBottom) {
      el.classList.add("visible");
    }
  });
});
// Selector All and add smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});


