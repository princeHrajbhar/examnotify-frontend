"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useGetCoursesQuery } from "@/features/course/api/courseApi";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  Tag,
  X,
} from "lucide-react";

type AssetReference = {
  url?: string | null;
  storageKey?: string | null;
};

type CourseListItem = {
  _id: string;
  title: string;
  slug: string;
  category?: string | null;
  subCategory?: string | null;
  shortDescription?: string | null;
  heroHeadline?: string | null;
  price?: number | null;
  discountedPrice?: number | null;
  currency?: string | null;
  bannerImage?: AssetReference | null;
  level?: string | null;
  language?: string | null;
  durationWeeks?: number | null;
  format?: string | null;
  status?: "upcoming" | "active" | "ended" | string;
};

const ITEMS_PER_PAGE = 9;

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200";

const ASSET_BASE_URL = (
  process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? ""
).replace(/\/+$/, "");

const getRouteParam = (
  value: string | string[] | undefined,
): string => {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
};

const trimSlashes = (value: string): string =>
  value.replace(/^\/+|\/+$/g, "");

const encodeAssetPath = (value: string): string =>
  trimSlashes(value)
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

const resolveAssetUrl = (
  asset?: AssetReference | null,
): string => {
  if (!asset) return "";

  const storageKey = asset.storageKey?.trim();

  if (storageKey && ASSET_BASE_URL) {
    return `${ASSET_BASE_URL}/${encodeAssetPath(storageKey)}`;
  }

  const value = asset.url?.trim();
  if (!value) return "";

  if (!/^https?:\/\//i.test(value)) {
    return ASSET_BASE_URL
      ? `${ASSET_BASE_URL}/${encodeAssetPath(value)}`
      : value;
  }

  if (ASSET_BASE_URL) {
    try {
      const parsed = new URL(value);

      if (
        parsed.hostname.includes(".s3.") &&
        parsed.hostname.endsWith(".amazonaws.com")
      ) {
        return `${ASSET_BASE_URL}/${encodeAssetPath(
          parsed.pathname,
        )}`;
      }
    } catch {
      return value;
    }
  }

  return value;
};

const toSlug = (value: unknown): string =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toTitle = (slug: string): string =>
  slug
    .split("-")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");

const formatPrice = (
  amount: unknown,
  currency = "INR",
): string => {
  const numericAmount = Number(amount ?? 0);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return "Free";
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  } catch {
    return `₹${numericAmount}`;
  }
};

const CourseCard = ({
  course,
}: {
  course: CourseListItem;
}) => {
  const category = String(course.category ?? "Course");
  const originalPrice = Number(course.price ?? 0);
  const discountedPrice = Number(course.discountedPrice ?? 0);

  const hasDiscount =
    originalPrice > 0 &&
    discountedPrice > 0 &&
    discountedPrice < originalPrice;

  const finalPrice = hasDiscount
    ? discountedPrice
    : originalPrice;

  const bannerUrl =
    resolveAssetUrl(course.bannerImage) || FALLBACK_BANNER;

  return (
    <Link
      href={`/course/${course.slug}`}
      className="group block h-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-[#016ab7]/30 hover:shadow-xl">
        <div className="relative w-full flex-shrink-0 overflow-hidden bg-gray-100 pt-[50%]">
          <Image
            src={bannerUrl}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <span className="mb-1 truncate text-xs font-medium text-[#016ab7]">
            {category}
          </span>

          <h3 className="mb-1.5 line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-[#016ab7] sm:text-base">
            {course.title}
          </h3>

          <p className="mb-3 line-clamp-2 flex-1 text-xs text-gray-500 sm:text-sm">
            {course.shortDescription ||
              course.heroHeadline ||
              `Learn practical skills with ${course.title}.`}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="whitespace-nowrap text-base font-bold text-[#016ab7] sm:text-lg">
                {formatPrice(
                  finalPrice,
                  course.currency || "INR",
                )}
              </span>

              {hasDiscount && (
                <span className="whitespace-nowrap text-xs text-gray-400 line-through sm:text-sm">
                  {formatPrice(
                    originalPrice,
                    course.currency || "INR",
                  )}
                </span>
              )}
            </div>

            <span className="flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-[#016ab7] px-3 py-1.5 text-xs font-medium text-white transition-all hover:scale-105 hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25 sm:px-4 sm:py-2 sm:text-sm">
              <span>View Detail</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default function CategoryCoursesPage() {
  const params = useParams<{
    category: string | string[];
  }>();

  /*
   * Route:
   * src/app/(public)/course/category/[category]/page.tsx
   *
   * The dynamic parameter must be read from `params.category`.
   */
  const rawCategory = getRouteParam(params?.category);

  let decodedCategory = rawCategory;
  try {
    decodedCategory = decodeURIComponent(rawCategory);
  } catch {
    // Keep the original value when the route segment is malformed.
  }

  const categoryQuery = decodedCategory.trim();
  const categorySlug = toSlug(categoryQuery);
  const categoryName = toTitle(categorySlug);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetCoursesQuery(
    {
      page: 1,
      limit: 100,
      category: categoryQuery,
      status: "active",
    },
    {
      skip: !categoryQuery,
    },
  );

  const returnedCourses = useMemo<CourseListItem[]>(() => {
    const rawCourses = data?.data;

    return Array.isArray(rawCourses)
      ? (rawCourses as CourseListItem[])
      : [];
  }, [data]);

  /*
   * The API is already queried with the category route value.
   * This second check prevents unrelated records from appearing if a backend
   * query implementation ever returns a broader result set.
   */
  const categoryCourses = useMemo(
    () =>
      returnedCourses.filter(
        (course) =>
          toSlug(course.category) === categorySlug,
      ),
    [returnedCourses, categorySlug],
  );

  const filteredCourses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return categoryCourses;

    return categoryCourses.filter((course) => {
      const searchableValues = [
        course.title,
        course.shortDescription,
        course.heroHeadline,
        course.category,
        course.subCategory,
        course.level,
        course.language,
        course.format,
      ];

      return searchableValues.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      );
    });
  }, [categoryCourses, searchTerm]);

  const totalCourses = filteredCourses.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalCourses / ITEMS_PER_PAGE),
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categorySlug]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const loading = isLoading || isFetching;

  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(14,165,233,0.3),transparent_36%),radial-gradient(circle_at_88%_16%,rgba(16,185,129,0.2),transparent_30%),linear-gradient(135deg,#020617_0%,#0f172a_56%,#082f49_100%)]" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 lg:px-8">
          <nav className="mb-10 flex flex-wrap items-center gap-2 text-sm text-white/55">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/course"
              className="transition hover:text-white"
            >
              Courses
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/course/category"
              className="transition hover:text-white"
            >
              Categories
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white/80">
              {categoryName}
            </span>
          </nav>

          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-sky-100 backdrop-blur">
                <Tag className="h-3.5 w-3.5" />
                {categoryName}
              </span>

              <h1 className="mt-5 text-4xl font-black tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                Master {categoryName}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                Explore focused {categoryName} courses with
                practical lessons, real projects, and
                career-ready learning outcomes.
              </p>
            </div>

            {!loading && !error && (
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-4 backdrop-blur">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <BookOpen className="h-5 w-5 text-emerald-300" />
                </span>

                <div>
                  <p className="text-2xl font-black text-white">
                    {categoryCourses.length}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
                    Active courses
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.5)] sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xl">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder={`Search ${categoryName} courses...`}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/course/category"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
              >
                <ArrowLeft className="h-4 w-4" />
                All categories
              </Link>

              <Link
                href="/course"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
              >
                Browse all courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-8 rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </span>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Unable to load courses
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error instanceof Error
                ? error.message
                : `Failed to load ${categoryName} courses.`}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        )}

        {loading && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[26px] border border-slate-200 bg-white"
              >
                <div className="aspect-[16/9] animate-pulse bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                  <div className="h-12 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-6 mt-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">
                  Category courses
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {categoryName} courses
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {searchTerm.trim()
                    ? `${totalCourses} matching course${
                        totalCourses === 1 ? "" : "s"
                      }`
                    : `${categoryCourses.length} active course${
                        categoryCourses.length === 1
                          ? ""
                          : "s"
                      } available`}
                </p>
              </div>

              {searchTerm && (
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                  Search: “{searchTerm}”
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
            </div>

            {paginatedCourses.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
                  {searchTerm ? (
                    <Search className="h-8 w-8 text-sky-700" />
                  ) : (
                    <BookOpen className="h-8 w-8 text-sky-700" />
                  )}
                </span>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  {searchTerm
                    ? "No matching courses"
                    : `No ${categoryName} courses yet`}
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {searchTerm
                    ? "Try a different search term to find a course in this category."
                    : "There are currently no active courses available in this category."}
                </p>

                {searchTerm ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mt-5 rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
                  >
                    Clear search
                  </button>
                ) : (
                  <Link
                    href="/course/category"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Browse categories
                  </Link>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-700">
                    {Math.min(
                      startIndex + ITEMS_PER_PAGE,
                      totalCourses,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {totalCourses}
                  </span>{" "}
                  courses
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1),
                      )
                    }
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="min-w-[118px] text-center text-sm font-semibold text-slate-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1),
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}