import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Ahmed Hassan",
    rating: 5,
    text: "Triple-Z quality is unmatched! The fabric feels premium and the fit is perfect. Will definitely order again.",
  },
  {
    id: 2,
    name: "Sarah Mohamed",
    rating: 5,
    text: "Amazing designs and excellent customer service. Triple-Z has become my go-to brand for quality clothing.",
  },
  {
    id: 3,
    name: "Omar Ali",
    rating: 5,
    text: "The attention to detail in Triple-Z products is incredible. Every piece feels like it's made to last.",
  },
  {
    id: 4,
    name: "Mira Youssef",
    rating: 5,
    text: "Triple-Z delivers on both style and comfort. The materials are top-notch and the designs are unique.",
  },
  {
    id: 5,
    name: "Karim Farouk",
    rating: 5,
    text: "Outstanding quality and fast delivery. Triple-Z sets the standard for premium Egyptian fashion.",
  },
  {
    id: 6,
    name: "Nour Adel",
    rating: 5,
    text: "Love everything about Triple-Z! The clothing is comfortable, stylish, and built to last. Highly recommended!",
  }
];

export function ReviewsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const duplicatedReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section className="bg-secondary py-16 overflow-hidden" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-12">
        <p className="text-[0.6rem] tracking-[0.35em] text-muted-foreground uppercase mb-4">
          Customer Reviews
        </p>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light">
          What Our Customers<br />Say About Triple-Z
        </h2>
      </div>

      <div className="relative">
        <div 
          className={`flex gap-6 ${isVisible ? 'animate-scroll-reverse' : ''}`}
          style={{ width: 'max-content' }}
        >
          {duplicatedReviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="flex-shrink-0 w-80 bg-background rounded-lg p-6 shadow-sm border border-border"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                "{review.text}"
              </p>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                  {review.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{review.name}</p>
                  <p className="text-xs text-muted-foreground">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-secondary to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-secondary to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}