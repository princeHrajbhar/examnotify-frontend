const faqs = [
  {
    question: "What is ExamNotify?",
    answer:
      "ExamNotify helps students find exam notifications, official application links, results, admit cards, important dates, and simple exam guides in one place.",
  },
  {
    question: "Are the exam links on ExamNotify official?",
    answer:
      "ExamNotify aims to provide direct links to official examination authority and government recruitment websites. Students should always verify important information on the official website before applying.",
  },
  {
    question: "How can I find the latest exam results?",
    answer:
      "Visit the Results section to find recently released government exam, entrance exam, board exam, and recruitment exam results with direct result links.",
  },
  {
    question: "Where can I download my admit card?",
    answer:
      "Open the Admit Card section, select your exam, and use the provided official link to download your admit card from the organising authority's website.",
  },
  {
    question: "How do I apply for an exam?",
    answer:
      "Go to the Registration section, choose the required exam notification, read the eligibility and important dates, and then use the official application link to complete your registration.",
  },
  {
    question: "Does ExamNotify provide state-wise exam notifications?",
    answer:
      "Yes. Students can browse state-wise government job notifications, public service commission exams, police recruitment, teaching vacancies, and other state-level examinations.",
  },
  {
    question: "What information is included in an exam notification?",
    answer:
      "An exam notification may include the organising body, release date, eligibility criteria, application dates, examination date, syllabus, admit card, result, and official website link.",
  },
  {
    question: "Is ExamNotify free for students?",
    answer:
      "Yes. Students can access exam notifications, direct links, important updates, and exam guides on ExamNotify without paying a fee.",
  },
];

export default function FAQ() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      className="bg-white py-10 sm:py-14"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700">
            Student Help
          </span>

          <h2
            id="faq-heading"
            className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Find answers about exam notifications, registration links, admit
            cards, results, and official examination websites.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm open:border-green-200 open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
                <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                  {faq.question}
                </h3>

                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    index % 2 === 0
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    className="h-4 w-4 transition-transform duration-200 group-open:rotate-45"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </span>
              </summary>

              <div className="border-t border-slate-100 px-5 py-4">
                <p className="text-sm leading-6 text-slate-600">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  );
}