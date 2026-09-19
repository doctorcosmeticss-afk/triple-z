import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { formatEGP } from "@/lib/store";

export function CartSheet() {
  const { lines, subtotal, isOpen, closeCart, setQty, remove, count } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? undefined : closeCart())}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-left text-lg tracking-brand uppercase">
            Your Bag ({count})
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <p className="px-4 text-sm text-muted-foreground">Your bag is empty.</p>
        ) : (
          <div className="flex-1 overflow-y-auto px-4">
            <ul className="divide-y divide-border">
              {lines.map((line) => (
                <li key={line.key} className="flex gap-3 py-4">
                  {/* Product Image */}
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border">
                    <img
                      src={line.image || "/north.png"}
                      alt={line.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/north.png";
                      }}
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex flex-1 flex-col">
                    <Link
                      to="/product/$slug"
                      params={{ slug: line.slug }}
                      onClick={closeCart}
                      className="text-sm font-medium hover:underline"
                    >
                      {line.name}
                    </Link>
                    <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                      <p><span className="font-medium">Size:</span> {line.size}</p>
                      <p><span className="font-medium">Color:</span> {line.color}</p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="mt-auto flex items-center gap-3 pt-2">
                      <div className="flex items-center border border-border rounded">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(line.key, line.qty - 1)}
                          className="px-2 py-1 hover:bg-accent"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{line.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQty(line.key, line.qty + 1)}
                          className="px-2 py-1 hover:bg-accent"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => remove(line.key)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <span className="text-sm font-semibold">{formatEGP(line.price * line.qty)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-border p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatEGP(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Shipping is calculated at checkout by governorate.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/checkout"
              onClick={closeCart}
              className="bg-primary py-3.5 text-center text-[0.65rem] tracking-brand text-primary-foreground uppercase"
            >
              Checkout
            </Link>
            <Link
              to="/cart"
              onClick={closeCart}
              className="border border-primary py-3.5 text-center text-[0.65rem] tracking-brand uppercase hover:bg-primary hover:text-primary-foreground"
            >
              View Bag
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
