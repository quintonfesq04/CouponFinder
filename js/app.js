// Strongsville Coupon Finder — vanilla JS, no frameworks, no AI, no external calls.
// Store data comes from js/stores.js. Personal coupons persist in localStorage only.

const COUPONS_KEY = "scf-coupons";

// ---------- Tabs ----------
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  });
});

// ---------- Stores ----------
function directionsUrl(storeName) {
  const origin = encodeURIComponent(HOME_ADDRESS);
  const destination = encodeURIComponent(`${storeName}, Strongsville, OH`);
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
}

function populateCategoryFilter() {
  const select = document.getElementById("store-category-filter");
  const categories = [...new Set(STORES.map((s) => s.category))].sort();
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function populateStoreDatalist() {
  const datalist = document.getElementById("store-options");
  STORE_NAMES.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    datalist.appendChild(opt);
  });
}

function renderStoreDirectory(container) {
  const category = document.getElementById("store-category-filter").value;
  const sortBy = document.getElementById("store-sort").value;

  let list = STORES.filter((s) => !category || s.category === category);

  list.sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "category") return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    return a.approxMiles - b.approxMiles;
  });

  if (list.length === 0) {
    container.innerHTML = `<div class="empty-state">No stores match this filter.</div>`;
    return;
  }

  list.forEach((store) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span class="meta">${store.category}</span>
      <h3>${store.name}</h3>
      <span class="distance">~${store.approxMiles} mi &middot; ${store.area}</span>
      <div class="card-actions">
        <a class="primary" href="${store.couponsUrl}" target="_blank" rel="noopener">Coupons / Weekly Ad</a>
        <a href="${directionsUrl(store.name)}" target="_blank" rel="noopener">Directions</a>
        <a href="${store.website}" target="_blank" rel="noopener">Website</a>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderItemSearchResults(container, query) {
  const category = document.getElementById("store-category-filter").value;
  const item = ITEM_CATALOG.find((i) => i.name.toLowerCase().includes(query.toLowerCase()));

  if (!item) {
    container.innerHTML = `<div class="empty-state">No item matches "${query}". Try milk, eggs, bread, chicken breast, produce, pantry, or household staples &mdash; or clear the search to browse every nearby store.</div>`;
    return;
  }

  const title = document.createElement("h3");
  title.className = "comparison-title";
  title.textContent = `${item.name} - cheapest nearby first`;
  container.appendChild(title);

  let rows = GROCERY_STORE_NAMES
    .map((storeName) => ({ store: STORES.find((s) => s.name === storeName), price: getPrice(item.name, storeName) }))
    .filter((r) => r.price !== null)
    .filter((r) => !category || r.store.category === category);

  rows.sort((a, b) => a.price - b.price);

  if (rows.length === 0) {
    container.innerHTML += `<div class="empty-state">No nearby store has price data for "${item.name}" yet.</div>`;
    return;
  }

  rows.forEach(({ store, price }) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span class="meta">${store.category}</span>
      <h3>${store.name}</h3>
      <span class="distance">~${store.approxMiles} mi &middot; ${store.area}</span>
      <span class="distance"><span class="price-cell" data-store="${store.name}">$${price.toFixed(2)}</span> &middot; ${item.name}</span>
      <div class="card-actions">
        <button type="button" class="add-btn primary" data-store="${store.name}" data-price="${price}">Add to List</button>
        <a href="${directionsUrl(store.name)}" target="_blank" rel="noopener">Directions</a>
        <a href="${store.website}" target="_blank" rel="noopener">Website</a>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll(".price-cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      const store = cell.dataset.store;
      const current = parseFloat(cell.textContent.replace("$", ""));
      const input = document.createElement("input");
      input.type = "number";
      input.step = "0.01";
      input.min = "0";
      input.className = "price-edit";
      input.value = current;
      cell.replaceWith(input);
      input.focus();
      input.select();
      const commit = () => {
        const newPrice = parseFloat(input.value);
        if (!isNaN(newPrice) && newPrice >= 0) {
          setPriceOverride(item.name, store, newPrice);
        }
        renderStores();
      };
      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
        if (e.key === "Escape") renderStores();
      });
    });
  });

  container.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToShoppingList(item.name, btn.dataset.store, parseFloat(btn.dataset.price));
    });
  });
}

function renderStores() {
  const query = document.getElementById("store-search").value.trim();
  const container = document.getElementById("store-list");
  container.innerHTML = "";

  if (query) {
    renderItemSearchResults(container, query);
  } else {
    renderStoreDirectory(container);
  }
}

["store-search", "store-category-filter", "store-sort"].forEach((id) => {
  document.getElementById(id).addEventListener("input", renderStores);
  document.getElementById(id).addEventListener("change", renderStores);
});

// ---------- Coupons ----------
function loadCoupons() {
  try {
    return JSON.parse(localStorage.getItem(COUPONS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCoupons(coupons) {
  localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
}

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

function couponStatus(coupon) {
  const days = daysUntil(coupon.expires);
  if (days < 0) return "expired";
  if (days <= 7) return "expiring";
  return "active";
}

document.getElementById("coupon-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const coupon = {
    id: Date.now().toString(),
    store: form.store.value.trim(),
    title: form.title.value.trim(),
    category: form.category.value,
    code: form.code.value.trim(),
    expires: form.expires.value,
    notes: form.notes.value.trim(),
    addedAt: Date.now(),
  };
  const coupons = loadCoupons();
  coupons.push(coupon);
  saveCoupons(coupons);
  form.reset();
  renderCoupons();
});

function deleteCoupon(id) {
  const coupons = loadCoupons().filter((c) => c.id !== id);
  saveCoupons(coupons);
  renderCoupons();
}

function renderCoupons() {
  const query = document.getElementById("coupon-search").value.trim().toLowerCase();
  const filter = document.getElementById("coupon-filter").value;
  const sortBy = document.getElementById("coupon-sort").value;

  let coupons = loadCoupons();

  coupons = coupons.filter((c) => {
    const status = couponStatus(c);
    const matchesQuery =
      !query ||
      c.store.toLowerCase().includes(query) ||
      c.title.toLowerCase().includes(query) ||
      (c.notes && c.notes.toLowerCase().includes(query));
    const matchesFilter = filter === "all" || status === filter;
    return matchesQuery && matchesFilter;
  });

  coupons.sort((a, b) => {
    if (sortBy === "store") return a.store.localeCompare(b.store);
    if (sortBy === "added") return b.addedAt - a.addedAt;
    return new Date(a.expires) - new Date(b.expires);
  });

  const container = document.getElementById("coupon-list");
  container.innerHTML = "";

  if (coupons.length === 0) {
    container.innerHTML = `<div class="empty-state">No coupons yet. Add one above to start tracking savings.</div>`;
    return;
  }

  coupons.forEach((coupon) => {
    const status = couponStatus(coupon);
    const days = daysUntil(coupon.expires);
    let statusLabel = "Active";
    if (status === "expiring") statusLabel = days === 0 ? "Expires today" : `Expires in ${days}d`;
    if (status === "expired") statusLabel = "Expired";

    const card = document.createElement("div");
    card.className = "card coupon-card";
    card.innerHTML = `
      <span class="badge ${status}">${statusLabel}</span>
      <span class="meta">${coupon.store} &middot; ${coupon.category}</span>
      <h3>${coupon.title}</h3>
      ${coupon.code ? `<span class="coupon-code">${coupon.code}</span>` : ""}
      ${coupon.notes ? `<span class="hint" style="margin:0">${coupon.notes}</span>` : ""}
      <span class="hint" style="margin:0">Expires ${coupon.expires}</span>
      <div class="card-actions">
        <button class="btn-danger" data-id="${coupon.id}">Delete</button>
      </div>
    `;
    card.querySelector(".btn-danger").addEventListener("click", () => deleteCoupon(coupon.id));
    container.appendChild(card);
  });
}

["coupon-search", "coupon-filter", "coupon-sort"].forEach((id) => {
  document.getElementById(id).addEventListener("input", renderCoupons);
  document.getElementById(id).addEventListener("change", renderCoupons);
});

// ---------- Shopping List ----------
const SHOPPING_LIST_KEY = "scf-shopping-list";
const PRICE_OVERRIDES_KEY = "scf-price-overrides";

function populateItemDatalist() {
  const datalist = document.getElementById("item-options");
  ITEM_NAMES.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    datalist.appendChild(opt);
  });
}

function loadOverrides() {
  try {
    return JSON.parse(localStorage.getItem(PRICE_OVERRIDES_KEY)) || {};
  } catch {
    return {};
  }
}

function saveOverrides(overrides) {
  localStorage.setItem(PRICE_OVERRIDES_KEY, JSON.stringify(overrides));
}

function getPrice(itemName, store) {
  const overrides = loadOverrides();
  const key = `${itemName}|${store}`;
  if (Object.prototype.hasOwnProperty.call(overrides, key)) return overrides[key];
  const item = ITEM_CATALOG.find((i) => i.name.toLowerCase() === itemName.toLowerCase());
  return item ? item.prices[store] ?? null : null;
}

function setPriceOverride(itemName, store, price) {
  const overrides = loadOverrides();
  overrides[`${itemName}|${store}`] = price;
  saveOverrides(overrides);
}

function loadShoppingList() {
  try {
    return JSON.parse(localStorage.getItem(SHOPPING_LIST_KEY)) || [];
  } catch {
    return [];
  }
}

function saveShoppingList(list) {
  localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(list));
}

function addToShoppingList(name, store, price) {
  const list = loadShoppingList();
  const existing = list.find((i) => i.name === name && i.store === store);
  if (existing) {
    existing.qty += 1;
  } else {
    list.push({
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      name,
      store: store || "Unassigned",
      price: typeof price === "number" ? price : null,
      qty: 1,
      checked: false,
      addedAt: Date.now(),
    });
  }
  saveShoppingList(list);
  renderShoppingList();
}

function renderPriceComparison(rawName) {
  const container = document.getElementById("price-comparison");
  const name = rawName.trim();
  container.innerHTML = "";
  if (!name) return;

  const item = ITEM_CATALOG.find((i) => i.name.toLowerCase() === name.toLowerCase());

  if (!item) {
    container.innerHTML = `
      <div class="manual-add">
        <span>No price data for "<strong>${name}</strong>" — add it to your list manually:</span>
        <select id="manual-store"></select>
        <input type="number" id="manual-price" step="0.01" min="0" placeholder="Price (optional)" />
        <button type="button" id="manual-add-btn" class="btn-primary">Add to List</button>
      </div>
    `;
    const storeSelect = document.getElementById("manual-store");
    GROCERY_STORE_NAMES.forEach((store) => {
      const opt = document.createElement("option");
      opt.value = store;
      opt.textContent = store;
      storeSelect.appendChild(opt);
    });
    document.getElementById("manual-add-btn").addEventListener("click", () => {
      const store = storeSelect.value;
      const priceVal = document.getElementById("manual-price").value;
      const price = priceVal === "" ? null : parseFloat(priceVal);
      addToShoppingList(name, store, price);
    });
    return;
  }

  const rows = GROCERY_STORE_NAMES
    .map((store) => ({ store, price: getPrice(item.name, store) }))
    .filter((r) => r.price !== null)
    .sort((a, b) => a.price - b.price);

  const lowest = rows.length ? rows[0].price : null;

  const title = document.createElement("h3");
  title.className = "comparison-title";
  title.textContent = `${item.name} — price comparison`;
  container.appendChild(title);

  if (rows.length === 0) {
    container.innerHTML += `<p class="hint">No store price data for this item yet.</p>`;
    return;
  }

  const table = document.createElement("table");
  table.className = "price-table";
  table.innerHTML = `
    <thead><tr><th>Store</th><th>Price</th><th></th></tr></thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");

  rows.forEach(({ store, price }) => {
    const tr = document.createElement("tr");
    if (price === lowest) tr.classList.add("best-price");
    tr.innerHTML = `
      <td>${store}${price === lowest ? " 🏆" : ""}</td>
      <td><span class="price-cell" data-store="${store}">$${price.toFixed(2)}</span></td>
      <td><button type="button" class="add-btn" data-store="${store}" data-price="${price}">Add to List</button></td>
    `;
    tbody.appendChild(tr);
  });

  container.appendChild(table);

  // Editable price cells — click to correct an estimate.
  table.querySelectorAll(".price-cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      const store = cell.dataset.store;
      const current = parseFloat(cell.textContent.replace("$", ""));
      const input = document.createElement("input");
      input.type = "number";
      input.step = "0.01";
      input.min = "0";
      input.className = "price-edit";
      input.value = current;
      cell.replaceWith(input);
      input.focus();
      input.select();
      const commit = () => {
        const newPrice = parseFloat(input.value);
        if (!isNaN(newPrice) && newPrice >= 0) {
          setPriceOverride(item.name, store, newPrice);
        }
        renderPriceComparison(name);
      };
      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
        if (e.key === "Escape") renderPriceComparison(name);
      });
    });
  });

  table.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToShoppingList(item.name, btn.dataset.store, parseFloat(btn.dataset.price));
    });
  });
}

document.getElementById("item-search-btn").addEventListener("click", () => {
  renderPriceComparison(document.getElementById("item-search").value);
});
document.getElementById("item-search").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    renderPriceComparison(document.getElementById("item-search").value);
  }
});

function updateListItem(id, changes) {
  const list = loadShoppingList();
  const entry = list.find((i) => i.id === id);
  if (!entry) return;
  Object.assign(entry, changes);
  saveShoppingList(list);
  renderShoppingList();
}

function removeListItem(id) {
  saveShoppingList(loadShoppingList().filter((i) => i.id !== id));
  renderShoppingList();
}

document.getElementById("clear-list-btn").addEventListener("click", () => {
  if (loadShoppingList().length === 0) return;
  if (confirm("Clear your entire shopping list?")) {
    saveShoppingList([]);
    renderShoppingList();
  }
});

function renderShoppingList() {
  const container = document.getElementById("shopping-list");
  const list = loadShoppingList();
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<div class="empty-state">Your list is empty. Search an item above and add it to a store.</div>`;
    return;
  }

  const byStore = {};
  list.forEach((item) => {
    if (!byStore[item.store]) byStore[item.store] = [];
    byStore[item.store].push(item);
  });

  const storeOrder = [...GROCERY_STORE_NAMES, "Unassigned"].filter((s) => byStore[s]);
  let grandTotal = 0;

  storeOrder.forEach((store) => {
    const items = byStore[store];
    const group = document.createElement("div");
    group.className = "store-group";

    let subtotal = 0;
    const itemsHtml = items
      .map((item) => {
        const lineTotal = item.price !== null ? item.price * item.qty : null;
        if (lineTotal !== null) subtotal += lineTotal;
        return `
          <div class="list-item ${item.checked ? "checked" : ""}" data-id="${item.id}">
            <input type="checkbox" class="check-toggle" ${item.checked ? "checked" : ""} aria-label="Picked up" />
            <span class="item-name">${item.name}</span>
            <div class="qty-controls">
              <button type="button" class="qty-dec" aria-label="Decrease quantity">&minus;</button>
              <span>${item.qty}</span>
              <button type="button" class="qty-inc" aria-label="Increase quantity">+</button>
            </div>
            <span class="item-line-price">${lineTotal !== null ? "$" + lineTotal.toFixed(2) : "—"}</span>
            <button type="button" class="remove-btn" aria-label="Remove item">&times;</button>
          </div>
        `;
      })
      .join("");

    grandTotal += subtotal;

    group.innerHTML = `
      <div class="store-group-header">
        <span>${store}</span>
        <span class="subtotal">$${subtotal.toFixed(2)}</span>
      </div>
      ${itemsHtml}
    `;
    container.appendChild(group);

    items.forEach((item) => {
      const row = group.querySelector(`.list-item[data-id="${item.id}"]`);
      row.querySelector(".check-toggle").addEventListener("change", (e) =>
        updateListItem(item.id, { checked: e.target.checked })
      );
      row.querySelector(".qty-inc").addEventListener("click", () =>
        updateListItem(item.id, { qty: item.qty + 1 })
      );
      row.querySelector(".qty-dec").addEventListener("click", () => {
        if (item.qty <= 1) return removeListItem(item.id);
        updateListItem(item.id, { qty: item.qty - 1 });
      });
      row.querySelector(".remove-btn").addEventListener("click", () => removeListItem(item.id));
    });
  });

  const totalEl = document.createElement("div");
  totalEl.className = "grand-total";
  totalEl.textContent = `Grand total: $${grandTotal.toFixed(2)}`;
  container.appendChild(totalEl);
}

// ---------- Init ----------
populateCategoryFilter();
populateStoreDatalist();
populateItemDatalist();
renderStores();
renderCoupons();
renderShoppingList();
