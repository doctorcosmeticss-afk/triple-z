import { Link, createFileRoute } from "@tanstack/react-router";
import { Check, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/lib/cart";
import { api } from "@/lib/api";
import { formatEGP } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Triple-Z" },
      {
        name: "description",
        content:
          "Complete your Triple-Z order with Vodafone Cash, InstaPay or cash on delivery, shipped anywhere in Egypt.",
      },
      { property: "og:title", content: "Checkout — Triple-Z" },
      { property: "og:description", content: "Secure Triple-Z checkout with Egyptian payment options." },
    ],
  }),
  component: CheckoutPage,
});

type PaymentMethod = "vodafone_cash" | "cash_on_delivery" | "instapay";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; note: string }[] = [
  { value: "vodafone_cash", label: "Vodafone Cash", note: "Transfer to +20 11 44044728, then upload your receipt." },
  { value: "instapay", label: "InstaPay", note: "Send to ahmed.morsy@instapay, then upload your receipt." },
  { value: "cash_on_delivery", label: "Cash on Delivery", note: "Pay the courier when your order arrives." },
];

type Errors = Partial<Record<"fullName" | "email" | "phone" | "address" | "governorate", string>>;

function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  
  // Fixed shipping costs for Egypt governorates
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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; percent: number } | null>(null);
  const [checkingPromo, setCheckingPromo] = useState(false);

  const [method, setMethod] = useState<PaymentMethod>("vodafone_cash");
  const [transferOpen, setTransferOpen] = useState(false);
  const [payerName, setPayerName] = useState("");
  const [payerAccount, setPayerAccount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const shipping = Number(GOVERNORATES.find((item) => item.name === governorate)?.cost ?? 0);
  const discount = promo ? Math.round((subtotal * promo.percent) / 100) : 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  const validate = () => {
    const next: Errors = {};
    if (fullName.trim().length < 3) next.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email address.";
    if (!/^1[0-9]{9}$/.test(phone)) next.phone = "Enter a 10-digit Egyptian number starting with 1.";
    if (address.trim().length < 8) next.address = "Please enter your full street address.";
    if (!governorate) next.governorate = "Please select your governorate.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setCheckingPromo(true);
    
    try {
      const promoData = await api.validatePromoCode(code);
      setPromo({ code: promoData.code, percent: Number(promoData.percentOff) });
      toast.success(`${promoData.percentOff}% off applied.`);
    } catch (error: any) {
      toast.error(error.message || "That code is not valid or has expired.");
    } finally {
      setCheckingPromo(false);
    }
  };

  const placeOrder = async () => {
    if (!validate()) {
      toast.error("Please check the highlighted fields.");
      return;
    }
    if (lines.length === 0) {
      toast.error("Your bag is empty.");
      return;
    }
    if (method !== "cash_on_delivery") {
      setTransferOpen(true);
      return;
    }
    await saveOrder();
  };

  const saveOrder = async () => {
    setSubmitting(true);

    try {
      // Use promo code if applied
      if (promo?.code) {
        await api.usePromoCode(promo.code);
      }

      const orderData = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: `+20${phone}`,
        addressLine: address.trim(),
        city: city.trim() || null,
        governorate,
        notes: [notes.trim(), altPhone ? `Alt phone: +20${altPhone}` : ""]
          .filter(Boolean)
          .join(" | ") || null,
        items: lines.map(({ key, slug, tone, oldPrice, ...item }) => ({
          ...item,
          // Keep image URL but make sure it's not a data URI
          image: item.image && typeof item.image === 'string' && !item.image.startsWith('data:') 
            ? item.image 
            : undefined,
        })),
        subtotal,
        shippingCost: shipping,
        discount,
        promoCode: promo?.code || null,
        total,
        paymentMethod: method,
        payerName: payerName.trim() || null,
        payerAccount: payerAccount.trim() || null,
        transferAmount: transferAmount ? Number(transferAmount) : null,
        paymentProofPath: receiptImage || null,
      };

      await api.createOrder(orderData);

      setTransferOpen(false);
      setOrderNumber(email.trim());
      clear();
    } catch (error: any) {
      toast.error(error.message || "We could not place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Compress image to max 150KB with better quality
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error("Image is too large. Please choose an image under 5MB."));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Better size: max 800px (better quality than 400px)
          const maxSize = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height / width) * maxSize;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Start with quality 0.7 (better quality)
          let quality = 0.7;
          let result = canvas.toDataURL('image/jpeg', quality);
          
          // Target 150KB instead of 100KB
          const maxBytes = 150000;
          
          // If still too large, reduce quality
          while (result.length > maxBytes && quality > 0.3) {
            quality -= 0.05;
            result = canvas.toDataURL('image/jpeg', quality);
          }
          
          if (result.length > maxBytes) {
            reject(new Error("Cannot compress image enough. Please use a simpler/smaller image."));
            return;
          }
          
          resolve(result);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  if (orderNumber) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-6 w-6" />
        </span>
        <h1 className="mt-6 text-3xl">Order confirmed</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Thank you. A confirmation is on its way to{" "}
          <span className="text-foreground">{orderNumber}</span>, and our team will call you to
          confirm your delivery details shortly.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-block border border-primary px-6 py-3 text-[0.65rem] tracking-brand uppercase hover:bg-primary hover:text-primary-foreground"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl sm:text-5xl">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        {/* Order Summary - First Column */}
        <aside className="h-fit border border-border bg-card p-6">
          <h2 className="text-xl">Your Order</h2>

          <ul className="mt-5 space-y-4 border-b border-border pb-5">
            {lines.map((line) => (
              <li key={line.key} className="flex gap-3">
                {/* Product Image */}
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border">
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
                <div className="flex-1">
                  <div className="flex justify-between gap-2">
                    <h3 className="font-medium text-sm">{line.name}</h3>
                    <span className="text-sm font-semibold">{formatEGP(line.price * line.qty)}</span>
                  </div>
                  <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                    <p><span className="font-medium">Size:</span> {line.size}</p>
                    <p><span className="font-medium">Color:</span> {line.color}</p>
                    <p><span className="font-medium">Quantity:</span> {line.qty}</p>
                  </div>
                </div>
              </li>
            ))}
            {lines.length === 0 ? (
              <li className="text-sm text-muted-foreground">Your bag is empty.</li>
            ) : null}
          </ul>

          <div className="mt-5">
            <label className="text-[0.6rem] tracking-brand uppercase">Promo Code</label>
            <div className="mt-2 flex gap-2">
              <input
                value={promoInput}
                onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                placeholder="TRIPLEZ15-XXXXX"
                className="input-morth"
              />
              <button
                type="button"
                onClick={() => void applyPromo()}
                disabled={checkingPromo}
                className="shrink-0 border border-primary px-4 text-[0.6rem] tracking-brand uppercase hover:bg-primary hover:text-primary-foreground"
              >
                {checkingPromo ? "…" : "Apply"}
              </button>
            </div>
            {promo ? (
              <p className="mt-2 text-xs text-muted-foreground">
                {promo.code} applied — {promo.percent}% off.
              </p>
            ) : null}
          </div>

          <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatEGP(subtotal)}</dd>
            </div>
            {discount > 0 ? (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Discount</dt>
                <dd>-{formatEGP(discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{governorate ? formatEGP(shipping) : "Select governorate"}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt>Total</dt>
              <dd>{formatEGP(total)}</dd>
            </div>
          </dl>
        </aside>

        {/* Form - Second Column */}
        <div className="space-y-10">
          <section>
            <h2 className="text-xl">Personal Information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName}>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="input-morth"
                  placeholder="Your full name"
                />
              </Field>
              <Field label="Email address" error={errors.email}>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="input-morth"
                  placeholder="you@email.com"
                />
              </Field>
              <Field label="Phone number" error={errors.phone}>
                <div className="flex">
                  <span className="flex items-center border border-r-0 border-border bg-muted px-3 text-sm">
                    +20
                  </span>
                  <input
                    inputMode="numeric"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="input-morth"
                    placeholder="1XXXXXXXXX"
                  />
                </div>
              </Field>
              <Field label="Second phone (optional)">
                <div className="flex">
                  <span className="flex items-center border border-r-0 border-border bg-muted px-3 text-sm">
                    +20
                  </span>
                  <input
                    inputMode="numeric"
                    value={altPhone}
                    onChange={(event) =>
                      setAltPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className="input-morth"
                    placeholder="1XXXXXXXXX"
                  />
                </div>
              </Field>
              <Field label="Governorate" error={errors.governorate}>
                <select
                  value={governorate}
                  onChange={(event) => setGovernorate(event.target.value)}
                  className="input-morth"
                >
                  <option value="">Select your governorate</option>
                  {GOVERNORATES.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name} — {formatEGP(item.cost)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="City / area (optional)">
                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="input-morth"
                  placeholder="Maadi, Zamalek…"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Street address" error={errors.address}>
                  <input
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="input-morth"
                    placeholder="Building, street, floor, apartment"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Order notes (optional)">
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={3}
                    className="input-morth"
                    placeholder="Delivery instructions"
                  />
                </Field>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl">Payment Method</h2>
            <div className="mt-5 space-y-3">
              {PAYMENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMethod(option.value)}
                  className={cn(
                    "flex w-full items-start gap-3 border border-border p-4 text-left transition-colors",
                    method === option.value && "border-primary bg-accent",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary",
                      method === option.value && "bg-primary",
                    )}
                  />
                  <span>
                    <span className="block text-sm">{option.label}</span>
                    <span className="block text-xs text-muted-foreground">{option.note}</span>
                  </span>
                </button>
              ))}
            </div>

            {/* Place Order Button */}
            <button
              type="button"
              onClick={() => void placeOrder()}
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 bg-primary py-4 text-[0.65rem] tracking-brand text-primary-foreground uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {method === "cash_on_delivery" ? "Place Order" : "Continue to Payment"}
            </button>
          </section>
        </div>
      </div>

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {method === "vodafone_cash" ? "Vodafone Cash Transfer" : "InstaPay Transfer"}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Transfer <span className="text-foreground">{formatEGP(total)}</span> to{" "}
            <span className="text-foreground">
              {method === "vodafone_cash" ? "+20 11 44044728" : "ahmed.morsy@instapay"}
            </span>
            , then upload your payment receipt and confirm the details below.
          </p>

          <div className="space-y-4">
            <Field label="Payment receipt (screenshot/photo)">
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center justify-center gap-2 border-2 border-dashed border-border p-4 hover:border-primary transition-colors rounded">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {receiptImage ? "✅ Receipt uploaded - Click to change" : "Click to upload receipt"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      toast.loading("Compressing image...");
                      try {
                        const compressed = await compressImage(file);
                        setReceiptImage(compressed);
                        toast.dismiss();
                        toast.success("Receipt uploaded successfully!");
                      } catch (err: any) {
                        toast.dismiss();
                        toast.error(err.message || "Failed to process image");
                      }
                    }}
                  />
                </label>
                
                {receiptImage && (
                  <div className="relative w-32 h-32 border border-border rounded overflow-hidden">
                    <img 
                      src={receiptImage} 
                      alt="Payment receipt" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setReceiptImage(null)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </Field>
            <Field label="Payer name">
              <input
                value={payerName}
                onChange={(event) => setPayerName(event.target.value)}
                className="input-morth"
                placeholder="Name on the sending account"
              />
            </Field>
            <Field label={method === "vodafone_cash" ? "Sending wallet number" : "InstaPay account"}>
              <input
                value={payerAccount}
                onChange={(event) => setPayerAccount(event.target.value)}
                className="input-morth"
                placeholder={method === "vodafone_cash" ? "01XXXXXXXXX" : "name@instapay"}
              />
            </Field>
            <Field label="Amount transferred (EGP)">
              <input
                inputMode="decimal"
                value={transferAmount}
                onChange={(event) => setTransferAmount(event.target.value.replace(/[^\d.]/g, ""))}
                className="input-morth"
                placeholder={String(total)}
              />
            </Field>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              if (!payerName.trim() || !payerAccount.trim() || !transferAmount) {
                toast.error("Please complete all payment details.");
                return;
              }
              if (!receiptImage) {
                toast.error("Please upload your payment receipt.");
                return;
              }
              void saveOrder();
            }}
            className="mt-2 flex w-full items-center justify-center gap-2 bg-primary py-4 text-[0.65rem] tracking-brand text-primary-foreground uppercase disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Confirm Payment &amp; Place Order
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[0.6rem] tracking-brand uppercase">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
