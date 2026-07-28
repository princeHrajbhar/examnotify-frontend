"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CTASection({
  heading = "Turn Your Skills Into Career Opportunities",
  description = "Learn from industry experts, build real-world projects, and get job-ready with structured programs.",
  buttonText = "Explore Courses",
  buttonHref = "/course",
}: CTASectionProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">

        <div className="relative overflow-hidden rounded-3xl border border-blue-300/40 bg-gradient-to-br from-blue-200/70 to-green-100/60">

          {/* Blue Glow */}
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#016ab7]/25 blur-3xl" />

          {/* Green Glow */}
          <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-[#6cb84d]/25 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-8 p-8 text-center lg:flex-row lg:items-center lg:justify-between lg:p-10 lg:text-left">

            {/* Content */}
            <div className="max-w-2xl mx-auto lg:mx-0">

              <h2 className=" text-3xl font-bold text-slate-900 lg:text-4xl">
                {heading}
              </h2>

              <p className="mt-3 text-slate-600">
                {description}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={buttonHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#016ab7] px-6 py-3 font-semibold text-white transition-all hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25 hover:scale-[1.02]"
              >
                {buttonText}
                <ArrowRight size={18} />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
