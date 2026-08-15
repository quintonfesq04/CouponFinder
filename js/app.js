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

function renderStores() {
  const query = document.getElementById("store-search").value.trim().toLowerCase();
  const category = document.getElementById("store-category-filter").value;
  const sortBy = document.getElementById("store-sort").value;

  let list = STORES.filter((s) => {
    const matchesQuery = !query || s.name.toLowerCase().includes(query) || s.area.toLowerCase().includes(query);
    const matchesCategory = !category || s.category === category;
    return matchesQuery && matchesCategory;
  });

  list.sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "category") return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    return a.approxMiles - b.approxMiles;
  });

  const container = document.getElementById("store-list");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<div class="empty-state">No stores match your search.</div>`;
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

// ---------- Init ----------
populateCategoryFilter();
populateStoreDatalist();
renderStores();
renderCoupons();
