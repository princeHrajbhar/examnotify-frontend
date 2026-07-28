"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import {
  BookOpenIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { useBlog } from "@/features/blog/hooks/useBlog";

const ITEMS_PER_PAGE = 9;

const CategoryBlogPage = () => {
  const params = useParams();

  const categoryParam =
    typeof params?.category === "string" ? params.category : "";

  const [currentPage, setCurrentPage] = useState(1);

  const decodedCategory = decodeURIComponent(categoryParam);
  const categoryName = decodedCategory;

  const { useGetBlogs } = useBlog();

  const { data, isLoading, error } = useGetBlogs({
    page: 1,
    limit: 100,
    status: "published",
  });

  const allBlogs = data?.data || [];

  const filteredBlogs = allBlogs.filter(
    (blog) =>
      blog.category?.toLowerCase() ===
      decodedCategory.toLowerCase(),
  );

  const totalFiltered = filteredBlogs.length;
  const totalPages = Math.ceil(
    totalFiltered / ITEMS_PER_PAGE,
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentBlogs = filteredBlogs.slice(
    startIndex,
    endIndex,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatBlogDate = (
    postingDate?: string,
    createdAt?: string,
  ) => {
    const dateValue = postingDate || createdAt;

    if (!dateValue) {
      return "Date unavailable";
    }

    try {
      return format(
        new Date(dateValue),
        "MMM d, yyyy",
      );
    } catch {
      return "Date unavailable";
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-green-50/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />

            <div className="mt-6 h-12 w-80 max-w-full animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-4 h-5 w-[520px] max-w-full animate-pulse rounded bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="h-52 animate-pulse bg-gradient-to-r from-red-50 via-slate-100 to-green-50" />

                  <div className="space-y-4 p-5">
                    <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />

                    <div className="space-y-2">
                      <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                      <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
                      <div className="h-4 w-1/4 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-red-50/50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-4xl">
            😕
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            We could not load the articles in this category.
            Please refresh the page and try again.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-green-50/30">
      {/* Category hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-red-100/70 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-green-100/70 blur-3xl" />

        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-red-600 via-white to-green-600" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 overflow-x-auto pb-2 text-sm text-slate-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <Link
              href="/"
              className="flex shrink-0 items-center gap-1.5 font-medium transition hover:text-red-600"
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Link>

            <ChevronRightIcon className="h-4 w-4 shrink-0 text-slate-300" />

            <Link
              href="/blog"
              className="shrink-0 font-medium transition hover:text-green-600"
            >
              Blog
            </Link>

            <ChevronRightIcon className="h-4 w-4 shrink-0 text-slate-300" />

            <Link
              href="/blog/categories"
              className="shrink-0 font-medium transition hover:text-red-600"
            >
              Categories
            </Link>

            <ChevronRightIcon className="h-4 w-4 shrink-0 text-slate-300" />

            <span className="max-w-[170px] truncate capitalize font-medium text-slate-700 sm:max-w-[240px]">
              {categoryName}
            </span>
          </nav>

          <div className="mt-6 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 shadow-sm">
                  <FolderIcon className="h-6 w-6" />
                </span>

                <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-green-700">
                  Blog category
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold capitalize tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {categoryName}{" "}
                <span className="text-red-600">
                  Articles
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Discover useful guides, updates, and
                student resources from the{" "}
                <span className="font-semibold capitalize text-green-700">
                  {categoryName}
                </span>{" "}
                category.
              </p>
            </div>

            {/* Article count */}
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-green-100 bg-white px-5 py-4 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <BookOpenIcon className="h-6 w-6" />
              </span>

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {totalFiltered}
                </p>

                <p className="text-xs font-medium text-slate-500">
                  {totalFiltered === 1
                    ? "Published article"
                    : "Published articles"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {currentBlogs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-green-50 text-5xl">
              📝
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No articles found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              There are currently no published articles in
              the{" "}
              <span className="font-semibold capitalize">
                {categoryName}
              </span>{" "}
              category.
            </p>

            <Link
              href="/blog"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Browse All Articles

              <ArrowIcon />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Latest {categoryName} Articles
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, totalFiltered)} of{" "}
                  {totalFiltered} articles.
                </p>
              </div>

              {totalPages > 1 && (
                <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentBlogs.map((blog, index) => {
                const isRedCard = index % 2 === 0;

                return (
                  <Link
                    key={blog._id}
                    href={`/blog/${blog.slug}`}
                    className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      isRedCard
                        ? "border-red-100 hover:border-red-300 hover:shadow-red-100/60"
                        : "border-green-100 hover:border-green-300 hover:shadow-green-100/60"
                    }`}
                  >
                    {/* Blog image */}
                    <div className="relative h-56 overflow-hidden bg-slate-100">
                      {blog.banner?.url ? (
                        <Image
                          src={blog.banner.url}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-600 via-red-500 to-green-600">
                          <BookOpenIcon className="h-16 w-16 text-white/80" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

                      {/* Category badge */}
                      <span
                        className={`absolute left-4 top-4 rounded-full border border-white/30 bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur ${
                          isRedCard
                            ? "text-red-600"
                            : "text-green-700"
                        }`}
                      >
                        {blog.category}
                      </span>

                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-600 via-white to-green-600" />
                    </div>

                    {/* Card content */}
                    <div className="p-5">
                      <h2
                        className={`line-clamp-2 text-xl font-bold leading-7 text-slate-900 transition-colors ${
                          isRedCard
                            ? "group-hover:text-red-600"
                            : "group-hover:text-green-600"
                        }`}
                      >
                        {blog.title}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {blog.description}
                      </p>

                      {/* Author and date */}
                      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <CalendarIcon className="h-4 w-4 text-red-500" />

                          {formatBlogDate(
                            blog.postingDate,
                            blog.createdAt,
                          )}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <UserIcon className="h-4 w-4 text-green-600" />

                          {blog.postedBy || "Admin"}
                        </span>
                      </div>

                      {/* Keywords */}
                      {blog.keyword &&
                        blog.keyword.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {blog.keyword
                              .slice(0, 3)
                              .map((tag, tagIndex) => (
                                <span
                                  key={tag}
                                  className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition ${
                                    tagIndex % 2 === 0
                                      ? "border-red-100 bg-red-50 text-red-600"
                                      : "border-green-100 bg-green-50 text-green-700"
                                  }`}
                                >
                                  #{tag}
                                </span>
                              ))}

                            {blog.keyword.length > 3 && (
                              <span className="flex items-center px-1 text-[10px] font-medium text-slate-400">
                                +{blog.keyword.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                      <div
                        className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${
                          isRedCard
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        Read article

                        <ArrowIcon />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Blog pagination"
            className="mt-10 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row"
          >
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-900">
                {Math.min(endIndex, totalFiltered)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {totalFiltered}
              </span>{" "}
              articles
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
                aria-label="Go to previous page"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from(
                  {
                    length: Math.min(5, totalPages),
                  },
                  (_, index) => {
                    let pageNumber: number;

                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (
                      currentPage >=
                      totalPages - 2
                    ) {
                      pageNumber =
                        totalPages - 4 + index;
                    } else {
                      pageNumber =
                        currentPage - 2 + index;
                    }

                    const isActive =
                      pageNumber === currentPage;

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() =>
                          handlePageChange(pageNumber)
                        }
                        aria-label={`Go to page ${pageNumber}`}
                        aria-current={
                          isActive ? "page" : undefined
                        }
                        className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition ${
                          isActive
                            ? "border-red-600 bg-red-600 text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-green-500 hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  },
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  handlePageChange(currentPage + 1)
                }
                disabled={
                  currentPage === totalPages
                }
                aria-label="Go to next page"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-200 bg-white text-green-600 transition hover:border-green-600 hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </nav>
        )}
      </section>
    </main>
  );
};

export default CategoryBlogPage;

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