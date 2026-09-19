import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductRail({
  title,
  subtitle,
  products,
  direction = "left",
  viewAllTo,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  direction?: "left" | "right";
  viewAllTo: "/products" | "/new-arrivals";
}) {
  const [active, setActive] = useState(0);
  if (products.length === 0) return null;

  const loop = [...products, ...products];

  return (
    <section className="overflow-hidden py-16">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 sm:px-6">
        <div>
          <p className="text-[0.6rem] tracking-brand text-muted-foreground uppercase">{subtitle}</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">{title}</h2>
        </div>
        <Link
          to={viewAllTo}
          className="border-b border-primary pb-1 text-[0.6rem] tracking-brand uppercase"
        >
          View All
        </Link>
      </div>

      <div className="pause-on-hover mt-8">
        <div
          className={cn(
            "marquee-track flex w-max gap-4 px-4 sm:gap-5 sm:px-6",
            direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
          )}
        >
          {loop.map((product, index) => (
            <div key={`${product.id}-${index}`} className="w-[46vw] max-w-[300px] shrink-0 sm:w-64">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {products.slice(0, Math.min(products.length, 6)).map((product, index) => (
          <button
            key={product.id}
            type="button"
            aria-label={`Highlight ${product.name}`}
            onClick={() => setActive(index)}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors",
              index === active ? "bg-primary" : "bg-border",
            )}
          />
        ))}
      </div>
    </section>
  );
}
