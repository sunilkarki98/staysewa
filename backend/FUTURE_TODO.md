# StaySewa — Future Improvements

Items deferred from the database audit (2026-02-12). None are blocking — the system is safe and production-ready for single-quantity units.

---

## High Priority (When Scaling)

### Availability Table Integration (H1)
The `availability` table exists in the schema but is unused. Integrate it when you need:
- **Multi-quantity units** — hostels with N beds per dorm
- **Owner date blocking** — maintenance, personal use, holidays
- **Seasonal/dynamic pricing** — `priceOverride` per day

**Work required:**
- [ ] Populate availability rows when a unit is created (rolling 365-day window)
- [ ] Decrement `availableCount` inside the booking transaction
- [ ] Increment on cancellation/expiry
- [ ] Owner calendar management API + frontend UI
- [ ] Wire `priceOverride` into total price calculation
- [ ] Update `StaysService.search()` to filter by availability dates

### Cancellation Refund Gateway Integration (H3)
`transitionStatus` now flags `paymentStatus = 'refunded'` on cancellation, but doesn't trigger the actual Khalti/eSewa refund API call. Wire this up when refund flows are needed.
- [ ] Evaluate `cancellationPolicies` for refund percentage
- [ ] Call payment gateway refund endpoint
- [ ] Record `refundAmount` and `refundReason` on the `payments` row

---

## ✅ Completed (2026-02-12)

- [x] ~~**Soft deletes** — Replace `StaysService.delete()` hard-delete with `status = 'archived'`~~
- [x] ~~**`updatedAt` trigger** — Handled via service layer (`new Date()` on each update)~~
- [x] ~~**Connection pool tuning** — Configured `max: 10`, `idle_timeout: 20`, `max_lifetime: 300` in `db/index.ts`~~
- [x] ~~**`bookingNumber` uniqueness** — Replaced `Date.now() + random` with DB sequence via `nextval()`~~
- [x] ~~**`ON DELETE CASCADE`** — Added to stayUnits, stayMedia, availability, cancellationPolicies, priceRules FKs~~
- [x] ~~Add index on `stayMedia.stayId` and `sessions.token`~~
- [x] ~~Sanitize `%` and `_` in search LIKE queries (`stay.service.ts`)~~
- [x] ~~Add `CHECK` constraints for non-negative `taxes`, `serviceFee`, `discount`~~
