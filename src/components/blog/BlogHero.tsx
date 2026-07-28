"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const AUTO_SCROLL_DELAY = 5000;

type BlogBanner = {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  href: string;
  buttonLabel: string;
};

const blogBanners: BlogBanner[] = [
  {
    id: 1,
    category: "Exam Preparation",
    title: "How to Prepare for Government Exams Effectively",
    description:
      "Create a practical study plan, manage your time, revise important topics, and improve your exam preparation strategy.",
    image: "https://genius.com/artists/Madman/q/most-popular-album",
    href: "/blog/government-exam-preparation",
    buttonLabel: "Read Preparation Guide",
  },
  {
    id: 2,
    category: "Application Guide",
    title: "Common Mistakes to Avoid While Filling Exam Forms",
    description:
      "Learn how to enter your details, upload documents, pay fees, and submit examination forms without errors.",
    image: "https://www.rapologia.it/madman-mm-vol-5-quando-esce/",
    href: "/blog/exam-form-mistakes",
    buttonLabel: "Read Application Guide",
  },
  {
    id: 3,
    category: "Admit Card",
    title: "What to Check After Downloading Your Admit Card",
    description:
      "Verify your personal details, examination date, reporting time, exam centre, and important instructions before exam day.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQefbZ06AkVhF7lRJaYS1Xds9bbwqWSWFsQ42JZFMNmEw&s",
    href: "/blog/admit-card-checklist",
    buttonLabel: "View Admit Card Guide",
  },
  {
    id: 4,
    category: "Exam Results",
    title: "How to Check Exam Results and Download Scorecards",
    description:
      "Follow simple steps to find official result links, check your qualification status, and safely download your scorecard.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbZ3CxO48jAoVXsStEUUvENCi8UyF-aL7Rih5sj3z2EewnKCcys4g-9mc&s=10",
    href: "/blog/check-exam-results",
    buttonLabel: "Read Result Guide",
  },
];

export default function BlogHero() {
  const [activeBanner, setActiveBanner] = useState(0);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);

  const currentBanner = blogBanners[activeBanner];
  const isPaused = !isAutoPlayEnabled || isInteracting;

  // Respect reduced-motion browser settings.
  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reducedMotionQuery.matches) {
      setIsAutoPlayEnabled(false);
    }
  }, []);

  // Automatically show the next banner.
  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveBanner((currentIndex) =>
        currentIndex === blogBanners.length - 1
          ? 0
          : currentIndex + 1,
      );
    }, AUTO_SCROLL_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeBanner, isPaused]);

  const showPreviousBanner = () => {
    setActiveBanner((currentIndex) =>
      currentIndex === 0
        ? blogBanners.length - 1
        : currentIndex - 1,
    );
  };

  const showNextBanner = () => {
    setActiveBanner((currentIndex) =>
      currentIndex === blogBanners.length - 1
        ? 0
        : currentIndex + 1,
    );
  };

  return (
    <section
      className="m-0 bg-white p-0"
      aria-label="Featured blog articles"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocusCapture={() => setIsInteracting(true)}
      onBlurCapture={(event) => {
        const nextFocusedElement = event.relatedTarget as Node | null;

        if (
          !nextFocusedElement ||
          !event.currentTarget.contains(nextFocusedElement)
        ) {
          setIsInteracting(false);
        }
      }}
    >
      <div className="relative min-h-[420px] w-full overflow-hidden bg-slate-950 shadow-xl sm:min-h-[480px] lg:min-h-[520px]">
        <Image
          key={currentBanner.image}
          src={currentBanner.image}
          alt={currentBanner.title}
          fill
          priority={activeBanner === 0}
          className="object-cover"
          sizes="100vw"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/30" />

        {/* Theme line */}
        <div className="absolute left-0 top-0 z-10 h-1.5 w-full bg-gradient-to-r from-red-600 via-white to-green-600" />

        {/* Banner content */}
        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-7xl items-center px-4 py-10 sm:min-h-[480px] sm:px-6 lg:min-h-[520px] lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />

              {currentBanner.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {currentBanner.title}
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
              {currentBanner.description}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={currentBanner.href}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                {currentBanner.buttonLabel}

                <ArrowIcon />
              </Link>

              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Explore All Articles
              </Link>
            </div>
          </div>
        </div>

        {/* Slider indicators */}
        <div className="absolute bottom-6 left-4 z-20 flex items-center gap-2 sm:bottom-8 sm:left-6 lg:left-8">
          {blogBanners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setActiveBanner(index)}
              aria-label={`Show featured article ${index + 1}: ${banner.title}`}
              aria-current={activeBanner === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all ${
                activeBanner === index
                  ? "w-8 bg-red-600"
                  : "w-2.5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {/* Slider controls */}
        <div className="absolute bottom-6 right-4 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8">
          <button
            type="button"
            onClick={showPreviousBanner}
            aria-label="Show previous featured article"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 text-white backdrop-blur transition hover:bg-red-600"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() =>
              setIsAutoPlayEnabled((currentValue) => !currentValue)
            }
            aria-label={
              isAutoPlayEnabled
                ? "Pause automatic slider"
                : "Start automatic slider"
            }
            aria-pressed={!isAutoPlayEnabled}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 text-white backdrop-blur transition hover:bg-white/20"
          >
            {isAutoPlayEnabled ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            type="button"
            onClick={showNextBanner}
            aria-label="Show next featured article"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 text-white backdrop-blur transition hover:bg-green-600"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M9 5v14" />
      <path d="M15 5v14" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7Z" />
    </svg>
  );
}