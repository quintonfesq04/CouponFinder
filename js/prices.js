// Starter price catalog for the Shopping List price comparison.
//
// IMPORTANT: These are rough, EDITABLE ESTIMATES for comparison purposes only —
// not live pricing. Grocery prices vary by location and change constantly. Click
// any price in the comparison table to correct it to what you've actually seen;
// your correction is saved in this browser and used from then on.
//
// `null` means that store typically doesn't carry that item in a comparable size.

const ITEM_CATALOG = [
  { name: "Milk (1 gal, 2%)", category: "Dairy & Eggs", prices: { "Aldi": 2.79, "Walmart Supercenter": 3.24, "Dollar General": 3.55, "Marc's": 3.29, "Meijer": 3.19, "Target": 3.49, "Giant Eagle": 3.79, "BJ's Wholesale Club": 5.99, "Heinen's": 4.29 } },
  { name: "Eggs (1 dozen, large)", category: "Dairy & Eggs", prices: { "Aldi": 2.49, "Walmart Supercenter": 2.72, "Dollar General": 2.95, "Marc's": 2.79, "Meijer": 2.69, "Target": 2.99, "Giant Eagle": 3.29, "BJ's Wholesale Club": 6.49, "Heinen's": 3.99 } },
  { name: "Butter (1 lb)", category: "Dairy & Eggs", prices: { "Aldi": 3.49, "Walmart Supercenter": 3.98, "Dollar General": 4.25, "Marc's": 3.99, "Meijer": 3.89, "Target": 4.29, "Giant Eagle": 4.79, "BJ's Wholesale Club": 9.99, "Heinen's": 5.49 } },
  { name: "Shredded Cheese (8 oz)", category: "Dairy & Eggs", prices: { "Aldi": 2.29, "Walmart Supercenter": 2.68, "Dollar General": 2.95, "Marc's": 2.79, "Meijer": 2.69, "Target": 2.99, "Giant Eagle": 3.29, "BJ's Wholesale Club": null, "Heinen's": 3.79 } },
  { name: "Greek Yogurt (32 oz tub)", category: "Dairy & Eggs", prices: { "Aldi": 3.99, "Walmart Supercenter": 4.48, "Dollar General": null, "Marc's": 4.49, "Meijer": 4.29, "Target": 4.79, "Giant Eagle": 5.29, "BJ's Wholesale Club": 6.99, "Heinen's": 5.99 } },

  { name: "Bananas (per lb)", category: "Produce", prices: { "Aldi": 0.39, "Walmart Supercenter": 0.54, "Dollar General": null, "Marc's": 0.49, "Meijer": 0.49, "Target": 0.59, "Giant Eagle": 0.69, "BJ's Wholesale Club": 0.44, "Heinen's": 0.79 } },
  { name: "Apples (per lb)", category: "Produce", prices: { "Aldi": 1.29, "Walmart Supercenter": 1.48, "Dollar General": null, "Marc's": 1.49, "Meijer": 1.39, "Target": 1.59, "Giant Eagle": 1.79, "BJ's Wholesale Club": 1.19, "Heinen's": 2.29 } },
  { name: "Potatoes (5 lb bag)", category: "Produce", prices: { "Aldi": 2.99, "Walmart Supercenter": 3.48, "Dollar General": 3.95, "Marc's": 3.49, "Meijer": 3.29, "Target": 3.79, "Giant Eagle": 4.29, "BJ's Wholesale Club": 5.99, "Heinen's": 4.99 } },
  { name: "Onions (per lb)", category: "Produce", prices: { "Aldi": 0.79, "Walmart Supercenter": 0.98, "Dollar General": null, "Marc's": 0.99, "Meijer": 0.89, "Target": 1.09, "Giant Eagle": 1.19, "BJ's Wholesale Club": 0.69, "Heinen's": 1.49 } },
  { name: "Baby Carrots (1 lb)", category: "Produce", prices: { "Aldi": 1.19, "Walmart Supercenter": 1.38, "Dollar General": 1.75, "Marc's": 1.49, "Meijer": 1.29, "Target": 1.59, "Giant Eagle": 1.79, "BJ's Wholesale Club": null, "Heinen's": 2.29 } },

  { name: "Chicken Breast (per lb)", category: "Meat", prices: { "Aldi": 2.79, "Walmart Supercenter": 3.24, "Dollar General": null, "Marc's": 3.29, "Meijer": 3.19, "Target": 3.49, "Giant Eagle": 3.99, "BJ's Wholesale Club": 2.99, "Heinen's": 4.79 } },
  { name: "Ground Beef 80/20 (per lb)", category: "Meat", prices: { "Aldi": 4.29, "Walmart Supercenter": 4.68, "Dollar General": null, "Marc's": 4.79, "Meijer": 4.59, "Target": 4.99, "Giant Eagle": 5.49, "BJ's Wholesale Club": 4.19, "Heinen's": 6.29 } },
  { name: "Bacon (12 oz)", category: "Meat", prices: { "Aldi": 3.99, "Walmart Supercenter": 4.48, "Dollar General": 4.95, "Marc's": 4.49, "Meijer": 4.39, "Target": 4.79, "Giant Eagle": 5.29, "BJ's Wholesale Club": 3.79, "Heinen's": 6.49 } },

  { name: "Bread (loaf, white)", category: "Bakery", prices: { "Aldi": 1.59, "Walmart Supercenter": 1.98, "Dollar General": 2.25, "Marc's": 2.09, "Meijer": 1.89, "Target": 2.19, "Giant Eagle": 2.49, "BJ's Wholesale Club": null, "Heinen's": 3.29 } },
  { name: "Bagels (6 ct)", category: "Bakery", prices: { "Aldi": 2.29, "Walmart Supercenter": 2.68, "Dollar General": 2.95, "Marc's": 2.79, "Meijer": 2.69, "Target": 2.99, "Giant Eagle": 3.29, "BJ's Wholesale Club": null, "Heinen's": 3.99 } },

  { name: "Rice, white (2 lb)", category: "Pantry", prices: { "Aldi": 1.99, "Walmart Supercenter": 2.24, "Dollar General": 2.55, "Marc's": 2.39, "Meijer": 2.29, "Target": 2.49, "Giant Eagle": 2.79, "BJ's Wholesale Club": 6.99, "Heinen's": 3.49 } },
  { name: "Pasta (1 lb box)", category: "Pantry", prices: { "Aldi": 0.99, "Walmart Supercenter": 1.24, "Dollar General": 1.45, "Marc's": 1.29, "Meijer": 1.19, "Target": 1.39, "Giant Eagle": 1.59, "BJ's Wholesale Club": null, "Heinen's": 2.29 } },
  { name: "Pasta Sauce (24 oz jar)", category: "Pantry", prices: { "Aldi": 1.79, "Walmart Supercenter": 2.18, "Dollar General": 2.45, "Marc's": 2.29, "Meijer": 2.19, "Target": 2.39, "Giant Eagle": 2.69, "BJ's Wholesale Club": null, "Heinen's": 3.49 } },
  { name: "Peanut Butter (16 oz)", category: "Pantry", prices: { "Aldi": 2.19, "Walmart Supercenter": 2.58, "Dollar General": 2.85, "Marc's": 2.69, "Meijer": 2.59, "Target": 2.79, "Giant Eagle": 3.09, "BJ's Wholesale Club": 5.99, "Heinen's": 3.99 } },
  { name: "Cereal (family size box)", category: "Pantry", prices: { "Aldi": 2.99, "Walmart Supercenter": 3.98, "Dollar General": 4.25, "Marc's": 3.99, "Meijer": 3.89, "Target": 4.29, "Giant Eagle": 4.79, "BJ's Wholesale Club": 8.99, "Heinen's": 5.99 } },
  { name: "Coffee, ground (12 oz bag)", category: "Pantry", prices: { "Aldi": 4.99, "Walmart Supercenter": 5.98, "Dollar General": 6.45, "Marc's": 5.99, "Meijer": 5.79, "Target": 6.29, "Giant Eagle": 6.99, "BJ's Wholesale Club": 10.99, "Heinen's": 8.49 } },

  { name: "Orange Juice (52 oz)", category: "Beverages", prices: { "Aldi": 2.99, "Walmart Supercenter": 3.48, "Dollar General": null, "Marc's": 3.49, "Meijer": 3.29, "Target": 3.79, "Giant Eagle": 4.19, "BJ's Wholesale Club": null, "Heinen's": 4.99 } },
  { name: "Bottled Water (24-pack)", category: "Beverages", prices: { "Aldi": 3.29, "Walmart Supercenter": 3.98, "Dollar General": 4.25, "Marc's": 4.19, "Meijer": 3.89, "Target": 4.49, "Giant Eagle": 4.99, "BJ's Wholesale Club": 3.49, "Heinen's": 5.99 } },

  { name: "Paper Towels (6 roll)", category: "Household", prices: { "Aldi": null, "Walmart Supercenter": 8.98, "Dollar General": 9.75, "Marc's": 9.49, "Meijer": 8.79, "Target": 9.99, "Giant Eagle": 10.49, "BJ's Wholesale Club": 15.99, "Heinen's": 11.99 } },
  { name: "Toilet Paper (12 roll)", category: "Household", prices: { "Aldi": null, "Walmart Supercenter": 9.98, "Dollar General": 10.75, "Marc's": 10.49, "Meijer": 9.79, "Target": 10.99, "Giant Eagle": 11.49, "BJ's Wholesale Club": 17.99, "Heinen's": 12.99 } },
  { name: "Laundry Detergent (100 oz)", category: "Household", prices: { "Aldi": null, "Walmart Supercenter": 11.98, "Dollar General": 12.75, "Marc's": 12.49, "Meijer": 11.79, "Target": 12.99, "Giant Eagle": 13.49, "BJ's Wholesale Club": 18.99, "Heinen's": 14.99 } },
  { name: "Dish Soap (bottle)", category: "Household", prices: { "Aldi": 1.99, "Walmart Supercenter": 2.48, "Dollar General": 2.75, "Marc's": 2.59, "Meijer": 2.49, "Target": 2.69, "Giant Eagle": 2.99, "BJ's Wholesale Club": null, "Heinen's": 3.79 } },
];

const ITEM_NAMES = ITEM_CATALOG.map((i) => i.name);
