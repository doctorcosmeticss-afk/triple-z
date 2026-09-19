import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES, CATEGORY_COPY, slugifyCategory } from "@/lib/store";

const CATEGORY_SECTIONS = [
  {
    name: "FULL SUITE",
    image: "/zzz full sute.png",
    description: CATEGORY_COPY["FULL SUITE"],
  },
  {
    name: "PANTS",
    image: "/zzz pants (trash).png",
    description: CATEGORY_COPY["PANTS"],
  },
  {
    name: "HOODIES",
    image: "/zzz zip up 5.png",
    description: CATEGORY_COPY["HOODIES"],
  },
  {
    name: "CREW-NECK",
    image: "/crwneck1.png",
    description: CATEGORY_COPY["CREW-NECK"],
  },
];

export function CategoryShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerTop = container.getBoundingClientRect().top;
      const containerHeight = container.offsetHeight;
      
      // Calculate which section should be active based on scroll position
      const scrollProgress = -containerTop / (containerHeight - window.innerHeight);
      const sectionIndex = Math.floor(scrollProgress * CATEGORY_SECTIONS.length);
      
      const clampedIndex = Math.max(0, Math.min(CATEGORY_SECTIONS.length - 1, sectionIndex));
      setActiveIndex(clampedIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCategoryClick = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div ref={containerRef} className="relative min-h-[400vh]">
      {/* Sticky Centered Navigation - Stops at the end of categories */}
      <div className="sticky top-0 h-screen z-40">
        <nav className="absolute inset-x-0 flex items-center justify-center pointer-events-none h-full">
          <div className="pointer-events-auto flex flex-col items-center gap-4 sm:gap-6">
            <p className="text-[0.55rem] tracking-[0.35em] text-white/60 uppercase mb-2">
              Explore Collections
            </p>
            {CATEGORY_SECTIONS.map((category, index) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(index)}
                className={cn(
                  "font-display text-3xl sm:text-5xl lg:text-6xl transition-all duration-700 ease-out relative",
                  activeIndex === index
                    ? "opacity-100 scale-100 text-white font-light tracking-wide"
                    : "opacity-30 scale-95 text-white/50 font-extralight hover:opacity-50"
                )}
              >
                {category.name}
                {activeIndex === index && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-px bg-white animate-scale-in" />
                )}
              </button>
            ))}
            
            {activeIndex !== null && (
              <Link
                to="/category/$slug"
                params={{ slug: slugifyCategory(CATEGORY_SECTIONS[activeIndex].name) }}
                className="mt-4 flex items-center gap-2 text-[0.6rem] tracking-[0.32em] text-white uppercase border border-white/40 px-6 py-3 transition-all hover:bg-white hover:text-black group"
              >
                <span>Discover</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Full-Screen Category Sections */}
      <div className="absolute top-0 left-0 right-0">
        {CATEGORY_SECTIONS.map((category, index) => (
          <section
            key={category.name}
            ref={(el) => (sectionsRef.current[index] = el)}
            id={`category-${slugifyCategory(category.name)}`}
            className="relative h-screen w-full flex items-center justify-center"
          >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover object-center scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
            </div>

            {/* Optional Description - Bottom Corner */}
            <div className="absolute bottom-12 left-8 right-8 sm:left-12 sm:right-auto sm:max-w-md z-30 opacity-0 animate-fade-up pointer-events-none">
              <p className="text-sm text-white/70 leading-relaxed">
                {category.description}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
