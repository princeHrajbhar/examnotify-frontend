// app/blog/categories/page.tsx
"use client";

import Link from "next/link";

import { useBlogCategory } from "@/features/blogCategory/hooks/useBlogCategory";

export default function CategoriesPage() {
  const { useGetBlogCategories } = useBlogCategory();

  const {
    data,
    isLoading,
    isError,
  } = useGetBlogCategories();

  const categories = data?.data || [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-green-50/30">
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-red-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-green-100/60 blur-3xl" />

        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-red-600 via-white to-green-600" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            ExamNotify Blog
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Explore Blog{" "}
            <span className="text-red-600">Categories</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Browse exam preparation guides, registration help, admit card
            instructions, result updates, and useful student resources by
            category.
          </p>

          <nav
            className="mt-5 flex items-center gap-2 text-sm text-slate-500"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="font-medium transition hover:text-red-600"
            >
              Home
            </Link>

            <span aria-hidden="true">/</span>

            <Link
              href="/blog"
              className="font-medium transition hover:text-green-600"
            >
              Blog
            </Link>

            <span aria-hidden="true">/</span>

            <span className="font-medium text-slate-700">Categories</span>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Error state */}
        {isError && (
          <div
            role="alert"
            className="mb-8 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600"
              aria-hidden="true"
            >
              <ErrorIcon />
            </span>

            <div>
              <h2 className="text-sm font-semibold text-red-800">
                Failed to load categories
              </h2>

              <p className="mt-1 text-sm text-red-700">
                We could not retrieve the blog categories. Please refresh the
                page and try again.
              </p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Loading categories"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="h-11 w-11 rounded-xl bg-slate-200" />
                  <div className="h-7 w-16 rounded-full bg-slate-100" />
                </div>

                <div className="mt-8 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* Category grid */}
        {!isLoading && !isError && categories.length > 0 && (
          <>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  All Categories
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a category to view its latest articles.
                </p>
              </div>

              <span className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                {categories.length}{" "}
                {categories.length === 1 ? "category" : "categories"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category, index) => {
                const isRedCard = index % 2 === 0;

                return (
                  <Link
                    key={category._id}
                    href={`/blog/category/${category.slug}`}
                    className="group block"
                  >
                    <article
                      className={`relative flex h-48 flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        isRedCard
                          ? "border-red-100 hover:border-red-300 hover:shadow-red-100/70"
                          : "border-green-100 hover:border-green-300 hover:shadow-green-100/70"
                      }`}
                    >
                      {/* Top accent */}
                      <div
                        className={`absolute left-0 top-0 h-1 w-full ${
                          isRedCard ? "bg-red-600" : "bg-green-600"
                        }`}
                      />

                      {/* Decorative circles */}
                      <div
                        className={`pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full opacity-60 transition-transform duration-500 group-hover:scale-125 ${
                          isRedCard ? "bg-red-50" : "bg-green-50"
                        }`}
                      />

                      <div
                        className={`pointer-events-none absolute -right-4 top-8 h-16 w-16 rounded-full opacity-40 ${
                          isRedCard ? "bg-green-50" : "bg-red-50"
                        }`}
                      />

                      <div className="relative flex items-start justify-between gap-4">
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                            isRedCard
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          <CategoryIcon />
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            isRedCard
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          Articles
                        </span>
                      </div>

                      <div className="relative">
                        <h3
                          className={`line-clamp-2 text-lg font-bold text-slate-900 transition-colors ${
                            isRedCard
                              ? "group-hover:text-red-600"
                              : "group-hover:text-green-600"
                          }`}
                        >
                          {category.name}
                        </h3>

                        <div
                          className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold ${
                            isRedCard ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          View articles

                          <ArrowIcon />
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

            {/* Category stats */}
            <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row">
              <p className="text-sm text-slate-500">
                Total blog categories:{" "}
                <span className="font-semibold text-slate-900">
                  {categories.length}
                </span>
              </p>

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 transition hover:text-green-700"
              >
                Browse all articles
                <ArrowIcon />
              </Link>
            </div>
          </>
        )}

        {/* Empty state */}
        {!isLoading && !isError && categories.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-green-50">
              <FolderIcon />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No categories found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Blog categories will appear here after they have been created and
              published.
            </p>

            <Link
              href="/blog"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Return to Blog
              <ArrowIcon />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

function CategoryIcon() {
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
      <path d="M4 4h6v6H4z" />
      <path d="M14 4h6v6h-6z" />
      <path d="M4 14h6v6H4z" />
      <path d="M14 14h6v6h-6z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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

function FolderIcon() {
  return (
    <svg
      className="h-10 w-10 text-green-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
  );
}

function ErrorIcon() {
  return (
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}