import { CheckCircle2 } from "lucide-react";
import { serviceChecklist, type Booking } from "@/lib/domain";

/** Post-completion summary: who did the job, what it covered, and the
 *  settlement note. Shared by the booking screen and the account panel. */
export default function CompletedCard({ booking }: { booking: Booking }) {
  return (
    <div className="animate-fade-up motion-reduce:animate-none mt-6 rounded-2xl bg-success/10 p-5 text-left">
      <p className="flex items-center gap-2 text-sm font-bold text-success">
        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
        Job completed{booking.helperName ? ` by ${booking.helperName}` : ""}
      </p>
      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-foreground/80" aria-label="What this job covered">
        {serviceChecklist(booking.service).map((task) => (
          <li key={task} className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
            {task}
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-success/20 pt-3 text-xs text-muted">
        {booking.amountPaid != null
          ? `₹${booking.amountPaid.toLocaleString("en-IN")} was settled at booking — nothing more to pay.`
          : "Payment was settled at booking — nothing more to pay."}
        {booking.helperName ? ` Rate ${booking.helperName} to save them as a favourite.` : ""}
      </p>
    </div>
  );
}
