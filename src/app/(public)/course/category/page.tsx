"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { useCourseCategory } from "@/features/courseCategory/hooks/useCourseCategory";

import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  ChevronRight,
  FolderOpen,
  GraduationCap,
  Layers3,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

type CourseCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  image?: {
    url?: string | null;
    storageKey?: string | null;
  } | null;
  icon?: string | null;
  courseCount?: number | null;
};

const CARD_STYLES = [
  {
    gradient:
      "from-sky-600 via-blue-600 to-indigo-700",
    glow: "bg-sky-300",
    accent: "text-sky-100",
  },
  {
    gradient:
      "from-emerald-600 via-teal-600 to-cyan-700",
    glow: "bg-emerald-300",
    accent: "text-emerald-100",
  },
  {
    gradient:
      "from-violet-600 via-purple-600 to-fuchsia-700",
    glow: "bg-violet-300",
    accent: "text-violet-100",
  },
  {
    gradient:
      "from-orange-500 via-rose-500 to-pink-700",
    glow: "bg-orange-300",
    accent: "text-orange-100",
  },
  {
    gradient:
      "from-slate-700 via-slate-800 to-slate-950",
    glow: "bg-slate-300",
    accent: "text-slate-200",
  },
  {
    gradient:
      "from-cyan-600 via-sky-600 to-blue-800",
    glow: "bg-cyan-300",
    accent: "text-cyan-100",
  },
];

const getCategoryDescription = (
  category: CourseCategory,
): string =>
  category.description?.trim() ||
  category.shortDescription?.trim() ||
  `Explore practical courses and structured learning paths in ${category.name}.`;

const getCategoryInitials = (name: string): string => {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "C";

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

export default function CourseCategoriesPage() {
  const { useGetCourseCategories } = useCourseCategory();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetCourseCategories();

  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo<CourseCategory[]>(() => {
    const rawCategories = data?.data;

    return Array.isArray(rawCategories)
      ? (rawCategories as CourseCategory[])
      : [];
  }, [data]);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return categories;

    return categories.filter((category) => {
      const name = category.name?.toLowerCase() ?? "";
      const slug = category.slug?.toLowerCase() ?? "";
      const description = getCategoryDescription(
        category,
      ).toLowerCase();

      return (
        name.includes(query) ||
        slug.includes(query) ||
        description.includes(query)
      );
    });
  }, [categories, searchQuery]);

  const loading = isLoading || isFetching;

  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(14,165,233,0.28),transparent_35%),radial-gradient(circle_at_88%_15%,rgba(16,185,129,0.2),transparent_30%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#082f49_100%)]" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 lg:px-8">
          <nav className="mb-10 flex items-center gap-2 text-sm text-white/55">
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
            <span className="text-white/80">
              Categories
            </span>
          </nav>

          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-sky-100 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Explore learning paths
              </span>

              <h1 className="mt-5 text-4xl font-black tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                Find the right course category
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                Browse focused learning tracks designed to
                help you build practical skills, complete
                real projects, and move toward your career
                goals.
              </p>
            </div>

            {!loading && !isError && categories.length > 0 && (
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-4 backdrop-blur">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Layers3 className="h-5 w-5 text-emerald-300" />
                </span>
                <div>
                  <p className="text-2xl font-black text-white">
                    {categories.length}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
                    Learning categories
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
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search course categories..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <Link
              href="/course"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
            >
              <BookOpen className="h-4 w-4" />
              View all courses
            </Link>
          </div>
        </div>

        {isError && (
          <div className="mt-8 rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </span>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Unable to load categories
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error instanceof Error
                ? error.message
                : "Something went wrong while loading course categories."}
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
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[270px] animate-pulse rounded-[28px] bg-slate-200"
              />
            ))}
          </div>
        )}

        {!loading &&
          !isError &&
          filteredCategories.length > 0 && (
            <>
              <div className="mb-5 mt-10 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                    Browse categories
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {searchQuery.trim()
                      ? `${filteredCategories.length} result${
                          filteredCategories.length === 1
                            ? ""
                            : "s"
                        } found`
                      : "Choose a category to explore its courses."}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCategories.map(
                  (category, index) => {
                    const style =
                      CARD_STYLES[
                        index % CARD_STYLES.length
                      ];

                    return (
                      <Link
                        key={category._id || category.slug}
                        href={`/course/category/${encodeURIComponent(
                          category.slug,
                        )}`}
                        className="group block"
                      >
                        <article
                          className={`relative flex min-h-[270px] flex-col overflow-hidden rounded-[28px] bg-gradient-to-br ${style.gradient} p-6 text-white shadow-[0_18px_55px_-28px_rgba(15,23,42,0.75)] transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl`}
                        >
                          <div
                            className={`absolute -right-14 -top-14 h-36 w-36 rounded-full ${style.glow} opacity-20 blur-2xl transition duration-500 group-hover:scale-125`}
                          />

                          <div className="absolute -bottom-20 -right-12 h-48 w-48 rounded-full border border-white/10" />
                          <div className="absolute -bottom-12 -right-6 h-32 w-32 rounded-full border border-white/10" />

                          <div className="relative flex items-start justify-between">
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-black backdrop-blur">
                              {getCategoryInitials(
                                category.name,
                              )}
                            </span>

                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-slate-900">
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          </div>

                          <div className="relative mt-auto pt-10">
                            <p
                              className={`text-[11px] font-bold uppercase tracking-[0.16em] ${style.accent}`}
                            >
                              Course category
                            </p>

                            <h3 className="mt-2 text-xl font-black leading-tight tracking-tight">
                              {category.name}
                            </h3>

                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/72">
                              {getCategoryDescription(
                                category,
                              )}
                            </p>

                            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                              <span className="text-sm font-semibold text-white/85">
                                Explore courses
                              </span>

                              {typeof category.courseCount ===
                                "number" &&
                                category.courseCount >= 0 && (
                                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/75">
                                    {category.courseCount}{" "}
                                    {category.courseCount === 1
                                      ? "course"
                                      : "courses"}
                                  </span>
                                )}
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  },
                )}
              </div>
            </>
          )}

        {!loading &&
          !isError &&
          categories.length > 0 &&
          filteredCategories.length === 0 && (
            <div className="mt-10 rounded-[28px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
                <Search className="h-8 w-8 text-sky-700" />
              </span>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No matching categories
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try a different search term or browse all
                available categories.
              </p>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-5 rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
              >
                Clear search
              </button>
            </div>
          )}

        {!loading &&
          !isError &&
          categories.length === 0 && (
            <div className="mt-10 rounded-[28px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <FolderOpen className="h-8 w-8 text-slate-500" />
              </span>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No course categories yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Categories will appear here after they are
                created and made available.
              </p>

              <Link
                href="/course"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
              >
                <GraduationCap className="h-4 w-4" />
                Browse courses
              </Link>
            </div>
          )}
      </section>
    </main>
  );
}