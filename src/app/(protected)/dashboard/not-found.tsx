"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative min-h-[100svh] overflow-x-hidden bg-white">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-100 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-indigo-100 blur-3xl sm:h-[28rem] sm:w-[28rem]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,white_85%)]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-7xl items-center gap-4 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:py-14">
        {/* Animation */}
        <div className="order-1 flex min-h-0 items-center justify-center lg:order-2">
          <div className="relative">
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-200 to-violet-200 blur-3xl" />

            <div className="relative h-[220px] w-[220px] xs:h-[250px] xs:w-[250px] sm:h-[320px] sm:w-[320px] lg:h-[420px] lg:w-[420px]">
              <DotLottieReact
                src="https://lottie.host/23131f22-cbbf-429f-9afc-c3036e169fc1/W00rjxPDKU.lottie"
                autoplay
                loop
                className="h-full w-full"
              />
            </div>
          </div>
        </div>

        {/* Text */}
        <section className="order-2 min-w-0 pb-4 text-center lg:order-1 lg:pb-0 lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700 sm:text-sm">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
            </span>

            Error 404 — impressive navigation
          </div>

          <h1 className="break-words text-3xl font-bold leading-[1.15] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl xl:text-6xl">
            Well, this is awkward.

            <span className="mt-1 block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              You landed on the wrong page.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7 lg:mx-0 lg:text-lg">
            Congratulations! You found a page that does absolutely nothing.
            Either the link is broken, the page escaped, or your typing skills
            need a tiny software update.
          </p>

          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
            <Link
              href="/"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              Take me somewhere useful
              <ArrowRightIcon />
            </Link>

            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/80 px-6 text-sm font-semibold text-slate-700 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              <ArrowLeftIcon />
              Undo my mistake
            </button>
          </div>

          <p className="mt-6 text-xs leading-5 text-slate-400 sm:text-sm">
            No pages were harmed while displaying this error.
          </p>
        </section>
      </div>
    </main>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 shrink-0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}