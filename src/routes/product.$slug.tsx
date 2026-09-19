import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, Minus, Plus, Ruler, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ProductCard } from "@/components/ProductCard";
import { ProductPlaceholder } from "@/components/ProductPlaceholder";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/lib/cart";
import { productsQuery } from "@/lib/queries";
import { formatEGP } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const readable = params.slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    const title = `${readable} — Triple-Z`;
    const description = `${readable} by Triple-Z. Premium Egyptian cotton with finest materials, delivered across all 29 Egyptian governorates.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { data: products = [], isLoading } = useQuery(productsQuery);

  const product = useMemo(() => products.find((item) => item.slug === slug), [products, slug]);
  const related = useMemo(
    () =>
      products.filter((item) => item.category === product?.category && item.slug !== slug).slice(0, 4),
    [products, product, slug],
  );

  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div className="aspect-[3/4] animate-pulse bg-muted" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse bg-muted" />
          <div className="h-4 w-1/3 animate-pulse bg-muted" />
          <div className="h-24 animate-pulse bg-muted" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl">Piece not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This product is no longer available.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block border border-primary px-6 py-3 text-[0.65rem] tracking-brand uppercase hover:bg-primary hover:text-primary-foreground"
        >
          Browse all products
        </Link>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : ["tone-1"];
  const selectedSize = size ?? product.sizes[0] ?? "M";
  const selectedColor = color ?? product.colors[0]?.name ?? "Black";

  const addToCart = () => {
    add(product, { size: selectedSize, color: selectedColor, qty });
    toast.success("Added to your bag", {
      description: `${product.name} · ${selectedSize} · ${selectedColor}`,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-6 flex items-center gap-2 text-[0.6rem] tracking-brand text-muted-foreground uppercase">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-foreground">
          Products
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-3">
          <div className="relative aspect-[3/4] overflow-hidden border border-border">
            <img
              src={images[imageIndex]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-primary px-2 py-1 text-[0.6rem] tracking-brand text-primary-foreground uppercase">
              10% Off
            </span>
          </div>
          {images.length > 1 ? (
            <div className="flex gap-3">
              {images.map((imageUrl, index) => (
                <button
                  key={imageUrl + index}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className={cn(
                    "h-20 w-16 overflow-hidden border",
                    index === imageIndex ? "border-primary" : "border-border",
                  )}
                >
                  <img
                    src={imageUrl}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-[0.6rem] tracking-brand text-muted-foreground uppercase">
            {product.brand}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2">
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    "h-3.5 w-3.5",
                    index < Math.round(Number(product.rating))
                      ? "fill-primary text-primary"
                      : "text-muted-foreground",
                  )}
                />
              ))}
            </span>
            <span className="text-xs text-muted-foreground">{Number(product.rating)} / 5</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl">{formatEGP(Number(product.price))}</span>
            {product.old_price ? (
              <span className="text-sm text-muted-foreground line-through">
                {formatEGP(Number(product.old_price))}
              </span>
            ) : null}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[0.6rem] tracking-brand uppercase">Size</span>
              <button
                type="button"
                onClick={() => setSizeChartOpen(true)}
                className="flex items-center gap-1.5 text-[0.6rem] tracking-brand text-muted-foreground uppercase hover:text-foreground"
              >
                <Ruler className="h-3.5 w-3.5" /> Size Chart
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSize(option)}
                  className={cn(
                    "min-w-12 border border-border px-3 py-2 text-xs tracking-widest uppercase",
                    selectedSize === option && "bg-primary text-primary-foreground",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {product.colors.length > 0 ? (
            <div className="mt-6">
              <span className="text-[0.6rem] tracking-brand uppercase">
                Color — {selectedColor}
              </span>
              <div className="mt-2 flex gap-2">
                {product.colors.map((swatch) => (
                  <button
                    key={swatch.name}
                    type="button"
                    aria-label={swatch.name}
                    onClick={() => setColor(swatch.name)}
                    className={cn(
                      "h-7 w-7 rounded-full border border-black/20",
                      selectedColor === swatch.name &&
                        "ring-1 ring-primary ring-offset-2 ring-offset-background",
                    )}
                    style={{ backgroundColor: swatch.hex }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex items-center gap-4">
            <span className="text-[0.6rem] tracking-brand uppercase">Quantity</span>
            <div className="flex items-center border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((value) => Math.max(1, value - 1))}
                className="px-3 py-2"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((value) => value + 1)}
                className="px-3 py-2"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3">
            <button
              type="button"
              disabled={product.sold_out}
              onClick={addToCart}
              className="w-full bg-primary py-4 text-[0.65rem] tracking-brand text-primary-foreground uppercase transition-opacity hover:opacity-85 disabled:opacity-40"
            >
              {product.sold_out ? "Sold Out" : "Add to Bag"}
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={product.sold_out}
                onClick={() => {
                  add(product, { size: selectedSize, color: selectedColor, qty });
                  void navigate({ to: "/checkout" });
                }}
                className="flex-1 border border-primary py-4 text-[0.65rem] tracking-brand uppercase transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
              >
                Buy It Now
              </button>
              <button
                type="button"
                aria-label="Add to wishlist"
                onClick={() => toast.success("Saved to your wishlist")}
                className="flex w-14 items-center justify-center border border-border transition-colors hover:bg-accent"
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Accordion type="single" collapsible className="mt-9">
            <AccordionItem value="details">
              <AccordionTrigger className="text-[0.65rem] tracking-brand uppercase">
                Product Details
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {product.details}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-[0.65rem] tracking-brand uppercase">
                Shipping
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Delivery across all 29 Egyptian governorates in 2 to 5 working days. Shipping is
                calculated at checkout from your governorate.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger className="text-[0.65rem] tracking-brand uppercase">
                Returns &amp; Exchanges
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Exchanges accepted within 14 days on unworn pieces with tags attached.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl sm:text-3xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      <Dialog open={sizeChartOpen} onOpenChange={setSizeChartOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Size Chart</DialogTitle>
          </DialogHeader>
          <div className="flex h-56 items-center justify-center border border-dashed border-border text-[0.6rem] tracking-brand text-muted-foreground uppercase">
            Size chart placeholder
          </div>
          <p className="text-xs text-muted-foreground">
            Measurements are added per collection. If you are between sizes, take the larger size
            for the premium Triple-Z fit.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
