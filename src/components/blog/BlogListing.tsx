"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpenIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

import { useBlog } from "@/features/blog/hooks/useBlog";

const ITEMS_PER_PAGE = 9;

const BlogListingPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { useGetBlogs } = useBlog();

  const { data, isLoading, error } = useGetBlogs({
    page: 1,
    limit: 100,
    status: "published",
  });

  const allBlogs = data?.data || [];

  const filteredBlogs = useMemo(() => {
    let result = [...allBlogs];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();

      result = result.filter((blog) => {
        const titleMatch = blog.title
          ?.toLowerCase()
          .includes(searchLower);

        const descriptionMatch = blog.description
          ?.toLowerCase()
          .includes(searchLower);

        const categoryMatch = blog.category
          ?.toLowerCase()
          .includes(searchLower);

        const contentMatch = blog.content
          ?.toLowerCase()
          .includes(searchLower);

        return (
          titleMatch ||
          descriptionMatch ||
          categoryMatch ||
          contentMatch
        );
      });
    }

    if (selectedCategory) {
      result = result.filter(
        (blog) => blog.category === selectedCategory,
      );
    }

    return result;
  }, [allBlogs, searchTerm, selectedCategory]);

  const allCategories = useMemo(() => {
    const categories = Array.from(
      new Set(
        allBlogs
          .map((blog) => blog.category)
          .filter(Boolean),
      ),
    );

    return categories.length > 0
      ? categories
      : [
          "Technology",
          "Education",
          "Science",
          "Mathematics",
          "Language",
          "Arts",
        ];
  }, [allBlogs]);

  const totalFiltered = filteredBlogs.length;
  const totalPages = Math.ceil(
    totalFiltered / ITEMS_PER_PAGE,
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    endIndex,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(
        new Date(dateString),
        "MMM d, yyyy",
      );
    } catch {
      return "Invalid date";
    }
  };

  const truncateDescription = (
    text: string,
    maxLength = 100,
  ) => {
    if (!text) return "";

    if (text.length <= maxLength) {
      return text;
    }

    return `${text.substring(0, maxLength)}...`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-green-50/40 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-3xl">
            <div className="h-14 animate-pulse rounded-xl border border-red-100 bg-white shadow-sm" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="h-48 animate-pulse bg-gradient-to-r from-red-50 via-slate-100 to-green-50" />

                  <div className="space-y-4 p-6">
                    <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                      <div className="h-8 w-1/4 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-red-50/50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-4xl">
            😕
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Failed to load blog posts. Please try
            again later.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-green-50/30 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mx-auto mb-8 max-w-3xl">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green-600" />

            <input
              type="text"
              placeholder="Search articles by title, description, or category..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category filters */}
        {allCategories.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("");
                setCurrentPage(1);
              }}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                selectedCategory === ""
                  ? "border-red-600 bg-red-600 text-white shadow-sm shadow-red-600/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              All
            </button>

            {allCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(
                    selectedCategory === category
                      ? ""
                      : category,
                  );

                  setCurrentPage(1);
                }}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === category
                    ? "border-green-600 bg-green-600 text-white shadow-sm shadow-green-600/20"
                    : "border-slate-200 bg-white text-slate-600 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Result information */}
        <div className="mb-6 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {totalFiltered > 0
                ? startIndex + 1
                : 0}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-800">
              {Math.min(endIndex, totalFiltered)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {totalFiltered}
            </span>{" "}
            articles
            {searchTerm &&
              ` matching "${searchTerm}"`}
            {selectedCategory &&
              ` in "${selectedCategory}"`}
          </p>

          {totalPages > 1 && (
            <p className="text-sm font-medium text-green-700">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Active filters */}
        {(searchTerm || selectedCategory) && (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              Active filters:
            </span>

            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">
                Search: &quot;{searchTerm}&quot;

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  aria-label="Remove search filter"
                  className="rounded-full transition hover:text-red-900"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                Category: {selectedCategory}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("");
                    setCurrentPage(1);
                  }}
                  aria-label="Remove category filter"
                  className="rounded-full transition hover:text-green-900"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 transition hover:text-red-600"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Blog grid */}
        {paginatedBlogs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-green-50 text-5xl">
              📝
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              No articles found
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
              {searchTerm || selectedCategory
                ? `No results found${
                    searchTerm
                      ? ` for "${searchTerm}"`
                      : ""
                  }${
                    selectedCategory
                      ? ` in "${selectedCategory}"`
                      : ""
                  }`
                : "No articles are available at the moment."}
            </p>

            {(searchTerm ||
              selectedCategory) && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedBlogs.map((blog) => {
              const truncatedDescription =
                truncateDescription(
                  blog.description,
                  100,
                );

              const isTruncated =
                blog.description?.length > 100;

              return (
                <Link
                  key={blog._id}
                  href={`/blog/${blog.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-slate-200/70"
                >
                  {/* Blog image */}
                  <div className="relative w-full overflow-hidden pt-[56.25%]">
                    {blog.banner?.url ? (
                      <Image
                        src={blog.banner.url}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-600 via-red-500 to-green-600">
                        <BookOpenIcon className="h-14 w-14 text-white/70" />
                      </div>
                    )}

                    {blog.category && (
                      <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/90 px-3 py-1 text-[11px] font-semibold text-green-700 shadow-sm backdrop-blur">
                        {blog.category}
                      </span>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-600 via-white to-green-600" />
                  </div>

                  {/* Card content */}
                  <div className="p-5">
                    <h2 className="mb-2 line-clamp-2 text-lg font-bold leading-6 text-slate-900 transition-colors group-hover:text-red-600">
                      {blog.title}
                    </h2>

                    <p className="mb-3 text-sm leading-6 text-slate-600">
                      {truncatedDescription}

                      {isTruncated && (
                        <span className="ml-1 inline-block font-semibold text-green-600 transition-colors group-hover:text-green-700">
                          Read more
                        </span>
                      )}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="flex items-center text-xs text-slate-500">
                        <CalendarIcon className="mr-1.5 h-4 w-4 text-red-500" />

                        {formatDate(
                          blog.postingDate ||
                            blog.createdAt,
                        )}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 transition group-hover:translate-x-1">
                        Read article
                        <span aria-hidden="true">
                          →
                        </span>
                      </span>
                    </div>

                    {blog.keyword &&
                      blog.keyword.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {blog.keyword
                            .slice(0, 3)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500 transition group-hover:border-green-100 group-hover:bg-green-50 group-hover:text-green-700"
                              >
                                #{tag}
                              </span>
                            ))}

                          {blog.keyword.length >
                            3 && (
                            <span className="px-1 py-1 text-[10px] font-medium text-slate-400">
                              +
                              {blog.keyword.length -
                                3}
                            </span>
                          )}
                        </div>
                      )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-800">
                {Math.min(
                  endIndex,
                  totalFiltered,
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {totalFiltered}
              </span>{" "}
              articles
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handlePageChange(
                    currentPage - 1,
                  )
                }
                disabled={currentPage === 1}
                aria-label="Go to previous page"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              <span className="rounded-lg bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                Page{" "}
                <span className="font-bold text-red-600">
                  {currentPage}
                </span>{" "}
                of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  handlePageChange(
                    currentPage + 1,
                  )
                }
                disabled={
                  currentPage === totalPages
                }
                aria-label="Go to next page"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-200 bg-white text-green-600 transition hover:border-green-600 hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListingPage;