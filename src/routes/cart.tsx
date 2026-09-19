import { Link, createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/lib/cart";
import { formatEGP } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Triple-Z" },
      {
        name: "description",
        content:
          "Review your Triple-Z bag, adjust sizes and quantities, and see shipping for your Egyptian governorate.",
      },
      { property: "og:title", content: "Your Bag — Triple-Z" },
      { property: "og:description", content: "Review your Triple-Z bag and continue to checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotal, setQty, remove, count } = useCart();
  const [governorate, setGovernorate] = useState("");

  const GOVERNORATES = [
    { name: "Cairo", cost: 50 },
    { name: "Giza", cost: 50 },
    { name: "Alexandria", cost: 70 },
    { name: "Qalyubia", cost: 60 },
    { name: "Sharqia", cost: 70 },
    { name: "Dakahlia", cost: 80 },
    { name: "Beheira", cost: 80 },
    { name: "Gharbia", cost: 80 },
    { name: "Monufia", cost: 70 },
    { name: "Kafr El Sheikh", cost: 90 },
    { name: "Damietta", cost: 90 },
    { name: "Port Said", cost: 90 },
    { name: "Ismailia", cost: 80 },
    { name: "Suez", cost: 80 },
    { name: "Other", cost: 100 },
  ];

  const shipping = GOVERNORATES.find((item) => item.name === governorate)?.cost ?? 0;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl sm:text-5xl">
        Your Bag{" "}
        <span className="align-super text-base text-muted-foreground">
          {count > 0 ? `(${count})` : ""}
        </span>
      </h1>

      {lines.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-muted-foreground">Your bag is empty.</p>
          <Link
            to="/products"
            className="mt-6 inline-block border border-primary px-6 py-3 text-[0.65rem] tracking-brand uppercase hover:bg-primary hover:text-primary-foreground"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-border border-y border-border">
            {lines.map((line) => (
              <li key={line.key} className="flex gap-4 py-5">
                {/* Product Image */}
                <Link
                  to="/product/$slug"
                  params={{ slug: line.slug }}
                  className="h-32 w-32 shrink-0 overflow-hidden rounded-lg border border-border"
                >
                  <img
                    src={line.image || "/north.png"}
                    alt={line.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/north.png";
                    }}
                  />
                </Link>
                
                {/* Product Details */}
                <div className="flex flex-1 flex-col">
                  <Link
                    to="/product/$slug"
                    params={{ slug: line.slug}}
                    className="text-base font-medium hover:underline"
                  >
                    {line.name}
                  </Link>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p><span className="font-medium">Size:</span> {line.size}</p>
                    <p><span className="font-medium">Color:</span> {line.color}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="mt-auto flex items-center gap-4 pt-3">
                    <div className="flex items-center border border-border rounded">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(line.key, line.qty - 1)}
                        className="px-3 py-2 hover:bg-accent"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{line.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty(line.key, line.qty + 1)}
                        className="px-3 py-2 hover:bg-accent"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.key)}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </div>
                
                {/* Price */}
                <div className="text-right">
                  <p className="text-base font-semibold">{formatEGP(line.price * line.qty)}</p>
                  {line.oldPrice ? (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatEGP(line.oldPrice * line.qty)}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-border bg-card p-6">
            <h2 className="text-xl">Order Summary</h2>

            <label className="mt-6 block text-[0.6rem] tracking-brand uppercase">
              Shipping Governorate
              <select
                value={governorate}
                onChange={(event) => setGovernorate(event.target.value)}
                className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm tracking-normal normal-case"
              >
                <option value="">Select your governorate</option>
                {GOVERNORATES.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} — {formatEGP(item.cost)}
                  </option>
                ))}
              </select>
            </label>

            <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatEGP(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{governorate ? formatEGP(Number(shipping)) : "Select governorate"}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <dt>Total</dt>
                <dd>{formatEGP(total)}</dd>
              </div>
            </dl>

            <Link
              to="/checkout"
              className="mt-6 block bg-primary py-4 text-center text-[0.65rem] tracking-brand text-primary-foreground uppercase transition-opacity hover:opacity-85"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
