import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { generatePromoCode } from "@/lib/store";

const SEEN_KEY = "triplez-offer-seen-v1";

export function OfferBanner() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sms, setSms] = useState(true);
  const [code, setCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(SEEN_KEY)) return;
    const timer = window.setTimeout(() => setOpen(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(SEEN_KEY, "1");
    setOpen(false);
  };

  const claim = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    const promo = generatePromoCode();
    
    try {
      await api.createLead({
        email: email.trim(),
        smsConsent: sms,
        promoCode: promo,
      });
      setCode(promo);
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-sm animate-slide-in-right border border-border bg-card p-6 shadow-2xl sm:right-6 sm:bottom-6">
      <button
        type="button"
        aria-label="Dismiss offer"
        onClick={dismiss}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>

      {code ? (
        <>
          <p className="text-[0.6rem] tracking-brand text-muted-foreground uppercase">
            Your code is ready
          </p>
          <p className="mt-3 border border-dashed border-primary px-4 py-3 text-center text-lg tracking-widest">
            {code}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Use it at checkout for 15% off your first order.
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="mt-4 w-full bg-primary py-3 text-[0.6rem] tracking-brand text-primary-foreground uppercase"
          >
            Start Shopping
          </button>
        </>
      ) : (
        <>
          <p className="text-[0.6rem] tracking-brand text-muted-foreground uppercase">
            First order offer
          </p>
          <h2 className="mt-2 text-2xl">Take 15% off</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Join the Triple-Z list and we'll send your private discount code instantly.
          </p>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="input-morth mt-4"
          />
          <label className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={sms}
              onChange={(event) => setSms(event.target.checked)}
              className="mt-0.5"
            />
            Also send me drop alerts by SMS.
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => void claim()}
            className="mt-4 w-full bg-primary py-3 text-[0.6rem] tracking-brand text-primary-foreground uppercase disabled:opacity-50"
          >
            {busy ? "Sending…" : "Claim My Code"}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="mt-2 w-full text-[0.6rem] tracking-brand text-muted-foreground uppercase"
          >
            No thanks
          </button>
        </>
      )}
    </div>
  );
}
