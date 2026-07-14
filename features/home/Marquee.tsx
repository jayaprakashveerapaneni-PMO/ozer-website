import { ShieldCheck, Mic, Wallet, MapPin, Star, Zap, Languages, BadgeCheck } from "lucide-react";

const items = [
  { icon: ShieldCheck, text: "Police-verified helpers" },
  { icon: Mic, text: "Voice booking · తెలుగు · हिंदी · தமிழ் · English" },
  { icon: Wallet, text: "Pay after service" },
  { icon: Zap, text: "ASAP or 14 days ahead" },
  { icon: MapPin, text: "Live tracking, shareable" },
  { icon: BadgeCheck, text: "Works with Alexa · Siri · Google" },
  { icon: Star, text: "Money-back promise" },
  { icon: Languages, text: "Helper app with voice guidance" },
];

export default function Marquee() {
  const row = (ariaHidden: boolean) => (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={ariaHidden}>
      {items.map((it) => (
        <span key={it.text} className="flex items-center gap-2.5 text-sm font-semibold text-muted">
          <it.icon className="h-4 w-4 text-primary-soft" aria-hidden />
          {it.text}
          <span className="ml-6 h-1 w-1 rounded-full bg-primary/50" aria-hidden />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y border-line bg-surface0 py-4">
      <div className="animate-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" aria-hidden />
    </div>
  );
}
