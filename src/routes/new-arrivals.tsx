import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ProductListing } from "@/components/ProductListing";
import { productsQuery } from "@/lib/queries";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — Triple-Z" },
      {
        name: "description",
        content: "The newest Triple-Z drops: premium cuts with finest materials, released in limited collections.",
      },
      { property: "og:title", content: "New Arrivals — Triple-Z" },
      {
        property: "og:description",
        content: "See what just landed at Triple-Z before it sells out.",
      },
    ],
  }),
  component: NewArrivalsPage,
});

function NewArrivalsPage() {
  const { data: products = [], isLoading } = useQuery(productsQuery);

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-14 sm:gap-5 sm:px-6 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-[3/4] animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <ProductListing
      title="New Arrivals"
      subtitle="Just landed. Limited quantities per size, restocks are never guaranteed."
      products={products.filter((product) => product.is_new)}
    />
  );
}
