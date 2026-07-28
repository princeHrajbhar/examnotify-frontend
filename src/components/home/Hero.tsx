import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-red-100 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-green-100 blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        {/* Content */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            Simple, reliable exam information
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Find exam links and guides{" "}
            <span className="text-red-600">without the confusion.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            ExamNotify helps students quickly access official application
            links, admit cards, results, important dates, and easy
            step-by-step exam guides.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/exams"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              Explore Exams

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
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-xl border border-green-600 px-6 py-3.5 text-sm font-semibold text-green-700 transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            >
              How It Works
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
            <Feature text="Official links" />
            <Feature text="Easy guides" />
            <Feature text="Latest updates" />
          </div>
        </div>

        {/* Visual card */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-red-100 via-white to-green-100 blur-xl" />

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Latest exam update
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Exam Information
                </h2>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Updated
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <ExamItem
                title="Application Form"
                description="Access the official application page."
                color="red"
              />

              <ExamItem
                title="Admit Card"
                description="Download your admit card directly."
                color="green"
              />

              <ExamItem
                title="Result"
                description="Check results from the official website."
                color="red"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-800">
                Need help applying?
              </p>

              <p className="mt-1 text-sm leading-6 text-green-700">
                Follow our simple step-by-step guide and complete your
                application correctly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-red-600 via-white to-green-600" />
    </section>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      </span>

      {text}
    </span>
  );
}

type ExamItemProps = {
  title: string;
  description: string;
  color: "red" | "green";
};

function ExamItem({ title, description, color }: ExamItemProps) {
  const iconClasses =
    color === "red"
      ? "bg-red-100 text-red-600"
      : "bg-green-100 text-green-600";

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-slate-200 hover:shadow-sm">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClasses}`}
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h6" />
        </svg>
      </span>

      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}