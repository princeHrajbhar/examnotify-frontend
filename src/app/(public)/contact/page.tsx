import type { Metadata } from "next";
import Link from "next/link";

import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact ExamNotify | Questions, Corrections and Student Support",
  description:
    "Contact ExamNotify for questions, incorrect exam information, broken official links, business enquiries, feedback, and student support.",
  keywords: [
    "contact ExamNotify",
    "exam notification support",
    "report incorrect exam information",
    "broken exam link",
    "student support",
    "ExamNotify contact",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact ExamNotify",
    description:
      "Send questions, feedback, corrections, and broken exam link reports to the ExamNotify team.",
    type: "website",
    url: "/contact",
    siteName: "ExamNotify",
  },
  twitter: {
    card: "summary",
    title: "Contact ExamNotify",
    description:
      "Contact ExamNotify for student support, feedback, corrections, and exam link reports.",
  },
};

const contactOptions = [
  {
    title: "General Questions",
    description:
      "Ask questions about ExamNotify, its features, or how to find examination information.",
    icon: QuestionIcon,
    variant: "red",
  },
  {
    title: "Report Incorrect Information",
    description:
      "Tell us about an incorrect date, eligibility detail, exam notice, or organising body.",
    icon: ReportIcon,
    variant: "green",
  },
  {
    title: "Report a Broken Link",
    description:
      "Notify us when a registration, result, admit card, or official website link is not working.",
    icon: LinkIcon,
    variant: "red",
  },
  {
    title: "Business Enquiries",
    description:
      "Contact us regarding partnerships, advertising, collaborations, or other business matters.",
    icon: BusinessIcon,
    variant: "green",
  },
] as const;

export default function ContactPage() {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact ExamNotify",
    description:
      "Contact ExamNotify for questions, corrections, broken links, feedback, and student support.",
    mainEntity: {
      "@type": "Organization",
      name: "ExamNotify",
      founder: {
        "@type": "Person",
        name: "Shailendra Singh",
      },
      email: "support@examnotify.com",
    },
  };

  return (
    <main className="overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative border-b border-slate-200 bg-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 via-white to-green-600" />

        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-red-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-green-100/70 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-slate-500"
          >
            <Link
              href="/"
              className="font-medium transition hover:text-red-600"
            >
              Home
            </Link>

            <span aria-hidden="true">/</span>

            <span className="font-medium text-slate-700">Contact</span>
          </nav>

          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              We are here to help
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Contact{" "}
              <span className="text-red-600">ExamNotify</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Send us your questions, feedback, corrections, or broken exam
              links. Clear information from students helps us make ExamNotify
              more useful and reliable.
            </p>
          </div>
        </div>
      </section>

      {/* Contact options */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-green-600">
              How can we help?
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Choose the reason for contacting us
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Include the examination name and relevant page link whenever you
              report incorrect information or a broken link.
            </p>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactOptions.map((option) => {
              const Icon = option.icon;
              const isRed = option.variant === "red";

              return (
                <article
                  key={option.title}
                  className={`rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                    isRed
                      ? "border-red-100 hover:border-red-300"
                      : "border-green-100 hover:border-green-300"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      isRed
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    <Icon />
                  </span>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {option.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {option.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact form and information */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <ContactForm />

          <aside className="space-y-6">
            {/* Contact information */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="h-1 bg-gradient-to-r from-red-600 via-white to-green-600" />

              <div className="p-6 sm:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                  <MailIcon />
                </span>

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  Contact information
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  You can contact the ExamNotify team directly by email for
                  questions, corrections, feedback, and business enquiries.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                      Email
                    </p>

                    <a
                      href="mailto:support@examnotify.com"
                      className="mt-1 block break-all text-sm font-semibold text-slate-900 transition hover:text-green-700"
                    >
                      support@examnotify.com
                    </a>
                  </div>

                  <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                      Founder
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      Shailendra Singh
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Response time
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      We aim to review messages within 2–3 working days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reporting tips */}
            <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-red-400">
                <InformationIcon />
              </span>

              <h2 className="mt-5 text-xl font-bold">
                Reporting incorrect information?
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Include the exam name, organising body, incorrect information,
                and the page URL. This helps us investigate the issue more
                quickly.
              </p>

              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm leading-6 text-slate-300">
                  ExamNotify is an independent information platform. Always
                  verify deadlines, eligibility, fees, and instructions on the
                  official authority website.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Additional help */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-red-600">
                  Need information quickly?
                </span>

                <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Explore our exam resources
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Browse the latest exam notifications, application links,
                  admit cards, results, and student-friendly guides before
                  contacting support.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Browse Exam Updates
                  <ArrowIcon />
                </Link>

                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center rounded-xl border border-green-600 px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                >
                  Read Exam Guides
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageSchema).replace(/</g, "\\u003c"),
        }}
      />
    </main>
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

function MailIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.5 9a2.8 2.8 0 1 1 4.5 2.2c-1.2.8-2 1.4-2 2.8" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 2 21h20Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
      <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
    </svg>
  );
}

function BusinessIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M2 12h20" />
      <path d="M10 12v2h4v-2" />
    </svg>
  );
}

function InformationIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}