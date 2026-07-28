"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PAGE_SIZE = 25;
const TOTAL_DUMMY_ITEMS = 30;

type UpdateItem = {
  id: number;
  title: string;
  href: string;
  isNew?: boolean;
};

type TableVariant = "red" | "green";

const resultTitles = [
  "SSC GD Constable Result",
  "Railway Group D Result",
  "UP Police Constable Result",
  "Bihar Police Constable Result",
  "SSC CHSL Tier 1 Result",
  "IBPS Clerk Final Result",
  "REET Exam Result",
  "UPPSC Prelims Result",
  "SBI Clerk Result",
  "Rajasthan Patwari Result",
];

const registrationTitles = [
  "SSC CGL Online Registration",
  "Railway NTPC Online Form",
  "IBPS Clerk Registration",
  "UP Police Constable Application",
  "Bihar Police Online Form",
  "REET Online Registration",
  "SBI Clerk Application Form",
  "UPPSC Prelims Online Form",
  "Rajasthan Patwari Application",
  "NTA Entrance Exam Registration",
];

const admitCardTitles = [
  "SSC CHSL Admit Card",
  "Railway NTPC Admit Card",
  "UP Police Constable Admit Card",
  "Bihar Police Admit Card",
  "IBPS Clerk Admit Card",
  "REET Admit Card",
  "UPPSC Prelims Admit Card",
  "SBI Clerk Admit Card",
  "Rajasthan Patwari Admit Card",
  "NTA Entrance Exam Admit Card",
];

function generateDummyItems(
  titles: string[],
  basePath: string,
): UpdateItem[] {
  return Array.from({ length: TOTAL_DUMMY_ITEMS }, (_, index) => {
    const titleIndex = index % titles.length;
    const batchNumber = Math.floor(index / titles.length) + 1;
    const baseTitle = titles[titleIndex];

    return {
      id: index + 1,
      title:
        batchNumber === 1
          ? baseTitle
          : `${baseTitle} Update ${batchNumber}`,
      href: `${basePath}/${index + 1}`,
      isNew: index < 3,
    };
  });
}

const resultLinks = generateDummyItems(resultTitles, "/results");

const registrationLinks = generateDummyItems(
  registrationTitles,
  "/registration",
);

const admitCardLinks = generateDummyItems(
  admitCardTitles,
  "/admit-card",
);

export default function ExamUpdates() {
  return (
    <section className="bg-slate-50 py-8">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Latest Exam Updates
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Direct links for results, registrations, and admit cards.
          </p>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[160px_minmax(0,1fr)_160px]">
          {/* Left advertisement */}
          <div className="hidden xl:sticky xl:top-24 xl:block">
            <AdCard
              image="/images/ad-left.jpg"
              title="Left advertisement"
              href="/"
            />
          </div>

          {/* Three tables in one row */}
          <div className="grid min-w-0 gap-5 md:grid-cols-3">
            <NotificationTable
              title="Latest Results"
              viewAllHref="/results"
              items={resultLinks}
              variant="red"
            />

            <NotificationTable
              title="Registration Links"
              viewAllHref="/registration"
              items={registrationLinks}
              variant="green"
            />

            <NotificationTable
              title="Admit Cards"
              viewAllHref="/admit-card"
              items={admitCardLinks}
              variant="red"
            />
          </div>

          {/* Right advertisement */}
          <div className="hidden xl:sticky xl:top-24 xl:block">
            <AdCard
              image="/images/ad-right.jpg"
              title="Right advertisement"
              href="/"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type NotificationTableProps = {
  title: string;
  viewAllHref: string;
  items: UpdateItem[];
  variant: TableVariant;
};

function NotificationTable({
  title,
  viewAllHref,
  items,
  variant,
}: NotificationTableProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleItems = items.slice(0, visibleCount);
  const hasMoreItems = visibleCount < items.length;
  const remainingItems = items.length - visibleCount;
  const nextItemCount = Math.min(PAGE_SIZE, remainingItems);

  const headerClass =
    variant === "red" ? "bg-red-600" : "bg-green-600";

  const linkClass =
    variant === "red"
      ? "hover:text-red-600"
      : "hover:text-green-600";

  const numberClass =
    variant === "red"
      ? "bg-red-50 text-red-600"
      : "bg-green-50 text-green-600";

  const buttonClass =
    variant === "red"
      ? "border-red-600 text-red-600 hover:bg-red-50"
      : "border-green-600 text-green-600 hover:bg-green-50";

  const loadMoreItems = () => {
    setVisibleCount((currentCount) =>
      Math.min(currentCount + PAGE_SIZE, items.length),
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div
        className={`flex items-center justify-between gap-3 px-4 py-3 text-white ${headerClass}`}
      >
        <div>
          <h3 className="text-sm font-semibold sm:text-base">
            {title}
          </h3>

          <p className="mt-0.5 text-[11px] text-white/80">
            Showing {visibleItems.length} of {items.length}
          </p>
        </div>

        <Link
          href={viewAllHref}
          className="shrink-0 text-xs font-semibold text-white/90 hover:text-white"
        >
          View all
        </Link>
      </div>

      <table className="w-full table-fixed border-collapse">
        <thead className="bg-slate-100">
          <tr className="border-b border-slate-200">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              Exam Notification
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {visibleItems.map((item, index) => (
            <tr
              key={item.id}
              className="transition hover:bg-slate-50"
            >
              <td className="px-3 py-3">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold ${numberClass}`}
                  >
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={item.href}
                      className={`block text-sm font-medium leading-5 text-slate-800 transition ${linkClass}`}
                    >
                      {item.title}
                    </Link>

                    {item.isNew && (
                      <span className="mt-1 inline-flex rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-green-700">
                        New
                      </span>
                    )}
                  </div>

                  <svg
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-400"
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-slate-200 px-3 py-4">
        {hasMoreItems ? (
          <button
            type="button"
            onClick={loadMoreItems}
            className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${buttonClass}`}
          >
            Load {nextItemCount} More

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
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        ) : (
          <p className="text-center text-xs font-medium text-green-600">
            All notifications loaded
          </p>
        )}
      </div>
    </div>
  );
}

type AdCardProps = {
  image: string;
  title: string;
  href: string;
};

function AdCard({ image, title, href }: AdCardProps) {
  return (
    <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Link href={href} className="block">
        <div className="relative aspect-[3/5] w-full bg-slate-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="160px"
          />

          <span className="absolute right-2 top-2 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase text-slate-500 shadow-sm">
            Ad
          </span>
        </div>
      </Link>
    </aside>
  );
}