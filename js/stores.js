// Store directory for the Strongsville, OH area, centered on 19395 Knowlton Pkwy.
// Distances are rough straight-line estimates (approx.) for sorting/reference only —
// use the "Directions" link for accurate, live driving directions.

const HOME_ADDRESS = "19395 Knowlton Pkwy, Strongsville, OH 44136";

const STORES = [
  {
    name: "Target",
    category: "Discount / Big Box",
    area: "SouthPark Mall area",
    approxMiles: 1.0,
    website: "https://www.target.com",
    couponsUrl: "https://www.target.com/circle",
  },
  {
    name: "CVS Pharmacy",
    category: "Pharmacy",
    area: "Royalton Rd corridor",
    approxMiles: 1.0,
    website: "https://www.cvs.com",
    couponsUrl: "https://www.cvs.com/extracare/coupons",
  },
  {
    name: "Walgreens",
    category: "Pharmacy",
    area: "Pearl Rd corridor",
    approxMiles: 1.2,
    website: "https://www.walgreens.com",
    couponsUrl: "https://www.walgreens.com/weeklyad",
  },
  {
    name: "BJ's Wholesale Club",
    category: "Warehouse Club",
    area: "Royalton Rd corridor",
    approxMiles: 1.3,
    website: "https://www.bjs.com",
    couponsUrl: "https://www.bjs.com/coupons",
  },
  {
    name: "Giant Eagle",
    category: "Grocery",
    area: "Royalton Plaza",
    approxMiles: 1.5,
    website: "https://www.gianteagle.com",
    couponsUrl: "https://www.gianteagle.com/savings",
  },
  {
    name: "Kohl's",
    category: "Department Store",
    area: "Pearl Rd corridor",
    approxMiles: 1.5,
    website: "https://www.kohls.com",
    couponsUrl: "https://www.kohls.com/feature/coupons.shtml",
  },
  {
    name: "Marc's",
    category: "Grocery / Discount",
    area: "Pearl Rd corridor",
    approxMiles: 1.8,
    website: "https://www.marcs.com",
    couponsUrl: "https://www.marcs.com",
  },
  {
    name: "Aldi",
    category: "Grocery",
    area: "Pearl Rd corridor",
    approxMiles: 2.0,
    website: "https://www.aldi.us",
    couponsUrl: "https://www.aldi.us/en/weekly-specials/",
  },
  {
    name: "Dollar General",
    category: "Discount",
    area: "Prairie / Rt 42",
    approxMiles: 2.0,
    website: "https://www.dollargeneral.com",
    couponsUrl: "https://www.dollargeneral.com/digital-coupons.html",
  },
  {
    name: "Heinen's",
    category: "Grocery",
    area: "Rt 82 corridor",
    approxMiles: 2.2,
    website: "https://www.heinens.com",
    couponsUrl: "https://www.heinens.com/weekly-ad/",
  },
  {
    name: "Walmart Supercenter",
    category: "Discount / Big Box",
    area: "Rt 82 / Drake Rd",
    approxMiles: 2.5,
    website: "https://www.walmart.com",
    couponsUrl: "https://www.walmart.com/coupons",
  },
  {
    name: "Home Depot",
    category: "Home Improvement",
    area: "Rt 82 corridor",
    approxMiles: 2.8,
    website: "https://www.homedepot.com",
    couponsUrl: "https://www.homedepot.com/c/Promotions",
  },
  {
    name: "Meijer",
    category: "Grocery / Big Box",
    area: "Rt 42 / Medina Rd",
    approxMiles: 3.0,
    website: "https://www.meijer.com",
    couponsUrl: "https://www.meijer.com/savings/mperks.html",
  },
  {
    name: "Lowe's",
    category: "Home Improvement",
    area: "Rt 42 corridor",
    approxMiles: 3.5,
    website: "https://www.lowes.com",
    couponsUrl: "https://www.lowes.com/l/coupons-deals.html",
  },
];

const STORE_NAMES = STORES.map((s) => s.name);
