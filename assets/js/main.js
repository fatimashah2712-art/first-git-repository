const PRODUCTS = [
  { id: 1, name: 'Classic Denim Jacket', category: 'Fashion', price: 79, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Minimal White Sneakers', category: 'Footwear', price: 95, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Wireless Noise-Canceling Headphones', category: 'Electronics', price: 149, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Smart Fitness Watch', category: 'Electronics', price: 129, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'Leather Crossbody Bag', category: 'Accessories', price: 110, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: 'Modern Desk Lamp', category: 'Home', price: 48, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
  { id: 7, name: 'Organic Cotton T-Shirt', category: 'Fashion', price: 35, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80' },
  { id: 8, name: 'Travel Backpack Pro', category: 'Lifestyle', price: 89, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80' }
];

const getCart = () => JSON.parse(localStorage.getItem('novacart-cart') || '[]');
const setCart = (cart) => localStorage.setItem('novacart-cart', JSON.stringify(cart));

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count;
  });
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) existing.qty += 1;
  else cart.push({ id: productId, qty: 1 });
  setCart(cart);
  updateCartCount();
  alert('Product added to cart!');
}

function renderCards(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = products
    .map(
      (product) => `
      <article class="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
        <img src="${product.image}" alt="${product.name}" class="h-52 w-full object-cover" />
        <div class="p-4">
          <p class="text-xs uppercase text-indigo-600 font-semibold">${product.category}</p>
          <h3 class="font-semibold text-lg mt-1">${product.name}</h3>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-xl font-bold">$${product.price}</span>
            <button data-add="${product.id}" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">Add to Cart</button>
          </div>
        </div>
      </article>`
    )
    .join('');

  container.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.add)));
  });
}

function renderFeatured() {
  renderCards('featured-products', PRODUCTS.slice(0, 4));
}

function renderProductsPage() {
  const gridId = 'all-products';
  if (!document.getElementById(gridId)) return;

  const categoryFilter = document.getElementById('category-filter');
  const searchInput = document.getElementById('product-search');

  const paint = () => {
    const category = categoryFilter.value;
    const term = searchInput.value.toLowerCase();
    const filtered = PRODUCTS.filter((product) => {
      const categoryMatch = category === 'all' || product.category.toLowerCase() === category;
      const textMatch = product.name.toLowerCase().includes(term);
      return categoryMatch && textMatch;
    });
    renderCards(gridId, filtered);
  };

  categoryFilter.addEventListener('change', paint);
  searchInput.addEventListener('input', paint);
  paint();
}

function renderCartPage() {
  const tableBody = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!tableBody || !totalEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="py-8 text-center text-slate-500">Your cart is empty.</td></tr>';
    totalEl.textContent = '$0';
    return;
  }

  let total = 0;
  tableBody.innerHTML = cart
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) return '';
      const line = product.price * item.qty;
      total += line;
      return `
        <tr class="border-t border-slate-200">
          <td class="py-3">${product.name}</td>
          <td class="py-3">$${product.price}</td>
          <td class="py-3">${item.qty}</td>
          <td class="py-3">$${line}</td>
          <td class="py-3"><button data-remove="${item.id}" class="text-red-600 hover:underline">Remove</button></td>
        </tr>`;
    })
    .join('');

  totalEl.textContent = `$${total}`;

  tableBody.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.remove);
      const updated = getCart().filter((item) => item.id !== id);
      setCart(updated);
      updateCartCount();
      renderCartPage();
    });
  });
}

function wireAuthAndContactForms() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      if (!email || !password) return alert('Please enter email and password.');
      localStorage.setItem('novacart-user', JSON.stringify({ email }));
      alert('Login successful (demo mode).');
      window.location.href = 'index.html';
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks! Your message has been submitted.');
      contactForm.reset();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderFeatured();
  renderProductsPage();
  renderCartPage();
  wireAuthAndContactForms();
});
