import Link from "next/link";

export default function ExamCTA() {
  return (
    <section className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-red-100 bg-white shadow-lg">
        <div className="h-1.5 bg-gradient-to-r from-red-600 via-white to-green-600" />

        <div className="px-6 py-10 text-center sm:px-10">
          <span className="inline-flex rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
            Exam links and simple guides
          </span>

          <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            Find the right exam information quickly
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Get official links, important updates, and easy exam guides in one
            place.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/exams"
              className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Explore Exams
            </Link>

            <Link
              href="/about"
              className="rounded-lg border border-green-600 px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}