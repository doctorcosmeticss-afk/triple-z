import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Bell, Check } from "lucide-react";
import { ADMIN_API_URL } from "@/lib/admin-api";

export const Route = createFileRoute("/newsletter")({
  head: () => ({
    meta: [
      { title: "Newsletter — Triple-Z" },
      { name: "description", content: "Stay updated with Triple-Z latest products and offers" },
      { property: "og:title", content: "Newsletter — Triple-Z" },
      { property: "og:description", content: "Get notified about new arrivals and exclusive deals" },
    ],
  }),
  component: NewsletterPage,
});

function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${ADMIN_API_URL}/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSubscribed(true);
      toast.success("Successfully subscribed to our newsletter!");
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              You're All Set! 🎉
            </h1>
            
            <p className="text-white/80 text-lg mb-8">
              Thanks for subscribing! You'll be the first to know about new arrivals and exclusive offers.
            </p>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Stay In The Loop
            </h1>
            
            <p className="text-white/80">
              Get notified about new arrivals, exclusive deals, and updates before anyone else.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Subscribing...
                </>
              ) : (
                <>
                  <Bell className="w-5 h-5" />
                  Subscribe to Newsletter
                </>
              )}
            </button>
          </form>

          {/* Features */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-sm">New product announcements</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-sm">Exclusive discounts & offers</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-sm">Early access to sales</span>
            </div>
          </div>

          {/* Privacy */}
          <p className="text-xs text-white/50 text-center mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
}