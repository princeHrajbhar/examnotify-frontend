"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    id: 1,
    question: "What career skills are most in demand right now for data and marketing roles?",
    answer:
      "Employers are consistently looking for practical ability with Python and SQL for data roles, and hands-on experience with SEO, paid advertising, and social media platforms for marketing roles. Increasingly, familiarity with AI and automation tools is expected across both fields, not treated as a separate specialization.",
  },
  {
    id: 2,
    question: "Do I need a technical or marketing background to start?",
    answer:
      "No. The courses are structured to build foundational skills first, so learners coming from unrelated fields can follow along, while those with some prior exposure can move through the fundamentals more quickly and spend more time on applied projects.",
  },
  {
    id: 3,
    question: "Will I work on real projects, or is this just theory?",
    answer:
      "The curriculum is built around applied, scenario-based work, for example, querying real datasets, building dashboards, or setting up sample ad campaigns, rather than purely theoretical instruction, so you finish with practical experience and portfolio material.",
  },
  {
    id: 4,
    question: "Does the course include interview preparation and placement support?",
    answer:
      "Yes. Job readiness support is built into the program, including interview preparation focused on the kinds of technical and scenario questions asked in data and marketing interviews, along with placement support to help guide your job search.",
  },
  {
    id: 5,
    question: "How do I decide between the Data Analytics and Digital Marketing tracks?",
    answer:
      "Base the decision on the type of work you want to do day-to-day. Choose Data Analytics if you want to work with structured data, queries, and reporting. Choose Digital Marketing if you're more interested in strategy, campaigns, and audience-facing work. Both increasingly benefit from AI and automation skills, which can be added alongside either track.",
  },
  {
    id: 6,
    question: "Is this suitable for someone changing careers rather than just upskilling?",
    answer:
      "Yes, the courses are designed for both. Career changers get the foundational training needed to enter a new field, while professionals already working in data or marketing can use the same tracks to fill specific skill gaps or add newer capabilities like AI and automation.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
      isOpen 
        ? "border-[#016ab7] bg-white shadow-sm" 
        : "border-slate-200 bg-white hover:border-slate-300"
    }`}>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
        aria-expanded={isOpen}
        aria-label={faq.question}
      >
        <h3 className="flex-1 text-sm font-semibold leading-6 text-slate-900 sm:text-base">
          {faq.question}
        </h3>

        {/* Arrow Icon - White background when open */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen 
              ? "bg-white border border-[#016ab7] rotate-180" 
              : "border border-slate-200 bg-white hover:border-[#016ab7] hover:bg-slate-50"
          }`}
        >
          <ChevronDown
            className={`h-4 w-4 transition-colors duration-300 ${
              isOpen ? "text-[#016ab7]" : "text-slate-500"
            }`}
          />
        </div>
      </button>

      {/* Answer Content - with 1px light border when open */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className={`px-5 py-5 sm:px-7 ${
            isOpen ? "border-t border-[#016ab7]" : ""
          }`}>
            <p className="text-sm leading-7 text-slate-600 sm:text-base">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="faqs" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center">
          <span className="inline-block rounded-full border border-[#016ab7] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#016ab7]">
            Frequently Asked Questions
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Everything You Need To Know
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Answers to the most searched questions about AI careers, Generative AI,
            Agentic AI, RAG, cybersecurity, certifications, salaries, and job opportunities.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}