import { Link } from "@tanstack/react-router";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ProductPlaceholder } from "./ProductPlaceholder";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { formatEGP, type Product } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { add } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const images = product.images.length > 0 ? product.images : ["tone-1"];
  const cardRef = useRef<HTMLElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left - next image
      setImageIndex((prev) => (prev + 1) % images.length);
    }
    if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right - previous image
      setImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleAddToCart = () => {
    add(product, { color, size }, quantity);
    setIsModalOpen(false);
    setQuantity(1);
  };

  return (
    <>
      <article
        ref={cardRef}
        className={cn(
          "group relative flex flex-col border border-border/70 bg-card transition-shadow duration-500 hover:shadow-[0_18px_50px_-30px_rgba(0,0,0,0.55)]",
          className,
        )}
      >
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="relative block aspect-[3/4] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]">
            <img
              src={images[imageIndex]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <span className="absolute top-3 left-3 bg-primary px-2 py-1 text-[0.6rem] tracking-brand text-primary-foreground uppercase">
            10% Off
          </span>

          {product.sold_out ? (
            <span className="absolute inset-x-0 bottom-0 bg-primary/85 py-2 text-center text-[0.6rem] tracking-brand text-primary-foreground uppercase">
              Sold Out
            </span>
          ) : null}

          {/* Cart Icon - Bottom Right on Image */}
          <button
            type="button"
            disabled={product.sold_out}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="absolute bottom-3 right-3 p-2 text-white transition-opacity hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-5 w-5 drop-shadow-lg" />
          </button>
        </Link>

        <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
          {/* Image Dots - Bottom Left */}
          {images.length > 1 ? (
            <div className="flex gap-1.5 mb-2">
              {images.map((tone, index) => (
                <button
                  key={tone + index}
                  type="button"
                  aria-label={`View image ${index + 1}`}
                  onClick={() => setImageIndex(index)}
                  className={cn(
                    "rounded-full bg-black/25 transition-all",
                    index === imageIndex ? "h-2 w-6" : "h-1.5 w-1.5",
                  )}
                />
              ))}
            </div>
          ) : null}

          <p className="text-[0.6rem] tracking-brand text-muted-foreground uppercase">
            {product.brand}
          </p>
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="text-sm leading-snug hover:underline sm:text-base"
          >
            {product.name}
          </Link>

          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium">{formatEGP(Number(product.price))}</span>
            {product.old_price ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatEGP(Number(product.old_price))}
              </span>
            ) : null}
          </div>

          {product.colors.length > 0 ? (
            <div className="flex items-center gap-1.5 pt-1">
              {product.colors.map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  title={swatch.name}
                  aria-label={swatch.name}
                  onClick={() => setColor(swatch.name)}
                  className={cn(
                    "h-4 w-4 rounded-full border border-black/20 transition-transform",
                    color === swatch.name && "ring-1 ring-primary ring-offset-2 ring-offset-card",
                  )}
                  style={{ backgroundColor: swatch.hex }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </article>

      {/* Add to Cart Sheet */}
      <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {/* Header */}
          <div className="border-b border-border pb-4 mb-6">
            <p className="text-[0.6rem] tracking-brand text-muted-foreground uppercase mb-2">
              Quick Order
            </p>
            <h3 className="font-display text-xl font-light">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>
          </div>
          
          {/* Product Preview */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="w-full h-64 border border-border/50 overflow-hidden bg-secondary">
              {images[0] && images[0].startsWith('tone-') ? (
                <ProductPlaceholder tone={images[0]} label={product.category} />
              ) : (
                <img 
                  src={images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="w-full h-full"><div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"><span class="text-gray-400 text-sm">Triple-Z</span></div></div>';
                  }}
                />
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-medium">{formatEGP(Number(product.price))}</span>
              {product.old_price ? (
                <span className="text-sm text-muted-foreground line-through">
                  {formatEGP(Number(product.old_price))}
                </span>
              ) : null}
            </div>

            {/* Size Selection */}
            <div>
              <label className="text-[0.6rem] tracking-brand text-muted-foreground uppercase mb-3 block">
                Size
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      "px-4 py-2 border text-sm font-medium transition-all",
                      size === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 ? (
              <div>
                <label className="text-[0.6rem] tracking-brand text-muted-foreground uppercase mb-3 block">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((swatch) => (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => setColor(swatch.name)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 border text-sm transition-all",
                        color === swatch.name
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary"
                      )}
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-black/20"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      {swatch.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Quantity */}
            <div>
              <label className="text-[0.6rem] tracking-brand text-muted-foreground uppercase mb-3 block">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-border hover:border-primary transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-medium min-w-[3rem] text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="p-2 border border-border hover:border-primary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-primary text-primary-foreground py-4 text-[0.6rem] tracking-brand uppercase font-medium transition-all hover:bg-primary/90 flex items-center justify-center gap-2 mt-8"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart — {formatEGP(Number(product.price) * quantity)}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
