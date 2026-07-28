import Link from "next/link";

const examServices = [
  {
    title: "Latest Exam Notifications",
    description:
      "Discover newly released government exam and recruitment notifications with application dates, eligibility details, vacancies, and official links.",
    href: "/notifications/latest-jobs",
    linkLabel: "View latest notifications",
  },
  {
    title: "Online Registration Forms",
    description:
      "Find direct registration links for government jobs, entrance examinations, banking exams, railway recruitment, teaching exams, and state-level vacancies.",
    href: "/registration",
    linkLabel: "Browse registration forms",
  },
  {
    title: "Admit Card Updates",
    description:
      "Access admit card release updates, examination dates, reporting instructions, and direct download pages provided by the organising authority.",
    href: "/admit-card",
    linkLabel: "Download admit cards",
  },
  {
    title: "Exam Results",
    description:
      "Check recently declared results, merit lists, scorecards, qualification status, and result notices for competitive and entrance examinations.",
    href: "/results",
    linkLabel: "Check exam results",
  },
  {
    title: "Answer Keys",
    description:
      "Find provisional and final answer keys, objection dates, response sheets, and related updates published by examination authorities.",
    href: "/notifications/answer-keys",
    linkLabel: "View answer keys",
  },
  {
    title: "Exam Syllabus and Guides",
    description:
      "Understand exam patterns, syllabus topics, important instructions, application steps, and document requirements through simple student-friendly guides.",
    href: "/blog",
    linkLabel: "Read exam guides",
  },
];

const examCategories = [
  {
    label: "SSC Exams",
    href: "/exams/ssc",
  },
  {
    label: "Railway Exams",
    href: "/exams/railway",
  },
  {
    label: "Banking Exams",
    href: "/exams/banking",
  },
  {
    label: "UPSC Exams",
    href: "/exams/upsc",
  },
  {
    label: "Defence Exams",
    href: "/exams/defence",
  },
  {
    label: "Police Exams",
    href: "/exams/police",
  },
  {
    label: "Teaching Exams",
    href: "/exams/teaching",
  },
  {
    label: "Engineering Exams",
    href: "/exams/engineering",
  },
  {
    label: "Medical Exams",
    href: "/exams/medical",
  },
  {
    label: "Entrance Exams",
    href: "/exams/entrance",
  },
  {
    label: "State PSC Exams",
    href: "/exams/state-psc",
  },
  {
    label: "Board Exams",
    href: "/exams/board",
  },
];

const popularStates = [
  {
    label: "Uttar Pradesh",
    href: "/notifications/state/uttar-pradesh",
  },
  {
    label: "Bihar",
    href: "/notifications/state/bihar",
  },
  {
    label: "Rajasthan",
    href: "/notifications/state/rajasthan",
  },
  {
    label: "Madhya Pradesh",
    href: "/notifications/state/madhya-pradesh",
  },
  {
    label: "Maharashtra",
    href: "/notifications/state/maharashtra",
  },
  {
    label: "Delhi",
    href: "/notifications/state/delhi",
  },
  {
    label: "Haryana",
    href: "/notifications/state/haryana",
  },
  {
    label: "Punjab",
    href: "/notifications/state/punjab",
  },
  {
    label: "Gujarat",
    href: "/notifications/state/gujarat",
  },
  {
    label: "West Bengal",
    href: "/notifications/state/west-bengal",
  },
  {
    label: "Odisha",
    href: "/notifications/state/odisha",
  },
  {
    label: "Jharkhand",
    href: "/notifications/state/jharkhand",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Choose an exam update",
    description:
      "Browse results, application forms, admit cards, answer keys, exam dates, or state-wise notifications.",
  },
  {
    number: "02",
    title: "Read the important information",
    description:
      "Review the organising body, release date, eligibility, deadline, required documents, and other instructions.",
  },
  {
    number: "03",
    title: "Open the direct link",
    description:
      "Use the provided link to visit the relevant registration, result, admit card, or official notification page.",
  },
  {
    number: "04",
    title: "Verify before taking action",
    description:
      "Confirm important details on the official examination authority website before submitting forms or making payments.",
  },
];

export default function SEOContent() {
  return (
    <section
      className="border-t border-slate-200 bg-white py-12 sm:py-16"
      aria-labelledby="seo-content-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-600">
            Exam Information for Students
          </span>

          <h2
            id="seo-content-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            Latest Exam Notifications, Direct Links and Student Guides
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            ExamNotify is designed to help students find important examination
            information without searching across multiple websites. You can
            explore the latest exam notifications, online application forms,
            admit cards, results, answer keys, exam dates, syllabus updates,
            and simple guides from one place.
          </p>
        </div>

        {/* Main descriptive content */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-900">
              Find Important Exam Updates in One Place
            </h3>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Students preparing for government jobs, competitive
              examinations, entrance tests, board examinations, banking
              recruitment, railway vacancies, teaching positions, police
              recruitment, and public service commission exams often need to
              visit several websites to find accurate information. ExamNotify
              brings useful exam-related links and updates together in an
              organised and easy-to-understand format.
            </p>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Our goal is to make it easier for students to discover relevant
              notifications and understand what action they need to take. Each
              listing can include the exam name, organising body, notification
              date, application deadline, admit card information, result
              status, and a link to the relevant page.
            </p>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Whether you are looking for a new application form, checking an
              examination result, downloading an admit card, or reading a
              step-by-step registration guide, ExamNotify helps you reach the
              required information quickly.
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="mt-14">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Exam Information Available on ExamNotify
            </h3>

            <p className="mt-3 text-base leading-7 text-slate-600">
              Browse important examination services and student resources
              through clearly organised sections.
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {examServices.map((service, index) => (
              <article
                key={service.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
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

                <h4 className="mt-4 text-lg font-bold text-slate-900">
                  {service.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>

                <Link
                  href={service.href}
                  className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${
                    index % 2 === 0
                      ? "text-red-600 hover:text-red-700"
                      : "text-green-600 hover:text-green-700"
                  }`}
                >
                  {service.linkLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-red-100 bg-red-50/40 p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Browse Exams by Category
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Explore notifications based on the type of examination or
              recruitment you are preparing for.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {examCategories.map((category) => (
                <Link
                  key={category.label}
                  href={category.href}
                  className="rounded-lg border border-red-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-red-300 hover:text-red-600"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-green-100 bg-green-50/40 p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Browse State-Wise Exam Notifications
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Find state government jobs, public service commission exams,
              police recruitment, teaching vacancies, and other state-level
              updates.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {popularStates.map((state) => (
                <Link
                  key={state.label}
                  href={state.href}
                  className="rounded-lg border border-green-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-green-300 hover:text-green-600"
                >
                  {state.label}
                </Link>
              ))}
            </div>
          </article>
        </div>

        {/* Results */}
        <div className="mt-14">
          <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Latest Government Exam Results
          </h3>

          <div className="mt-4 space-y-4 text-base leading-8 text-slate-600">
            <p>
              The{" "}
              <Link
                href="/results"
                className="font-semibold text-red-600 hover:text-red-700"
              >
                exam results section
              </Link>{" "}
              helps students find recently announced results, scorecards,
              merit lists, selection lists, and qualification notices.
              Results may be released by organisations such as the Staff
              Selection Commission, Railway Recruitment Boards, banking
              recruitment authorities, state public service commissions, and
              educational boards.
            </p>

            <p>
              Students should keep their registration number, roll number,
              date of birth, password, or other login details ready before
              opening a result page. The required information may differ
              depending on the examination authority.
            </p>
          </div>
        </div>

        {/* Registration */}
        <div className="mt-12 rounded-2xl border-l-4 border-green-600 bg-green-50/50 p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-slate-900">
            Online Exam Registration and Application Forms
          </h3>

          <div className="mt-4 space-y-4 text-base leading-8 text-slate-600">
            <p>
              The{" "}
              <Link
                href="/registration"
                className="font-semibold text-green-700 hover:text-green-800"
              >
                registration section
              </Link>{" "}
              contains links for active examination forms and recruitment
              applications. Before submitting an application, students should
              carefully check educational qualifications, age limits,
              reservation rules, application fees, required documents, and
              submission deadlines.
            </p>

            <p>
              Applicants should enter their details exactly as shown on their
              official documents. They should also save their application
              number, payment receipt, submitted form, and confirmation page
              for future reference.
            </p>
          </div>
        </div>

        {/* Admit cards */}
        <div className="mt-12 rounded-2xl border-l-4 border-red-600 bg-red-50/50 p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-slate-900">
            Admit Card and Exam Date Information
          </h3>

          <div className="mt-4 space-y-4 text-base leading-8 text-slate-600">
            <p>
              Admit cards usually contain the examination date, reporting
              time, examination centre, candidate details, and important
              instructions. Visit the{" "}
              <Link
                href="/admit-card"
                className="font-semibold text-red-600 hover:text-red-700"
              >
                admit card section
              </Link>{" "}
              to find available download links and related notices.
            </p>

            <p>
              Students should check all details printed on the admit card and
              follow the instructions issued by the examination authority.
              They may also need to carry a printed admit card, valid photo
              identification, passport-size photographs, or other specified
              documents.
            </p>
          </div>
        </div>

        {/* Process */}
        <div className="mt-14">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              How to Use ExamNotify
            </h3>

            <p className="mt-3 text-base leading-7 text-slate-600">
              Follow these simple steps to find the examination information
              you need.
            </p>
          </div>

          <ol className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <li
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span
                  className={`text-sm font-bold ${
                    index % 2 === 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  STEP {step.number}
                </span>

                <h4 className="mt-3 text-base font-bold text-slate-900">
                  {step.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Guides */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <article>
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Simple Exam Guides for Students
            </h3>

            <div className="mt-4 space-y-4 text-base leading-8 text-slate-600">
              <p>
                Some official notifications can be long and difficult to
                understand. ExamNotify guides are intended to explain
                important details in a simpler format. A guide may cover
                eligibility, application steps, document requirements, fee
                payment, correction windows, selection procedures, syllabus,
                exam patterns, and important instructions.
              </p>

              <p>
                These guides can help students understand the process, but the
                official notification remains the final source of information.
                Always compare important details with the notice published by
                the organising authority.
              </p>

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Read exam guides
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>

          <aside className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
            <h3 className="text-xl font-bold">
              Important Student Reminder
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              Never share passwords, one-time passwords, banking details, or
              sensitive documents with unknown people. Submit applications
              and payments only through trusted official portals.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              Save copies of your submitted forms, payment receipts, admit
              cards, and important notices until the recruitment or admission
              process is complete.
            </p>
          </aside>
        </div>

        {/* Accuracy and disclaimer */}
        <div className="mt-14 border-t border-slate-200 pt-10">
          <h3 className="text-2xl font-bold text-slate-900">
            Accuracy, Official Sources and Verification
          </h3>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
            <p>
              ExamNotify aims to present useful examination information and
              relevant links in an accessible format. Examination schedules,
              application deadlines, eligibility conditions, vacancies, fees,
              and result dates may be changed by the organising authority.
            </p>

            <p>
              Students should verify important details on the official
              examination or recruitment website before submitting an
              application, downloading a document, attending an examination,
              or making a payment. ExamNotify is an information platform and
              is not an official government examination authority.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Report incorrect information
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-lg border border-green-600 px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
            >
              Learn more about ExamNotify
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}