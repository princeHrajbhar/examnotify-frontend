"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  CodeBracketIcon,
  CurrencyRupeeIcon,
  PresentationChartLineIcon,
  RocketLaunchIcon,
  SparklesIcon,
  TrophyIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  LightBulbIcon,
  ShieldCheckIcon,
  StarIcon,
  XMarkIcon,
  BoltIcon,
  BookOpenIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

// ============================================================
// DATA (sourced from the CareerX brochure)
// ============================================================

const APPLY_HREF = "/contact-us";

const heroStats = [
  { value: "16", label: "Weeks of Learning" },
  { value: "8", label: "Weeks of Interview Prep" },
  { value: "8", label: "Weeks of Placement Support" },
];

const marketStats = [
  { icon: ArrowTrendingUpIcon, value: "27%", label: "YoY growth in India's analytics market" },
  { icon: BriefcaseIcon, value: "2.3L+", label: "Analyst roles opening every year" },
  { icon: CurrencyRupeeIcon, value: "₹15.4 LPA", label: "Average fresher salary" },
  { icon: ChartBarIcon, value: "High", label: "Entry-level analyst demand" },
];

const rolesEnabled = [
  { name: "Data Analyst", icon: ChartBarIcon },
  { name: "Business Analyst", icon: BriefcaseIcon },
  { name: "Reporting Analyst", icon: PresentationChartLineIcon },
  { name: "Marketing Analyst", icon: ArrowTrendingUpIcon },
  { name: "Junior Data Scientist", icon: BeakerIcon },
  { name: "Applied Analytics", icon: CodeBracketIcon },
  { name: "ML Analyst", icon: BoltIcon },
];

const accreditations = [
  { icon: BuildingOffice2Icon, title: "Government-recognized", detail: "Accredited learning & career ecosystem" },
  { icon: TrophyIcon, title: "Times of India", detail: "Top 16 Icons of Change & Impact" },
  { icon: AcademicCapIcon, title: "IIT Bombay - SJMSoM", detail: "AI Training Provider of the Year" },
  { icon: StarIcon, title: "India Business Award", detail: "Best Idea in Ed-tech by Blindwink" },
];

const employerWants = [
  "Strong data & business fundamentals",
  "Advanced Excel & SQL skills",
  "BI dashboards & data storytelling",
  "Python for analytics & automation",
  "Statistics & ML basics",
  "Real-world project experience",
  "Communication & interview readiness",
  "Job-ready portfolio & proof of work",
  "Hiring support & accountability",
];

const careerxDelivers = [
  "Decision-focused analytics foundation",
  "Excel, Google Sheets automation & job-level SQL",
  "Power BI & Tableau with executive-ready insights",
  "Python, Pandas, NumPy & visualization",
  "Statistics, ML fundamentals & model evaluation",
  "Dual capstones: Analytics + Data Science",
  "Storytelling labs, mocks & interview prep",
  "Dashboards, notebooks & ML projects",
  "Placement badge, interviews & support till joining",
];

const admissionSteps = [
  "Screening test",
  "1:1 interview",
  "Admission letter",
  "Enrollment",
  "Training",
  "Get placed",
];

const phases = [
  {
    id: "phase1",
    label: "Phase 1",
    weeks: "16 Weeks",
    title: "Learning & Capability Building",
    outcome: "Technical Readiness + Portfolio",
    icon: BookOpenIcon,
    modules: [
      {
        name: "Data Analytics Foundations",
        window: "Weeks 1–2 · Business Decision-Making",
        points: [
          "Excel: advanced formulas, pivots, reporting automation",
          "SQL fundamentals: queries, joins, subqueries, CASE logic",
          "Google Sheets: Apps Script & automation",
        ],
        outcome: "Interactive dashboards & decision-ready business stories",
      },
      {
        name: "Analytics Tools Mastery",
        window: "Weeks 3–4 · Visualization & BI",
        points: [
          "Power BI: interactive dashboards & DAX",
          "Tableau: data storytelling & visualization",
          "Enterprise data: Teradata, metadata concepts",
        ],
        outcome: "Executive-ready data narratives & BI reports",
      },
      {
        name: "Python for Analytics",
        window: "Weeks 5–8 · Programming & EDA",
        points: [
          "Python basics: Jupyter, Pandas, NumPy",
          "Exploratory data analysis: profiling & insights",
          "Statistics: probability, distributions, hypothesis testing",
        ],
        outcome: "Programmatic insights & statistical thinking",
      },
      {
        name: "Machine Learning Fundamentals",
        window: "Weeks 9–12 · Predictive Modeling",
        points: [
          "ML basics: supervised & unsupervised learning",
          "Classification: decision trees, random forests, SVM",
          "Regression & clustering: linear, logistic, K-means",
        ],
        outcome: "Core ML concepts & model validation skills",
      },
      {
        name: "Advanced Machine Learning",
        window: "Weeks 17–20 · Ensemble & Optimization",
        points: [
          "Ensemble methods: bagging, boosting, stacking",
          "Model tuning: hyperparameters, cross-validation",
          "Neural networks & time series forecasting (ARIMA)",
        ],
        outcome: "Production-ready ML models",
      },
      {
        name: "Dual Capstone Projects",
        window: "Weeks 21–24 · Analytics + Data Science",
        points: [
          "Analytics capstone: dashboard, insight report, narration",
          "Data Science capstone: feature engineering, model training",
          "Domains: FinTech risk, e-commerce, churn, forecasting",
        ],
        outcome: "Interview-ready portfolio with two capstones",
      },
    ],
  },
  {
    id: "phase2",
    label: "Phase 2",
    weeks: "8 Weeks",
    title: "Career Readiness & Interview Prep",
    outcome: "Placement Ready Badge",
    icon: ChatBubbleLeftRightIcon,
    modules: [
      {
        name: "Business English & Communication",
        window: "Professional presence",
        points: [
          "Business English & vocabulary building",
          "Email & workplace etiquette",
          "Presentation, public speaking & body language",
        ],
        outcome: "Communicate like a corporate professional",
      },
      {
        name: "Interview Preparation",
        window: "What recruiters actually test",
        points: [
          "SQL, Python, Statistics & ML revision",
          "Real-world business problem solving",
          "Technical + HR & behavioral round practice",
        ],
        outcome: "Structured, confident interview performance",
      },
      {
        name: "Mock Interviews",
        window: "Real interview environments",
        points: [
          "Panel-style technical + HR mocks",
          "Performance evaluation framework",
          "Personalized feedback & improvement roadmap",
        ],
        outcome: "Benchmarked, feedback-driven readiness",
      },
      {
        name: "Resume, LinkedIn & Portfolio",
        window: "Professional identity",
        points: [
          "ATS-optimized resume creation",
          "LinkedIn profile optimization",
          "Portfolio structuring & personal branding",
        ],
        outcome: "A profile that stands out to recruiters",
      },
    ],
  },
  {
    id: "phase3",
    label: "Phase 3",
    weeks: "8 Weeks",
    title: "Placement Support Until Joining",
    outcome: "Employability + Job Conversion",
    icon: RocketLaunchIcon,
    modules: [
      {
        name: "Guaranteed Interview Opportunities",
        window: "Minimum 5 assured interviews",
        points: [
          "Role alignment based on skill assessment",
          "Interview scheduling & coordination support",
          "Preparation before every scheduled round",
        ],
        outcome: "Real interview exposure",
      },
      {
        name: "Hiring Partner Pipeline",
        window: "Analytics & Data Science",
        points: [
          "Exclusive employer network access",
          "Startup to enterprise-level opportunities",
          "Role matching based on specialization",
        ],
        outcome: "Direct hiring pipelines, not job portals",
      },
      {
        name: "Dedicated Talent Success Manager",
        window: "Your personal career partner",
        points: [
          "1:1 career guidance sessions",
          "Offer negotiation & decision support",
          "Post-interview performance analysis",
        ],
        outcome: "Guidance until joining confirmation",
      },
      {
        name: "Continuous Improvement Support",
        window: "We refine until you convert",
        points: [
          "Skill gap identification & rapid improvement",
          "Ongoing support until job joining",
          "Continuous feedback loops",
        ],
        outcome: "Support that stays until you join",
      },
    ],
  },
];

const audience = [
  { icon: AcademicCapIcon, text: "A final-year student aiming for analytics roles in 6–9 months" },
  { icon: ArrowTrendingUpIcon, text: "A non-CS graduate transitioning into data roles" },
  { icon: BriefcaseIcon, text: "A working professional (0-3 yrs) stuck in low-growth roles" },
  { icon: ShieldCheckIcon, text: "Someone who wants placement accountability, not just certificates" },
];

const salaryRoles = [
  { role: "Data Analyst", range: "₹4.5-9.5", companies: "FinTech, SaaS, EdTech startups", portfolio: "Analytics dashboards" },
  { role: "Business Analyst", range: "₹5-10.5", companies: "Consulting, product firms", portfolio: "Business case studies" },
  { role: "Marketing Analyst", range: "₹4-9", companies: "D2C brands, agencies", portfolio: "Marketing analytics" },
  { role: "Junior Data Scientist", range: "₹6-14", companies: "Product, AI-first firms", portfolio: "Predictive ML project" },
  { role: "Applied Data Scientist", range: "₹7-16", companies: "SaaS, FinTech, AI startups", portfolio: "End-to-end DS capstone" },
];

const growthPath = [
  { year: "Year 1", role: "Data Analyst", pay: "₹4.5-9.5L" },
  { year: "Year 2-3", role: "Senior Analyst", pay: "₹8-14L" },
  { year: "Year 4-5", role: "Data Scientist", pay: "₹12-25L" },
];

const tsmSupport = [
  { icon: ChartBarIcon, title: "Progress Tracking", detail: "Monitors readiness & identifies improvement areas" },
  { icon: BriefcaseIcon, title: "Minimum 5 Interviews", detail: "Guaranteed opportunities for eligible learners" },
  { icon: BuildingOffice2Icon, title: "Verified Recruiters", detail: "Direct pipelines with 100+ partner companies" },
  { icon: BoltIcon, title: "Coaching & Feedback", detail: "Continuous improvement & mock interview prep" },
  { icon: ClockIcon, title: "Interview Scheduling", detail: "Coordinates rounds with verified hiring partners" },
  { icon: ChatBubbleLeftRightIcon, title: "Recruiter Communication", detail: "Manages employer interactions & negotiations" },
];

const comparison = [
  { us: "Career transformation model - skill mastery, readiness & placement until joining", them: "Course-centric approach focused on syllabus completion" },
  { us: "Analytics → Data Science progression with a clear path", them: "Analytics & Data Science taught in isolation" },
  { us: "Hands-on, outcome-driven weekly deliverables", them: "Theory-heavy sessions with fewer real projects" },
  { us: "Two mandatory capstones built for interview discussions", them: "Optional, generic capstones" },
  { us: "Career readiness system: communication, resume & LinkedIn", them: "Basic resume sessions without structured feedback" },
  { us: "Minimum 5 guaranteed interviews with TSM support", them: "Job portals or referrals, no guaranteed interviews" },
];

const testimonials = [
  {
    quote:
      "The hands-on approach and real-time project feedback made all the difference. I could confidently discuss my portfolio in interviews.",
    author: "CareerX Alumni",
    role: "Placed at a FinTech Startup",
  },
  {
    quote:
      "The Talent Success Manager support made a real difference. From interview scheduling to feedback, I always knew what to improve and how to move forward.",
    author: "CareerX Graduate",
    role: "Data Analytics",
  },
];

const tools = ["Excel", "SQL", "Python", "Power BI", "Tableau", "Scikit-learn", "Pandas", "NumPy"];

// ============================================================
// SMALL PRESENTATION HELPERS
// ============================================================

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <span
          className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
            light ? "bg-white/15 text-white" : "bg-brand-start-soft text-brand-start"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base sm:text-lg ${light ? "text-white/80" : "text-slate-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function CareerXPage() {
  // Accordion: which phase (0, 1, 2) is currently expanded. null = all collapsed.
  const [openPhase, setOpenPhase] = useState<number | null>(null);

  const heroStatItems = [
    { icon: BookOpenIcon, value: heroStats[0].value, label: heroStats[0].label },
    { icon: ChatBubbleLeftRightIcon, value: heroStats[1].value, label: heroStats[1].label },
    { icon: RocketLaunchIcon, value: heroStats[2].value, label: heroStats[2].label },
  ];

  return (
    <div className="bg-white">
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#016ab7] via-[#0158a0] to-[#013b6b]">
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[var(--color-brand-end)]/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">

            {/* ── Left: message ── */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[white] ring-1 ring-white/25">
                <SparklesIcon className="h-4 w-4" />
                Powered by Shiksha Nation
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-5xl xl:text-6xl">
                Transform your {" "}
                <span className="text-[var(--color-brand-end)]">career in 32 weeks</span>
              </h1>
              <p className="mt-5 text-lg text-white/85 sm:text-xl">
                From analyst to data scientist. From learner to earner. CareerX is not a course -
                it&apos;s a career transformation system that stays with you until you&apos;re truly
                job-ready.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  href={APPLY_HREF}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-[#016ab7] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Apply Now
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <a
                  href="#curriculum"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-8 py-3.5 text-sm font-semibold text-[white] ring-1 ring-inset ring-white/30 transition-all hover:bg-white/20"
                >
                  View Curriculum
                </a>
              </div>
            </div>

            {/* ── Right: stats, vertical timeline style ── */}
            <div className="relative mx-auto w-full max-w-md">
              {/* Connecting vertical line — anchored at the same left-6 as the dots below */}
              <div
                className="absolute left-6 top-6 bottom-6 w-px -translate-x-1/2 bg-white/40"
                aria-hidden="true"
              />

              <div className="relative flex flex-col gap-6">
                {heroStatItems.map((s) => (
                  <div key={s.label} className="relative pl-14">
                    {/* Node dot — same left-6 anchor as the line, so it always sits centered on it */}
                    <div className="absolute left-6 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-brand-end)] shadow-[0_0_0_4px_rgba(108,184,77,0.3)]" />

                    <div className="group flex items-center gap-4 rounded-2xl bg-white/10 p-5 ring-1 ring-inset ring-white/20 backdrop-blur-sm transition-all hover:bg-white/15">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25">
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-3xl font-extrabold text-[var(--color-brand-end)] leading-none">
                          {s.value}
                        </div>
                        <div className="mt-1 text-xs font-medium text-white/75">{s.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== WHAT IS CAREERX ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What is CareerX?"
          title={
            <>
              CareerX is <span className="text-[var(--color-brand-end)]">career in 32 weeks</span>
            </>
          }
          subtitle="It's a career transformation system that ensures skill mastery, real-world application, communication confidence, interview readiness, and job conversion - from learning to interviews, we stay with you until you're truly job-ready."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {marketStats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <s.icon className="h-8 w-8 flex-shrink-0 text-brand-start" />
                <div className="text-3xl font-bold text-slate-900">{s.value}</div>
              </div>
              <div className="mt-2 text-sm text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Roles CareerX prepares you for — compact, single-line chips, blue icon */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-slate-900">Roles CareerX prepares you for</h3>
          <p className="mt-1 max-w-4xl text-sm text-slate-800">
            India&apos;s fastest-growing analytics market - companies across FinTech, SaaS, E-commerce
            and Consulting are hiring aggressively.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {rolesEnabled.map((r) => (
              <span
                key={r.name}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-2 pr-3.5 text-xs font-medium text-slate-700 transition-colors hover:border-brand-start/40 hover:bg-white"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-start-soft">
                  <r.icon className="h-3 w-3 text-brand-start" />
                </span>
                {r.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ECOSYSTEM / ACCREDITATION ==================== */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Skillo Ecosystem"
            title="A government-recognized career transformation ecosystem"
            subtitle="Rooted in practitioner-led learning, real-world projects and continuous mentorship - trusted by professionals from leading companies and students from India's top institutions."
          />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {accreditations.map((a) => (
              <div key={a.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-start-soft">
                    <a.icon className="h-6 w-6 text-brand-start" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{a.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== EMPLOYERS WANT vs CAREERX DELIVERS ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Built for hiring"
          title="What employers want, what CareerX delivers"
          subtitle="Every expectation recruiters have is mapped to a concrete outcome in the program."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <UserGroupIcon className="h-6 w-6 text-slate-400" />
              What Employers Want
            </h3>
            <ul className="mt-6 space-y-3">
              {employerWants.map((w) => (
                <li key={w} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-brand-start/20 bg-brand-gradient-soft p-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <CheckBadgeIcon className="h-6 w-6 text-brand-start" />
              What CareerX Delivers
            </h3>
            <ul className="mt-6 space-y-3">
              {careerxDelivers.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-end" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Journey */}
        <div className="mt-12">
          <h3 className="text-center text-lg font-semibold text-slate-900">Your journey with CareerX</h3>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {admissionSteps.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-start text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  {step}
                </div>
                {i < admissionSteps.length - 1 && (
                  <ArrowRightIcon className="hidden h-4 w-4 text-slate-300 sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PROGRAM ARCHITECTURE / CURRICULUM ==================== */}
      <section id="curriculum" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="32-Week Program"
            title="A three-phase transformation journey"
            subtitle="16 weeks of learning, 8 weeks of career readiness, and 8 weeks of placement support until joining. Tap a phase to see what's inside."
          />

          {/* Accordion: each phase hidden until clicked */}
          <div className="mt-12 space-y-4">
            {phases.map((p, i) => {
              const isOpen = openPhase === i;
              return (
                <div
                  key={p.id}
                  className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                    isOpen ? "border-brand-start shadow-md" : "border-slate-200 shadow-sm"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenPhase(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`${p.id}-panel`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                          isOpen ? "bg-brand-start text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <p.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{p.label}</span>
                          <span className="rounded-full bg-brand-start-soft px-2 py-0.5 text-[11px] font-semibold text-brand-start">
                            {p.weeks}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">{p.title}</div>
                      </div>
                    </div>

                    {/* Expand/collapse signal */}
                    <ChevronDownIcon
                      className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-brand-start" : ""
                      }`}
                    />
                  </button>

                  {/* Collapsible panel — CSS grid trick for smooth height animation */}
                  <div
                    id={`${p.id}-panel`}
                    className="grid transition-all duration-300 ease-in-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-slate-100 p-5">
                        <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl bg-brand-gradient p-5 text-white sm:flex-row sm:items-center">
                          <div className="text-sm font-medium text-white/80">Outcome</div>
                          <div className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-white/25">
                            <TrophyIcon className="h-5 w-5" />
                            {p.outcome}
                          </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                          {p.modules.map((m) => (
                            <div
                              key={m.name}
                              className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6"
                            >
                              <div className="text-xs font-semibold uppercase tracking-wide text-brand-start">
                                {m.window}
                              </div>
                              <h4 className="mt-2 font-bold text-slate-900">{m.name}</h4>
                              <ul className="mt-4 flex-1 space-y-2.5">
                                {m.points.map((pt) => (
                                  <li key={pt} className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-end" />
                                    {pt}
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-4 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-500">
                                Outcome: {m.outcome}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tools + methodology */}
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <CodeBracketIcon className="h-6 w-6 text-brand-start" />
                Tools you&apos;ll master
              </h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <BeakerIcon className="h-6 w-6 text-brand-start" />
                Learning methodology
              </h3>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {[
                  "Live online sessions (not recorded)",
                  "Hands-on projects every week",
                  "Real-world case studies",
                  "Weekly assessments & feedback",
                ].map((m) => (
                  <li key={m} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-end" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHO IS THIS FOR ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Is this you?" title="Who is this program for?" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audience.map((a) => (
            <div
              key={a.text}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-start-soft">
                <a.icon className="h-6 w-6 text-brand-start" />
              </div>
              <p className="text-sm text-slate-700">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== OUTCOMES / SALARY ==================== */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Return on investment"
            title="Career outcomes & salary ranges"
            subtitle="Transform your earning potential with a proven analyst-to-data-scientist progression."
          />

          <div className="mt-14 overflow-x-auto">
            <div className="grid min-w-[720px] grid-cols-5 gap-4 lg:min-w-0">
              {salaryRoles.map((r) => (
                <div key={r.role} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <PresentationChartLineIcon className="h-7 w-7 flex-shrink-0 text-brand-start" />
                    <h4 className="text-sm font-bold text-slate-900">{r.role}</h4>
                  </div>
                  <div className="mt-3 text-2xl font-extrabold text-brand-start">
                    {r.range}
                    <span className="ml-1 text-xs font-medium text-slate-400">LPA</span>
                  </div>
                  <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <div className="font-medium text-slate-600">{r.companies}</div>
                    <div className="mt-1">Portfolio: {r.portfolio}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth path */}
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <ArrowTrendingUpIcon className="h-6 w-6 text-brand-start" />
              Career growth path
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {growthPath.map((g, i) => (
                <div key={g.year} className="relative rounded-xl bg-brand-gradient-soft p-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-brand-start">
                    {g.year}
                  </div>
                  <div className="mt-1 font-bold text-slate-900">{g.role}</div>
                  <div className="mt-1 text-lg font-extrabold text-slate-900">{g.pay}</div>
                  {i < growthPath.length - 1 && (
                    <ArrowRightIcon className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-brand-start sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PLACEMENT GUARANTEE / TSM ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Placement Engine"
          title="100% placement assistance until joining"
          subtitle="Every learner is assigned a dedicated Talent Success Manager (TSM) - your personal career partner throughout the placement journey."
        />

        {/* Placement Assistance / Guaranteed Interviews / Partner Companies — solid blue blocks */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          {[
            { value: "100%", label: "Placement Assistance" },
            { value: "5+", label: "Guaranteed Interviews" },
            { value: "100+", label: "Partner Companies" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-[#016ab7] p-6 text-white">
              <div className="text-3xl font-extrabold sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs text-white/80 sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* TSM support cards — icon beside heading, subheading below */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tsmSupport.map((t) => (
            <div key={t.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-start-soft">
                  <t.icon className="h-5 w-5 text-brand-start" />
                </div>
                <h4 className="font-semibold text-slate-900">{t.title}</h4>
              </div>
              <p className="mt-3 text-sm text-slate-600">{t.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== COMPARISON ==================== */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The CareerX Advantage"
            title="Why CareerX vs other institutes"
            subtitle="We stay with the learner until they are job-ready - that's not just a promise, it's our accountability."
          />
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 p-4 text-sm font-bold text-brand-start">
                <CheckBadgeIcon className="h-5 w-5" />
                CareerX
              </div>
              <div className="flex items-center gap-2 p-4 text-sm font-bold text-slate-500">
                <XMarkIcon className="h-5 w-5" />
                Other Institutes
              </div>
            </div>
            {comparison.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-2 divide-x divide-slate-200 ${
                  i < comparison.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className="flex items-start gap-2 p-4 text-sm text-slate-700">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-end" />
                  {row.us}
                </div>
                <div className="flex items-start gap-2 p-4 text-sm text-slate-500">
                  <XMarkIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-300" />
                  {row.them}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What our learners say"
          title="A credential that signals readiness"
          subtitle="Every CareerX graduate receives a Certificate of Completion recognising verified skill development and placement readiness."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure key={t.author} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex gap-1 text-brand-end">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-slate-700">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient font-bold text-white">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.author}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#016ab7] via-[#0158a0] to-[#013b6b]">
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-white/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <LightBulbIcon className="mx-auto h-12 w-12 text-yellow-400" />
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to transform your career?
          </h2>
          <p className="mt-4 whitespace-nowrap text-base text-white/85 sm:text-lg">
            Join India&apos;s smartest 5% and fast-track your career in Data Analytics & Data Science.
          </p>
          <p className="mt-2 text-sm font-medium uppercase tracking-wider text-white/70">
            Applications Open · February Cohort · Limited Seats
          </p>
          <div className="mt-9">
            <Link
              href={APPLY_HREF}
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-10 py-4 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-xl"
            >
              Apply Now
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}