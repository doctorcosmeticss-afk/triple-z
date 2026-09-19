import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { ProductCard } from "./ProductCard";
import { CATEGORIES, slugifyCategory, type Product } from "@/lib/store";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
];

export function ProductListing({
  title,
  subtitle,
  products,
  activeCategory,
  showChips = true,
}: {
  title: string;
  subtitle?: string | undefined;
  products: Product[];
  activeCategory?: string | undefined;
  showChips?: boolean | undefined;
}) {
  const [sort, setSort] = useState<SortKey>("featured");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);

  const visible = useMemo(() => {
    let list = [...products];
    if (onlyInStock) list = list.filter((p) => !p.sold_out);
    if (onlyDiscounted) list = list.filter((p) => p.old_price !== null);
    if (sort === "price-asc") list.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") list.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "newest")
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (sort === "featured")
      list.sort((a, b) => Number(b.is_best_seller) - Number(a.is_best_seller));
    return list;
  }, [products, sort, onlyInStock, onlyDiscounted]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-5xl">{title}</h1>
        {subtitle ? (
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </header>

      {showChips ? (
        <div className="-mx-4 mb-6 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <div className="flex w-max items-center gap-2">
            <Link
              to="/products"
              className={cn(
                "border border-border px-4 py-2 text-[0.62rem] tracking-brand uppercase transition-colors hover:bg-primary hover:text-primary-foreground",
                !activeCategory && "bg-primary text-primary-foreground",
              )}
            >
              All
            </Link>
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to="/category/$slug"
                params={{ slug: slugifyCategory(category) }}
                className={cn(
                  "border border-border px-4 py-2 text-[0.62rem] tracking-brand uppercase transition-colors hover:bg-primary hover:text-primary-foreground",
                  activeCategory === category && "bg-primary text-primary-foreground",
                )}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-border py-3">
        <p className="text-[0.65rem] tracking-brand text-muted-foreground uppercase">
          {visible.length} {visible.length === 1 ? "Piece" : "Pieces"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyInStock((v) => !v)}
            className={cn(
              "border border-border px-3 py-1.5 text-[0.6rem] tracking-brand uppercase",
              onlyInStock && "bg-primary text-primary-foreground",
            )}
          >
            In Stock
          </button>
          <button
            type="button"
            onClick={() => setOnlyDiscounted((v) => !v)}
            className={cn(
              "border border-border px-3 py-1.5 text-[0.6rem] tracking-brand uppercase",
              onlyDiscounted && "bg-primary text-primary-foreground",
            )}
          >
            On Offer
          </button>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            aria-label="Sort products"
            className="border border-border bg-card px-3 py-1.5 text-[0.6rem] tracking-brand uppercase"
          >
            {SORTS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No pieces match these filters yet.
        </p>
      ) : null}
    </section>
  );
}
