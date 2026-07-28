import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About ExamNotify | Our Mission, Vision and Founder",
  description:
    "Learn about ExamNotify, a student-focused platform founded by Shailendra Singh to help students find exam notifications, official links, results, admit cards, application forms, and simple exam guides.",
  keywords: [
    "about ExamNotify",
    "ExamNotify founder",
    "Shailendra Singh",
    "exam notification website",
    "government exam updates",
    "exam application links",
    "exam results",
    "admit card updates",
    "student exam guides",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About ExamNotify | Founded by Shailendra Singh",
    description:
      "Discover the mission behind ExamNotify and how it helps students access exam notifications, official links, results, admit cards, and easy guides.",
    type: "website",
    url: "/about",
    siteName: "ExamNotify",
  },
  twitter: {
    card: "summary_large_image",
    title: "About ExamNotify",
    description:
      "Learn about ExamNotify, its mission, values, and founder Shailendra Singh.",
  },
};

const values = [
  {
    title: "Student First",
    description:
      "Every section of ExamNotify is designed to help students find important exam information quickly and easily.",
    icon: StudentIcon,
    style: "border-red-100 bg-red-50 text-red-600",
  },
  {
    title: "Simple Information",
    description:
      "We present exam updates, official links, dates, and instructions in a clean and understandable format.",
    icon: DocumentIcon,
    style: "border-green-100 bg-green-50 text-green-600",
  },
  {
    title: "Reliable Sources",
    description:
      "We encourage students to verify important details through official examination and recruitment websites.",
    icon: ShieldIcon,
    style: "border-red-100 bg-red-50 text-red-600",
  },
  {
    title: "Equal Access",
    description:
      "Our goal is to make useful examination information accessible to students from different regions and backgrounds.",
    icon: GlobeIcon,
    style: "border-green-100 bg-green-50 text-green-600",
  },
];

const services = [
  {
    title: "Latest Exam Notifications",
    description:
      "Discover newly released recruitment notices, entrance exams, government jobs, and important examination updates.",
    href: "/notifications/latest-jobs",
  },
  {
    title: "Registration Links",
    description:
      "Find application forms and direct registration links for active examinations and recruitment opportunities.",
    href: "/registration",
  },
  {
    title: "Admit Card Updates",
    description:
      "Access admit card notices, download links, examination dates, reporting times, and important instructions.",
    href: "/admit-card",
  },
  {
    title: "Exam Results",
    description:
      "Find result announcements, scorecards, merit lists, selection lists, and related examination updates.",
    href: "/results",
  },
  {
    title: "State-Wise Updates",
    description:
      "Explore government jobs, state public service commission exams, police recruitment, and teaching vacancies by state.",
    href: "/notifications/state/uttar-pradesh",
  },
  {
    title: "Student Guides",
    description:
      "Read simple guides covering registration, documents, application mistakes, admit cards, results, and preparation.",
    href: "/blog",
  },
];

const steps = [
  {
    number: "01",
    title: "Find your exam",
    description:
      "Browse exam notifications, state-wise updates, results, registrations, or admit cards.",
  },
  {
    number: "02",
    title: "Read important details",
    description:
      "Check the organising body, release date, eligibility, deadlines, and instructions.",
  },
  {
    number: "03",
    title: "Open the direct link",
    description:
      "Use the provided link to reach the relevant application, result, or admit card page.",
  },
  {
    number: "04",
    title: "Verify officially",
    description:
      "Confirm important information on the official authority website before taking action.",
  },
];

export default function AboutPage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ExamNotify",
    description:
      "ExamNotify helps students find exam notifications, official links, application forms, admit cards, results, important dates, and simple exam guides.",
    founder: {
      "@type": "Person",
      name: "Shailendra Singh",
      jobTitle: "Founder of ExamNotify",
    },
  };

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About ExamNotify",
    description:
      "Learn about ExamNotify, its mission, services, values, and founder Shailendra Singh.",
    mainEntity: {
      "@type": "Organization",
      name: "ExamNotify",
      founder: {
        "@type": "Person",
        name: "Shailendra Singh",
      },
    },
  };

  return (
    <main className="overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative border-b border-slate-200 bg-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 via-white to-green-600" />

        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-red-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-green-100/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
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

              <span className="font-medium text-slate-700">About Us</span>
            </nav>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Helping students move forward
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Making exam information{" "}
              <span className="text-red-600">simple and accessible.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              ExamNotify is a student-focused platform created to help learners
              find exam notifications, registration links, admit cards,
              results, important dates, and easy-to-understand guides in one
              place.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/notifications/latest-jobs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Explore Exam Updates
                <ArrowIcon />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-green-600 px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Introduction card */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-red-100 via-white to-green-100 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
              <div className="flex items-center justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-2xl font-bold text-white shadow-sm">
                  E
                </span>

                <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  Student-focused platform
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Why ExamNotify exists
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Students often have to search through several websites to find
                application forms, exam dates, official notices, admit cards,
                and results. ExamNotify brings these important resources
                together in a simple and organised format.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <InfoBox label="Direct links" value="Easy access" color="red" />
                <InfoBox label="Exam guides" value="Simple steps" color="green" />
                <InfoBox label="State updates" value="One place" color="green" />
                <InfoBox label="Student help" value="Always first" color="red" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-red-600">
              Our Story
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built to reduce confusion around exam information
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              Preparing for an examination already requires time, discipline,
              and consistent effort. Finding the correct application link,
              notification, admit card, or result should not make that journey
              more difficult.
            </p>

            <p>
              ExamNotify was created to organise important examination
              information in a way that students can understand. The platform
              connects learners with useful updates and relevant links for
              government recruitment, entrance examinations, banking,
              railways, teaching, police recruitment, state-level exams, and
              other educational opportunities.
            </p>

            <p>
              We aim to provide a clear starting point. Students can discover
              an update, understand the basic information, and then continue to
              the relevant official website for final verification and action.
            </p>
          </div>
        </div>
      </section>

      {/* Mission and vision */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="relative overflow-hidden rounded-3xl border border-red-100 bg-red-50/50 p-7 sm:p-9">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-100/70" />

            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white">
                <TargetIcon />
              </span>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                Our Mission
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-600">
                Our mission is to help students access important exam
                information with less searching and less confusion. We want to
                make exam notifications, official links, registrations, admit
                cards, results, and guides easier to discover and understand.
              </p>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl border border-green-100 bg-green-50/50 p-7 sm:p-9">
            <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-green-100/70" />

            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white">
                <VisionIcon />
              </span>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                Our Vision
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-600">
                Our vision is to build a trusted student information platform
                where learners from different states and backgrounds can
                quickly find the examination resources they need to make
                informed decisions.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-slate-950 py-12 text-white sm:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-red-600/30 to-green-600/30 blur-xl" />

            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-red-600 to-green-600 shadow-2xl">
              <div className="text-center">
                <span className="text-7xl font-bold text-white sm:text-8xl">
                  SS
                </span>

                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                  Founder
                </p>
              </div>
            </div>
          </div>

          <div>
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-green-300">
              Meet the Founder
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Shailendra Singh
            </h2>

            <p className="mt-2 text-base font-semibold text-red-400">
              Founder of ExamNotify
            </p>

            <div className="mt-6 space-y-4 text-base leading-8 text-slate-300">
              <p>
                Shailendra Singh founded ExamNotify with the aim of making
                examination information easier for students to discover and
                understand.
              </p>

              <p>
                The idea behind the platform is simple: students should be able
                to find relevant exam updates, understand the next step, and
                reach the appropriate official resource without unnecessary
                confusion.
              </p>

              <p>
                Through ExamNotify, the focus remains on organised information,
                student-friendly guidance, direct links, and responsible
                verification through official examination authorities.
              </p>
            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5">
              <blockquote className="text-base italic leading-8 text-slate-200">
                “Our purpose is to make important exam information easier to
                find, easier to understand, and more useful for every student.”
              </blockquote>

              <p className="mt-3 text-sm font-semibold text-green-400">
                — Shailendra Singh, Founder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we provide */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-green-600">
              What We Provide
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Useful exam resources in one organised platform
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              ExamNotify connects students with important examination
              information through clear sections and direct navigation.
            </p>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service.title}
                className={`group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                  index % 2 === 0
                    ? "border-red-100 hover:border-red-300"
                    : "border-green-100 hover:border-green-300"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                    index % 2 === 0
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>

                <Link
                  href={service.href}
                  className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${
                    index % 2 === 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  Explore
                  <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-wider text-red-600">
              Our Values
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Principles that guide ExamNotify
            </h2>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${value.style}`}
                  >
                    <Icon />
                  </span>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {value.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-green-600">
              How ExamNotify Helps
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From notification to official action
            </h2>
          </div>

          <ol className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li
                key={step.number}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span
                  className={`text-sm font-bold ${
                    index % 2 === 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  STEP {step.number}
                </span>

                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust and disclaimer */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="rounded-3xl border border-green-100 bg-white p-7 shadow-sm sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <ShieldIcon />
            </span>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              Our commitment to students
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600">
              We aim to keep information structured, readable, and useful.
              When examination authorities change dates, eligibility
              conditions, vacancies, or procedures, the official notice should
              always be treated as the final source.
            </p>
          </article>

          <article className="rounded-3xl border border-red-100 bg-white p-7 shadow-sm sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <InformationIcon />
            </span>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              Important disclaimer
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600">
              ExamNotify is an independent information platform and is not a
              government examination authority. Students should verify
              eligibility, fees, deadlines, documents, and official links
              before submitting forms, attending exams, or making payments.
            </p>
          </article>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-center shadow-xl sm:px-10 sm:py-12">
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-green-600/20 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Find the exam information you need
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Browse the latest notifications, application links, admit cards,
              results, and student-friendly guides on ExamNotify.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/notifications/latest-jobs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Explore Notifications
                <ArrowIcon />
              </Link>

              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-xl border border-green-500 px-6 py-3 text-sm font-semibold text-green-400 transition hover:bg-green-500/10"
              >
                Read Exam Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageSchema).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}

type InfoBoxProps = {
  label: string;
  value: string;
  color: "red" | "green";
};

function InfoBox({ label, value, color }: InfoBoxProps) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        color === "red"
          ? "border-red-100 bg-red-50"
          : "border-green-100 bg-green-50"
      }`}
    >
      <p
        className={`text-sm font-bold ${
          color === "red" ? "text-red-600" : "text-green-700"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4 transition-transform group-hover:translate-x-1"
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

function StudentIcon() {
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
      <path d="m3 10 9-5 9 5-9 5Z" />
      <path d="M7 12v5c3 2 7 2 10 0v-5" />
    </svg>
  );
}

function DocumentIcon() {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}

function ShieldIcon() {
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
      <path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function GlobeIcon() {
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
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20" />
      <path d="M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}

function TargetIcon() {
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
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function VisionIcon() {
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
      <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="3" />
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

