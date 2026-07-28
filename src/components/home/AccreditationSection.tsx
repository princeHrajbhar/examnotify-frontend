"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const logoData = [
  {
    name: "ISO 9001",
    logo: "https://sn.shikshanation.com/certificates/iso-9001.webp",
  },
  {
    name: "MSME",
    logo: "https://sn.shikshanation.com/certificates/msme.webp",
  },
  {
    name: "Startup India",
    logo: "https://sn.shikshanation.com/certificates/startup-india.webp",
  },
  {
    name: "Skill India",
    logo: "https://sn.shikshanation.com/certificates/skill-india.webp",
  },
  {
    name: "NSDC",
    logo: "https://sn.shikshanation.com/certificates/nsdc.webp",
  },
  {
  name: "Ministry of Electronics & Information Technology",
  logo: "/meity-logo.webp",
},
{
  name: "NASSCOM",
  logo: "/nasscom-logo.webp",
},
];

export default function LogoSlider() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const isHoveredRef = useRef(false);

  const SPEED = 170; // px/sec

  const animate = (time: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (!lastTimeRef.current) lastTimeRef.current = time;

    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // Don't advance scroll position while the user is hovering/interacting,
    // but keep the rAF loop alive so it resumes instantly on mouse leave.
    if (!isHoveredRef.current) {
      container.scrollLeft += (SPEED * delta) / 1000;

      const halfway = container.scrollWidth / 2;
      if (halfway > 0 && container.scrollLeft >= halfway) {
        container.scrollLeft -= halfway;
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (animationRef.current) return;

    // Reset the clock and wait a couple of frames so the browser has fully
    // committed layout before we start reading scrollWidth/clientWidth.
    // This avoids the "doesn't auto-start on first load" race condition.
    lastTimeRef.current = 0;
    requestAnimationFrame(() => {
      requestAnimationFrame((time) => {
        lastTimeRef.current = time;
        animationRef.current = requestAnimationFrame(animate);
      });
    });
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // useLayoutEffect fires synchronously right after the DOM is painted-ready,
  // which is more reliable than useEffect for kicking off layout-dependent
  // animations right on mount.
  useLayoutEffect(() => {
    startAnimation();
    return () => stopAnimation();
  }, []);

  // Recovery net: browsers can pause/drop rAF loops when a tab is
  // backgrounded or a page is restored from the back-forward cache (bfcache)
  // during client-side navigation. Without this, the loop can silently die
  // and never resume until a hard refresh. This restarts it automatically.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        stopAnimation();
        startAnimation();
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        stopAnimation();
        startAnimation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.75;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full overflow-hidden border-y border-gray-100 bg-white py-6 m-0">
      {/* Fade Effect */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-20 bg-gradient-to-l from-white to-transparent" />

      <div className="group relative mx-auto max-w-[1440px] px-4 sm:px-12">

        {/* Left Arrow */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg opacity-0 transition-all duration-300 hover:scale-110 hover:bg-[#016ab7] hover:text-white group-hover:opacity-100"
        >
          <RiArrowLeftSLine size={24} />
        </button>

        {/* Logos */}
        <div
          ref={scrollContainerRef}
          className="no-scrollbar flex items-center gap-10 overflow-x-auto select-none lg:gap-14"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {[...logoData, ...logoData].map((item, index) => (
            <div
              key={index}
              className="flex h-[131px] w-[175px] flex-shrink-0 items-center justify-center rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 hover:scale-110"
            >
              <img
                src={item.logo}
                alt={item.name}
                draggable={false}
                className="pointer-events-none h-full w-full object-contain transition-all duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg opacity-0 transition-all duration-300 hover:scale-110 hover:bg-[#016ab7] hover:text-white group-hover:opacity-100"
        >
          <RiArrowRightSLine size={24} />
        </button>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
