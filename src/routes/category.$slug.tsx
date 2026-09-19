import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ProductListing } from "@/components/ProductListing";
import { productsQuery } from "@/lib/queries";
import { CATEGORY_COPY, categoryFromSlug } from "@/lib/store";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const category = categoryFromSlug(params.slug) ?? "Collection";
    const title = `${category} — Triple-Z`;
    const description =
      CATEGORY_COPY[category] ?? "Shop the Triple-Z collection with premium Egyptian cotton.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const category = categoryFromSlug(slug);
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

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl">Collection not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          That category does not exist. Browse all products instead.
        </p>
      </div>
    );
  }

  return (
    <ProductListing
      title={category}
      subtitle={CATEGORY_COPY[category]}
      products={products.filter((product) => product.category === category)}
      activeCategory={category}
    />
  );
}
