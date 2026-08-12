const STORAGE_KEY = "avion-products";
const CART_KEY = "avion-cart";

const grid = document.querySelector("#productGrid");
const status = document.querySelector("#status");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const sortPrice = document.querySelector("#sortPrice");
const details = document.querySelector("#details");
const cartCount = document.querySelector("#cartCount");
const showMore = document.querySelector("#showMore");
const dialog = document.querySelector("#productDialog");
const form = document.querySelector("#productForm");
const formError = document.querySelector("#formError");
const productCategory = document.querySelector("#productCategory");

let products = [];
let visibleLimit = 6;

function productId(product, index) {
  return product.id || `${product.title}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

async function loadProducts() {
  const saved = readStorage(STORAGE_KEY, null);
  if (Array.isArray(saved)) return saved;

  const response = await fetch("./js/data.json");
  if (!response.ok) throw new Error("Could not load product data.");
  const groups = await response.json();
  return groups.flatMap((group) => group.items).map((product, index) => ({ ...product, id: productId(product, index), price: Number(product.price) }));
}

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function getCart() {
  const cart = readStorage(CART_KEY, []);
  return Array.isArray(cart)
    ? cart.map((item, index) => ({
        ...item,
        id: item.id || productId(item, index),
        image: item.image || item["img-src"] || "",
        quantity: Math.max(1, Number(item.quantity) || 1),
      }))
    : [];
}

function updateCartCount() {
  cartCount.textContent = getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function categories() {
  return [...new Set(products.map((product) => product.category).filter(Boolean))].sort();
}

function populateCategories() {
  const selectedFilter = categoryFilter.value;
  categoryFilter.replaceChildren(new Option("All categories", "all"));
  productCategory.replaceChildren();
  categories().forEach((category) => {
    categoryFilter.add(new Option(category, category));
    productCategory.add(new Option(category, category));
  });
  categoryFilter.value = [...categoryFilter.options].some((option) => option.value === selectedFilter) ? selectedFilter : "all";
}

function visibleProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const result = products.filter((product) =>
    (category === "all" || product.category === category) &&
    `${product.title} ${product.description}`.toLowerCase().includes(query)
  );
  if (sortPrice.value === "asc") result.sort((a, b) => Number(a.price) - Number(b.price));
  if (sortPrice.value === "desc") result.sort((a, b) => Number(b.price) - Number(a.price));
  return result;
}

function renderProducts() {
  const result = visibleProducts();
  grid.replaceChildren();
  status.textContent = result.length ? `Showing ${Math.min(visibleLimit, result.length)} of ${result.length} product${result.length === 1 ? "" : "s"}` : "No products match your search.";
  result.slice(0, visibleLimit).forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    const image = document.createElement("img");
    image.src = product["img-src"];
    image.alt = product.title;
    image.loading = "lazy";
    image.addEventListener("error", () => { image.alt = `Image unavailable for ${product.title}`; });
    const title = document.createElement("h2");
    title.textContent = product.title;
    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatPrice(product.price);
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const detailsButton = document.createElement("button");
    detailsButton.type = "button";
    detailsButton.className = "secondary";
    detailsButton.textContent = "View details";
    detailsButton.addEventListener("click", () => showDetails(product.id));
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = "Add to cart";
    addButton.addEventListener("click", () => addToCart(product, 1));
    actions.append(detailsButton, addButton);
    card.append(image, title, price, actions);
    grid.append(card);
  });
  showMore.hidden = result.length <= visibleLimit;
  showMore.textContent = `Show 6 more (${result.length - visibleLimit} remaining)`;
}

function showDetails(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  details.hidden = false;
  details.replaceChildren();
  const image = document.createElement("img");
  image.src = product["img-src"];
  image.alt = product.title;
  const content = document.createElement("div");
  const title = document.createElement("h2"); title.textContent = product.title;
  const price = document.createElement("p"); price.className = "price"; price.textContent = formatPrice(product.price);
  const description = document.createElement("p"); description.textContent = product.description;
  const quantityLabel = document.createElement("label"); quantityLabel.textContent = "Quantity";
  const quantity = document.createElement("input"); quantity.type = "number"; quantity.min = "1"; quantity.max = "1000"; quantity.value = "1";
  const add = document.createElement("button"); add.type = "button"; add.textContent = "Add to cart";
  add.addEventListener("click", () => addToCart(product, Number(quantity.value)));
  const edit = document.createElement("button"); edit.type = "button"; edit.className = "secondary"; edit.textContent = "Edit product";
  edit.addEventListener("click", () => openForm(product));
  quantityLabel.htmlFor = "detailQuantity"; quantity.id = "detailQuantity";
  content.append(title, price, description, quantityLabel, quantity, add, edit);
  details.append(image, content);
  details.scrollIntoView({ behavior: "smooth", block: "start" });
}

function addToCart(product, quantity) {
  const safeQuantity = Math.min(1000, Math.max(1, Number.isFinite(quantity) ? Math.floor(quantity) : 1));
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) existing.quantity = Math.min(1000, Number(existing.quantity) + safeQuantity);
  else cart.push({ id: product.id, title: product.title, price: Number(product.price), description: product.description, image: product["img-src"], quantity: safeQuantity });
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  status.textContent = `${product.title} was added to your cart.`;
}

function openForm(product = null) {
  form.reset(); formError.textContent = "";
  document.querySelector("#dialogTitle").textContent = product ? "Edit product" : "Add product";
  document.querySelector("#productId").value = product?.id ?? "";
  document.querySelector("#productImage").value = product?.["img-src"] ?? "";
  document.querySelector("#productTitle").value = product?.title ?? "";
  document.querySelector("#productPrice").value = product?.price ?? "";
  productCategory.value = product?.category ?? categories()[0] ?? "";
  document.querySelector("#productDescription").value = product?.description ?? "";
  dialog.showModal();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const id = document.querySelector("#productId").value;
  const item = {
    id: id || `product-${Date.now()}`,
    "img-src": document.querySelector("#productImage").value.trim(),
    title: document.querySelector("#productTitle").value.trim(),
    price: Number(document.querySelector("#productPrice").value),
    category: productCategory.value,
    description: document.querySelector("#productDescription").value.trim(),
  };
  if (!item.title || !item.description || !item.category || !Number.isFinite(item.price) || item.price <= 0) { formError.textContent = "Please enter valid product details."; return; }
  const index = products.findIndex((product) => product.id === id);
  if (index >= 0) products[index] = item; else products.push(item);
  saveProducts(); populateCategories(); renderProducts(); dialog.close();
  if (index >= 0) showDetails(item.id);
});

document.querySelector("#openAddForm").addEventListener("click", () => openForm());
document.querySelector("#closeDialog").addEventListener("click", () => dialog.close());
document.querySelector("#cancelDialog").addEventListener("click", () => dialog.close());
showMore.addEventListener("click", () => { visibleLimit += 6; renderProducts(); });
[searchInput, categoryFilter, sortPrice].forEach((element) => element.addEventListener("input", () => { visibleLimit = 6; renderProducts(); }));

(async () => {
  try {
    products = await loadProducts();
    products = products.map((product, index) => ({ ...product, id: productId(product, index), price: Number(product.price) }));
    saveProducts();
    populateCategories(); renderProducts(); updateCartCount();
  } catch (error) {
    status.textContent = "Products could not be loaded. Please run the project through a local web server and try again.";
    console.error(error);
  }
})();
