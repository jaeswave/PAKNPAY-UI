# paknpay-ui

Frontend for ParkPay. React + Vite + Tailwind (Tailwind is configured but most pages currently use inline styles — see note below).

## Setup

```bash
npm install
# .env already has VITE_API_URL=http://localhost:5000/api — adjust if your backend runs elsewhere
npm run dev
```

## What's new in this version

### 1. Payment testing without Paystack
If the backend has no `PAYSTACK_SECRET_KEY` configured, clicking "Pay Now & Exit" now sends the driver to `/pay/simulate/:token` — a local page styled like a checkout screen, with buttons to simulate a successful or failed payment. This exercises the exact same downstream flow (receipt page, exit countdown timer) as a real Paystack payment, so you can test everything end to end offline.

### 2. "Simulate Car" button on the attendant dashboard
No more needing a second phone or browser tab to test the driver side. The attendant dashboard now has a "🚗 Simulate Car" button that creates a new pending session (as if a driver had just scanned the QR code), which then shows up in the session list like any real arrival — allow entry, mark paid, etc. all work on it normally.

### 3. Platform admin — commission dashboard
New pages: `/admin/login` and `/admin/commissions`. Separate login from attendant/owner (uses the `ADMIN_SECRET` you set on the backend). Shows running totals (today/week/month/all-time) plus a full paginated ledger of every commission-earning transaction across all lots.

### 4. Mobile responsiveness fixes
Several places were overflowing or clipping on small screens:
- Landing page nav bar (buttons no longer get cut off — they wrap)
- Landing page pricing card (padding no longer eats the whole screen width on small phones)
- Owner dashboard header (buttons wrap instead of overflowing) and tabs (horizontally scrollable instead of squeezing)
- Attendant dashboard header (same wrap fix, plus room for the new Simulate Car button)
- Added a global `overflow-x: hidden` safety net so nothing can cause horizontal scroll/jank on mobile going forward

### 5. Removed dead code
`PayPage.jsx` was a stub that immediately redirected back to the session page — nothing in the app actually linked to it (payment is handled directly from the session page). Removed it and its route.

### 6. Signup now works in one step
Matches the new `POST /attendants/signup` backend endpoint — no more 4 separate API calls with a placeholder lot ID in between.

## Note on styling approach
Most pages use inline `style={{ }}` objects rather than Tailwind classes, even though Tailwind is configured in this project. This is functional and the responsiveness fixes applied work fine on top of it (using `clamp()`, `flexWrap`, and percentage widths), but if you want full Tailwind consistency across every page going forward, that would be a larger follow-up rewrite — happy to help with that as a separate pass if useful.

## Testing checklist (updated)

All the original tests still apply — plus:
- [ ] With no `PAYSTACK_SECRET_KEY` set, "Pay Now" leads to `/pay/simulate/:token`, and "Simulate Successful Payment" leads to the receipt page with the exit countdown running
- [ ] "Simulate Car" button on attendant dashboard creates a new pending session without needing a second tab
- [ ] `/admin/login` with your `ADMIN_SECRET` leads to `/admin/commissions`, showing correct running totals after a few simulated payments
- [ ] Resize the browser to ~375px wide (or test on an actual phone) — landing page, owner dashboard, attendant dashboard headers no longer overflow horizontally
