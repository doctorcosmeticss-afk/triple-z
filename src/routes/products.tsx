import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ProductListing } from "@/components/ProductListing";
import { productsQuery } from "@/lib/queries";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "All Products — Triple-Z" },
      {
        name: "description",
        content:
          "Shop the full Triple-Z collection: premium tees, tailored pants, luxury hoodies and zip layers.",
      },
      { property: "og:title", content: "All Products — Triple-Z" },
      {
        property: "og:description",
        content: "Browse every Triple-Z piece with filtering, sorting and fast delivery across Egypt.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { data: products = [], isLoading } = useQuery(productsQuery);

  if (isLoading) return <ListingSkeleton />;

  return (
    <ProductListing
      title="All Products"
      subtitle="Every Triple-Z piece, made with the finest materials and exclusive designs."
      products={products}
    />
  );
}

function ListingSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-14 sm:gap-5 sm:px-6 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="aspect-[3/4] animate-pulse bg-muted" />
      ))}
    </div>
  );
}
