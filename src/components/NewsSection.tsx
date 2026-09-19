import { useEffect, useRef } from "react";

const NEWS_ITEMS = [
  "Triple-Z brings you the finest materials and exclusive designs that aren't available anywhere else",
  "Experience luxury fashion with Triple-Z's premium cotton collections crafted for perfection", 
  "Discover Triple-Z's innovative designs that combine comfort with unmatched style and quality",
  "Triple-Z sets new standards in Egyptian fashion with heavyweight materials and attention to detail",
  "Join the Triple-Z community and wear pieces that reflect your unique personality and taste"
];

export function NewsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-black text-white py-3 overflow-hidden">
      <div className="relative">
        <div 
          ref={containerRef}
          className="flex animate-marquee-left whitespace-nowrap"
        >
          {/* First set of news items */}
          {NEWS_ITEMS.map((item, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 flex items-center"
            >
              <p className="text-[0.7rem] tracking-[0.25em] uppercase font-light px-12 text-center">
                {item}
              </p>
              <div className="w-2 h-2 bg-white rounded-full mx-8 flex-shrink-0" />
            </div>
          ))}
          
          {/* Duplicate set for seamless loop */}
          {NEWS_ITEMS.map((item, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 flex items-center"
            >
              <p className="text-[0.7rem] tracking-[0.25em] uppercase font-light px-12 text-center">
                {item}
              </p>
              <div className="w-2 h-2 bg-white rounded-full mx-8 flex-shrink-0" />
            </div>
          ))}
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}