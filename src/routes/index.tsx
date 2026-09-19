import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductRail } from "@/components/ProductRail";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { NewsSection } from "@/components/NewsSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { productsQuery } from "@/lib/queries";
import { CATEGORIES, slugifyCategory } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Triple-Z — Premium Egyptian Fashion" },
      {
        name: "description",
        content:
          "Triple-Z creates premium cotton T-shirts, hoodies, zippers and pants with the finest materials and designs, delivered across all 29 Egyptian governorates.",
      },
      { property: "og:title", content: "Triple-Z — Premium Egyptian Fashion" },
      {
        property: "og:description",
        content: "Limited-run heavyweight essentials, made and shipped from Cairo.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products = [] } = useQuery(productsQuery);

  const newArrivals = products.filter((product) => product.is_new);
  const bestSellers = products.filter((product) => product.is_best_seller);

  return (
    <div>
      <HeroCarousel />

      <nav className="sticky top-16 z-30 border-y border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          <Link
            to="/products"
            className="shrink-0 border border-border px-4 py-2 text-[0.6rem] tracking-brand uppercase hover:bg-primary hover:text-primary-foreground"
          >
            All
          </Link>
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              to="/category/$slug"
              params={{ slug: slugifyCategory(category) }}
              className="shrink-0 border border-border px-4 py-2 text-[0.6rem] tracking-brand uppercase hover:bg-primary hover:text-primary-foreground"
            >
              {category}
            </Link>
          ))}
        </div>
      </nav>

      <ProductRail
        title="New Arrivals"
        subtitle="Just landed"
        products={newArrivals.length > 0 ? newArrivals : products}
        direction="left"
        viewAllTo="/new-arrivals"
      />

      <ProductRail
        title="Best Sellers"
        subtitle="Community favourites"
        products={bestSellers.length > 0 ? bestSellers : products}
        direction="right"
        viewAllTo="/products"
      />

      <CategoryShowcase />

      <NewsSection />

      <ReviewsSection />

      <NewsletterSection />
    </div>
  );
}
