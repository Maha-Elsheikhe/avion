const CART_KEY = "avion-cart";
const cartItems = document.querySelector("#cartItems");
const emptyCart = document.querySelector("#emptyCart");
const cartSummary = document.querySelector("#cartSummary");
const subtotal = document.querySelector("#subtotal");

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(cart) ? cart.map((item, index) => ({
      ...item,
      id: item.id || `${item.title || "product"}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      image: item.image || item["img-src"] || "",
      quantity: Math.max(1, Number(item.quantity) || 1),
    })) : [];
  } catch { return []; }
}
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function money(value) { return `$${Number(value).toFixed(2)}`; }

function renderCart() {
  const cart = getCart();
  cartItems.replaceChildren();
  emptyCart.hidden = cart.length !== 0;
  cartSummary.hidden = cart.length === 0;
  cart.forEach((item) => {
    const row = document.createElement("article"); row.className = "cart-row";
    const image = document.createElement("img"); image.src = item.image || item["img-src"] || ""; image.alt = item.title;
    const info = document.createElement("div");
    const title = document.createElement("h2"); title.textContent = item.title;
    const price = document.createElement("p"); price.textContent = `${money(item.price)} each`;
    info.append(title, price);
    const controls = document.createElement("div"); controls.className = "quantity-controls";
    const decrease = document.createElement("button"); decrease.type = "button"; decrease.textContent = "−";
    const amount = document.createElement("span"); amount.textContent = item.quantity;
    const increase = document.createElement("button"); increase.type = "button"; increase.textContent = "+";
    const remove = document.createElement("button"); remove.type = "button"; remove.className = "remove"; remove.textContent = "Remove";
    decrease.addEventListener("click", () => changeQuantity(item.id, -1));
    increase.addEventListener("click", () => changeQuantity(item.id, 1));
    remove.addEventListener("click", () => removeItem(item.id));
    controls.append(decrease, amount, increase, remove);
    const total = document.createElement("strong"); total.textContent = money(Number(item.price) * Number(item.quantity));
    row.append(image, info, controls, total); cartItems.append(row);
  });
  const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  subtotal.textContent = `Subtotal ${money(total)}`;
}
function changeQuantity(id, delta) {
  const cart = getCart(); const item = cart.find((entry) => entry.id === id); if (!item) return;
  item.quantity = Math.max(1, Math.min(1000, Number(item.quantity) + delta)); saveCart(cart); renderCart();
}
function removeItem(id) { saveCart(getCart().filter((item) => item.id !== id)); renderCart(); }
document.querySelector("#checkout").addEventListener("click", () => alert("Checkout is not connected yet."));
renderCart();
