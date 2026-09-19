import { Link } from "@tanstack/react-router";
import { Instagram, Music2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { CATEGORIES, slugifyCategory } from "@/lib/store";

export function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const subscribe = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    
    try {
      await api.subscribeNewsletter(email.trim());
      toast.success("You're in. Watch your inbox for first access.");
      setEmail("");
    } catch (error: any) {
      if (error.message.includes("already subscribed")) {
        toast.success("You are already on the list.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="text-3xl tracking-brand">Triple-Z</p>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/70">
            Premium Egyptian cotton with the finest materials and exclusive designs. Delivered to all 29
            governorates.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Triple-Z on Instagram"
              className="flex h-10 w-10 items-center justify-center border border-primary-foreground/30 transition-colors hover:bg-primary-foreground hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Triple-Z on TikTok"
              className="flex h-10 w-10 items-center justify-center border border-primary-foreground/30 transition-colors hover:bg-primary-foreground hover:text-primary"
            >
              <Music2 className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-[0.6rem] tracking-brand uppercase">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li>
              <Link to="/products" className="hover:text-primary-foreground">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/new-arrivals" className="hover:text-primary-foreground">
                New Arrivals
              </Link>
            </li>
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  to="/category/$slug"
                  params={{ slug: slugifyCategory(category) }}
                  className="hover:text-primary-foreground"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.6rem] tracking-brand uppercase">Newsletter</p>
          <p className="mt-4 text-sm text-primary-foreground/70">
            Drops, restocks and private sales before anyone else.
          </p>
          <div className="mt-4 flex">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="w-full border border-primary-foreground/30 bg-transparent px-3 py-2.5 text-sm placeholder:text-primary-foreground/40 focus:outline-none"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => void subscribe()}
              className="shrink-0 bg-primary-foreground px-4 text-[0.6rem] tracking-brand text-primary uppercase"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15 px-4 py-6 text-center text-[0.6rem] tracking-brand text-primary-foreground/50 uppercase">
        © {new Date().getFullYear()} Triple-Z · Cairo, Egypt
      </div>
    </footer>
  );
}
