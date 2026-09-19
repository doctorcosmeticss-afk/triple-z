import { cn } from "@/lib/utils";
import { toneStyle } from "@/lib/store";

/**
 * Neutral placeholder block standing in for product photography.
 * Supports both tone gradients and real image URLs.
 */
export function ProductPlaceholder({
  tone,
  label,
  className,
}: {
  tone?: string | undefined;
  label?: string | undefined;
  className?: string | undefined;
}) {
  // Check if tone is an image URL (starts with / or http)
  const isImageUrl = tone && (tone.startsWith('/') || tone.startsWith('http'));

  if (isImageUrl) {
    return (
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden bg-gray-100",
          className,
        )}
        aria-hidden="true"
      >
        <img 
          src={tone} 
          alt={label || "Product"} 
          className="h-full w-full object-cover"
          onError={(e) => {
            console.error('Image failed to load:', tone);
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
      style={toneStyle(tone)}
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-[0.07] [background:repeating-linear-gradient(135deg,#000_0px,#000_1px,transparent_1px,transparent_9px)]" />
      <span className="relative select-none text-[0.6rem] tracking-brand text-black/35 uppercase">
        {label ?? "Triple-Z"}
      </span>
    </div>
  );
}
