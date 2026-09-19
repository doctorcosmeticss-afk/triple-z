import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/lib/cart";
import { CATEGORIES, slugifyCategory } from "@/lib/store";

const NAV_LINKS = [
  { label: "Home", to: "/" as const },
  { label: "New Arrivals", to: "/new-arrivals" as const },
  { label: "Products", to: "/products" as const },
];

export function Navbar() {
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="p-1 text-white transition-opacity hover:opacity-70"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[0.65rem] tracking-brand text-white/80 uppercase transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link to="/" aria-label="Triple-Z home" className="absolute left-1/2 -translate-x-1/2">
          <img 
            src="/north.png" 
            alt="Triple-Z Logo" 
            className="h-12 w-12 object-contain animate-oscillate"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/newsletter"
            aria-label="Newsletter"
            className="p-1 text-white transition-opacity hover:opacity-70"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            type="button"
            aria-label="Open cart"
            onClick={openCart}
            className="relative p-1 text-white transition-opacity hover:opacity-70"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[0.6rem] font-medium text-black">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/10 bg-black px-4 pt-4 pb-6 sm:px-6">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-[0.7rem] tracking-brand text-white/85 uppercase"
              >
                {link.label}
              </Link>
            ))}
            <span className="pt-2 text-[0.6rem] tracking-brand text-white/40 uppercase">
              Categories
            </span>
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to="/category/$slug"
                params={{ slug: slugifyCategory(category) }}
                onClick={() => setMenuOpen(false)}
                className="text-[0.7rem] tracking-brand text-white/85 uppercase"
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
