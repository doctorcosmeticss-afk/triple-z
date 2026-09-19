import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const SLIDES = [
  {
    kicker: "Autumn / Winter",
    title: "Weight & Silence",
    copy: "Heavyweight cotton cut in limited runs. Built to hold its shape season after season.",
    image: "/imgsilde1.png",
  },
  {
    kicker: "New Arrivals",
    title: "The Cairo Series",
    copy: "Twelve pieces, dyed in muted earth tones and finished by hand in our Cairo atelier.",
    image: "/imgsilde2.png",
  },
  {
    kicker: "Best Sellers",
    title: "Worn Everywhere",
    copy: "The pieces our community reorders — restocked in every size, in the colours you asked for.",
    image: "/imgsilde3.png",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % SLIDES.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[78vh] min-h-[520px] overflow-hidden">
      {SLIDES.map((slide, slideIndex) => (
        <div
          key={slide.title}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            slideIndex === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <img 
            src={slide.image} 
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 sm:px-6">
            {slideIndex === index ? (
              <div className="max-w-xl animate-fade-up text-white">
                <p className="text-[0.6rem] tracking-brand uppercase">{slide.kicker}</p>
                <h1 className="mt-4 text-5xl leading-[1.05] text-white sm:text-7xl">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-md text-sm text-white/80">{slide.copy}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/new-arrivals"
                    className="bg-white px-8 py-4 text-[0.65rem] tracking-brand text-black uppercase transition-opacity hover:opacity-85"
                  >
                    Shop New Arrivals
                  </Link>
                  <Link
                    to="/products"
                    className="border border-white px-8 py-4 text-[0.65rem] tracking-brand text-white uppercase transition-colors hover:bg-white hover:text-black"
                  >
                    All Products
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((slide, slideIndex) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Go to slide ${slideIndex + 1}`}
            onClick={() => setIndex(slideIndex)}
            className={cn(
              "h-0.5 w-10 transition-colors",
              slideIndex === index ? "bg-white" : "bg-white/40",
            )}
          />
        ))}
      </div>
    </section>
  );
}
