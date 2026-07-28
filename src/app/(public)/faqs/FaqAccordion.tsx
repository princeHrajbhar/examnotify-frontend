"use client";

import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

export type Faq = {
  q: string;
  a: string;
};

type ItemProps = {
  faq: Faq;
  isOpen: boolean;
  onToggle: () => void;
};

const FaqItem: React.FC<ItemProps> = ({ faq, isOpen, onToggle }) => {
  return (
    <div
      className={`rounded-xl border bg-slate-50/60 transition-colors ${
        isOpen ? "border-brand-start bg-white shadow-sm" : "border-slate-200"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-base font-bold text-slate-800">{faq.q}</span>
        <PlusIcon
          className={`h-5 w-5 flex-shrink-0 text-brand-start transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        />
      </button>

      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{faq.a}</p>
        </div>
      </div>
    </div>
  );
};

type ListProps = {
  faqs: Faq[];
};

const FaqAccordion: React.FC<ListProps> = ({ faqs }) => {
  const leftColumnItems = faqs.filter((_, index) => index % 2 === 0);
  const rightColumnItems = faqs.filter((_, index) => index % 2 === 1);

  const [leftOpenIndex, setLeftOpenIndex] = useState<number>(-1);
  const [rightOpenIndex, setRightOpenIndex] = useState<number>(-1);

  const toggleLeft = (i: number) => setLeftOpenIndex((prev) => (prev === i ? -1 : i));
  const toggleRight = (i: number) => setRightOpenIndex((prev) => (prev === i ? -1 : i));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {leftColumnItems.map((faq, i) => (
            <FaqItem
              key={`left-${i}`}
              faq={faq}
              isOpen={leftOpenIndex === i}
              onToggle={() => toggleLeft(i)}
            />
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {rightColumnItems.map((faq, i) => (
            <FaqItem
              key={`right-${i}`}
              faq={faq}
              isOpen={rightOpenIndex === i}
              onToggle={() => toggleRight(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqAccordion;