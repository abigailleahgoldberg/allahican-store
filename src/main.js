import './style.css';

const PRODUCTS = {
  tee: { id: '422980217', name: 'AllahiCan Basic Tee', price: 30.00, image: 'https://files.cdn.printful.com/files/a82/a82250a249cf968e5c826cda7bde8f5c_preview.png' },
  tank: { id: '422980731', name: 'AllahiCan Black Tank', price: 27.00, image: 'https://files.cdn.printful.com/files/9e1/9e133533eabc4181213fcea3e7540bfe_preview.png' },
  mat: { id: '422980859', name: 'AllahiCan Prayer Mat', price: 35.00, image: 'https://files.cdn.printful.com/files/a82/a82250a249cf968e5c826cda7bde8f5c_preview.png' }
};

const VARIANTS = {
  '422980217': { 'S': '5226238911', 'M': '5226238912', 'L': '5226238914' },
  '422980731': { 'S': '5226243048', 'M': '5226243049', 'L': '5226243050' },
  '422980859': { 'Default': '5226244619' }
};

let cart = JSON.parse(localStorage.getItem('allahican-cart') || '[]');

function addToCart(productKey, size) {
  const product = PRODUCTS[productKey];
  const variantId = VARIANTS[product.id][size] || VARIANTS[product.id]['Default'];
  if (!size && productKey !== 'mat') { alert('Please select a size first'); return; }
  const existingItem = cart.find(item => item.id === product.id && item.size === size);
  if (existingItem) { existingItem.quantity += 1; } 
  else { cart.push({ ...product, variantId, size: size || 'One Size', quantity: 1 }); }
  localStorage.setItem('allahican-cart', JSON.stringify(cart));
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
  }
}

async function checkout() {
  const response = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart, success_url: '/shop/success', cancel_url: '/shop' })
  });
  const { url } = await response.json();
  window.location = url;
}

window.checkout = checkout;

document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-container');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
             window.location.href = '/shop/cart';
        });
    }

  document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const productType = card.dataset.product;
      const select = card.querySelector('select');
      const size = select ? select.value : 'Default';
      addToCart(productType, size);
    });
  });
  updateCartDisplay();
});
