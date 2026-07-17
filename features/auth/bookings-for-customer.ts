import type { Booking } from "@/lib/domain/types";

/** The rows that belong to ONE signed-in customer — matched on account id,
 *  or email for rows created before customer ids existed. Everyone else's
 *  bookings never pass this filter, so each account sees only its own. */
export function bookingsForCustomer(
  bookings: Booking[],
  customer: { id: string; email?: string | null }
): Booking[] {
  return bookings.filter(
    (b) =>
      (b.customerId != null && b.customerId === customer.id) ||
      (b.customerEmail != null && customer.email != null && b.customerEmail === customer.email)
  );
}
