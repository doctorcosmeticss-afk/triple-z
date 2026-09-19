import { useState } from "react";
import { cn } from "@/lib/utils";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSuccess(true);
    setEmail("");
    setIsSubmitting(false);
    
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/newsletter-bg.jpg"
          alt="Newsletter"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <p className="text-[0.6rem] tracking-[0.35em] text-white/60 uppercase mb-6">
          Newsletter
        </p>
        
        <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white font-light mb-8">
          Drops, restocks<br />and private sales<br />before anyone else.
        </h2>

        <p className="text-white/70 text-sm mb-12 max-w-md mx-auto">
          Join our community and be the first to know about new releases, exclusive offers, and limited edition pieces.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isSubmitting || isSuccess}
              className={cn(
                "flex-1 bg-white/10 border border-white/30 px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-all",
                "text-sm tracking-wide",
                isSuccess && "bg-green-500/20 border-green-500/50"
              )}
            />
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={cn(
                "px-8 py-4 text-[0.6rem] tracking-[0.32em] uppercase transition-all",
                "border border-white text-white hover:bg-white hover:text-black",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isSuccess && "bg-green-500 border-green-500"
              )}
            >
              {isSuccess ? "Subscribed!" : isSubmitting ? "Joining..." : "Join"}
            </button>
          </div>
        </form>

        <p className="text-white/40 text-xs mt-6">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
