"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cdn } from "@/lib/cdn";

type Banner = {
  src: string;
  /** Doubles as the image alt text and the accessible name of the link. */
  alt: string;
  href: string;
  /** Opens in a new tab instead of client-side navigating. */
  external?: boolean;
};

const banners: Banner[] = [
  {
    src: "/skillo/hero7.webp",
    alt: "NASSCOM IT-ITeS SSC and Shiksha Nation - enroll in Gen AI 101 on FutureSkills Prime",
    href: "https://www.futureskillsprime.in/course/gen-ai-101/",
    external: true,
  },
  {
    src: "/skillo/hero1.webp",
    alt: "AI Generalist to Specialist - explore course",
    href: "/course/ai-generalist-to-specialist",
  },
  {
    src: "/skillo/hero2.webp",
    alt: "AI + ML Automation Mastery - explore course",
    href: "/course/ai-ml-automation-mastery",
  },
  {
    src: "/skillo/hero3.webp",
    alt: "Product Management - explore course",
    href: "/course/product-management-course",
  },
  {
    src: "/skillo/hero4.webp",
    alt: "Digital Marketing - explore course",
    href: "/course/digital-marketing-course",
  },
  {
    src: "/skillo/hero5.webp",
    alt: "Data Analytics - explore course",
    href: "/course/data-analytics-course",
  },
  {
    src: "/skillo/hero6.webp",
    alt: "UI / UX Design - explore course",
    href: "/course/ui-ux-design-course",
  },
].map((banner) => ({ ...banner, src: cdn(banner.src) }));

function BannerLink({
  banner,
  isActive,
  children,
}: {
  banner: Banner;
  isActive: boolean;
  children: ReactNode;
}) {
  // Slides that are faded out stay in the DOM, so keep them out of the tab order.
  const tabIndex = isActive ? 0 : -1;

  if (banner.external) {
    return (
      <a
        href={banner.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={tabIndex}
        className="block w-full"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={banner.href} tabIndex={tabIndex} className="block w-full">
      {children}
    </Link>
  );
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Keeps section height equal to banner */}
      <Image
        src={banners[0].src}
        alt=""
        width={1920}
        height={650}
        priority
        className="w-full h-auto invisible pointer-events-none"
      />

      {/* Slides */}
      {banners.map((banner, index) => {
        const isActive = current === index;

        return (
          <div
            key={banner.src}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-700 ${
              isActive
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <BannerLink banner={banner} isActive={isActive}>
              <Image
                src={banner.src}
                alt={banner.alt}
                width={1920}
                height={650}
                priority={index === 0}
                draggable={false}
                className="w-full h-auto select-none"
              />
            </BannerLink>
          </div>
        );
      })}

      {/* Previous */}
      <button
        onClick={prevSlide}
        aria-label="Previous"
        className="absolute left-2 sm:left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition p-1.5 sm:p-2 md:p-3"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
      </button>

      {/* Next */}
      <button
        onClick={nextSlide}
        aria-label="Next"
        className="absolute right-2 sm:right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition p-1.5 sm:p-2 md:p-3"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:gap-2">
        {banners.map((banner, index) => (
          <button
            key={banner.src}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`rounded-full transition-all duration-300 ${
              current === index
                ? "w-5 sm:w-7 md:w-8 h-1.5 sm:h-2 bg-blue-600"
                : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
