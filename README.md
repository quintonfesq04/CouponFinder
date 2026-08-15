# CouponFinder — Strongsville, OH

A simple, static coupon finder built for the Strongsville, OH area, centered near
19395 Knowlton Pkwy. No AI features, no backend, no accounts — just HTML/CSS/JS.

## Features

- **Nearby Stores** — a directory of Strongsville-area retailers (Giant Eagle, Target,
  Walmart, Marc's, Aldi, BJ's Wholesale Club, Meijer, Heinen's, CVS, Walgreens, Kohl's,
  Home Depot, Lowe's, Dollar General), each with:
  - Approximate distance from home, and category, for sorting/filtering
  - A link to the store's official coupons / weekly ad page
  - A "Directions" link (Google Maps) and a link to the store's website
- **My Coupons** — a personal coupon tracker where you can add coupons you find
  (store, description, code, category, expiration, notes). Coupons are saved in
  your browser's `localStorage` (nothing is sent to a server). Includes search,
  filtering (active / expiring soon / expired / all), and sorting.

## Running it

No build step or install required — it's a static site.

- Open `index.html` directly in a browser, **or**
- Serve it locally:
  ```
  npx serve .
  ```
  then visit the printed local URL.

## Project structure

```
index.html        Page markup, two tabs (Stores / My Coupons)
css/styles.css     Styling
js/stores.js       Store directory data
js/app.js          Rendering, filtering/sorting, and localStorage logic
```

## Notes

- Store distances are rough straight-line estimates for sorting purposes only;
  use the "Directions" link for accurate driving directions.
- Coupon data you add is stored only in your browser (localStorage) — clearing
  site data/browser storage will remove it.
