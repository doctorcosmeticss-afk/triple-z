import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Testimonial } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const join = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    
    try {
      await api.subscribeNewsletter(email.trim());
      toast.success("You're on the early access list.");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-secondary py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-[0.6rem] tracking-brand text-muted-foreground uppercase">
          Rated by our community
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl">Worn and reviewed</h2>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <figure key={item.id} className="border border-border bg-card p-6">
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      "h-3.5 w-3.5",
                      index < item.rating ? "fill-primary text-primary" : "text-muted-foreground",
                    )}
                  />
                ))}
              </span>
              <blockquote className="mt-4 text-sm leading-relaxed">"{item.quote}"</blockquote>
              <figcaption className="mt-4 text-[0.6rem] tracking-brand text-muted-foreground uppercase">
                {item.customer_name} · {item.location}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 border border-border bg-card p-8 text-center">
          <h3 className="text-2xl">Get early access to the next drop</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Members shop new pieces 24 hours before release.
          </p>
          <div className="mx-auto mt-5 flex max-w-md gap-2">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="input-morth"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => void join()}
              className="shrink-0 bg-primary px-6 text-[0.6rem] tracking-brand text-primary-foreground uppercase disabled:opacity-50"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
