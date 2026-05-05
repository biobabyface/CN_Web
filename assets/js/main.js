/* ===== 共用 JS:導覽、購物車、Toast ===== */
(function () {
  'use strict';

  /* --- 行動版選單 --- */
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  /* --- 購物車儲存 --- */
  const CART_KEY = 'mt_cart_v1';
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }
  function setCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    refreshCartCount();
    document.dispatchEvent(new CustomEvent('cart:change'));
  }
  function refreshCartCount() {
    const count = getCart().reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'grid' : 'none';
    });
  }
  function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing) existing.qty += (item.qty || 1);
    else cart.push({ ...item, qty: item.qty || 1 });
    setCart(cart);
    showToast(`已加入「${item.name}」`, 'success');
  }
  function removeFromCart(id) {
    setCart(getCart().filter(i => i.id !== id));
  }
  function updateQty(id, delta) {
    const cart = getCart();
    const it = cart.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, it.qty + delta);
    setCart(cart);
  }
  function clearCart() { setCart([]); }

  /* --- Toast --- */
  function showToast(msg, type = '') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = 'toast ' + type + ' show';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  /* --- 導覽列當前頁高亮 --- */
  const curr = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === curr || (curr === '' && href === 'index.html')) a.classList.add('active');
  });

  /* --- 暴露 API --- */
  window.MT = {
    getCart, setCart, addToCart, removeFromCart, updateQty, clearCart,
    showToast, refreshCartCount,
  };

  refreshCartCount();
})();
