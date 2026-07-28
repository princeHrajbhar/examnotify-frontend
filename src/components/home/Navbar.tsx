"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaChevronDown,
  FaSignInAlt,
  FaTimes,
} from "react-icons/fa";

import {
  ICourse,
  useGetCoursesQuery,
} from "@/features/course/api/courseApi";

const LOGIN_URL = "https://learning.skillo.live/web/login";

// Shown as top-level nav items on desktop and mobile.
const PRIMARY_LINKS = [
  { href: "/careerx", label: "CareerX" },
  { href: "/blog", label: "Blog" },
  { href: "/about-us", label: "About Us" },
] as const;

interface CategoryGroup {
  name: string;
  courses: ICourse[];
}

const getCourseUrl = (slug: string) => `/course/${slug}`;
const getCategoryUrl = (categoryName: string) => `/course/category/${categoryName.toLowerCase()}`;

export default function Navbar() {
  const pathname = usePathname();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mobileCategory, setMobileCategory] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const {
    data,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useGetCoursesQuery({
    page: 1,
    limit: 500,
    status: "active",
    sortBy: "title",
    sortOrder: "asc",
  });

  const categoryGroups = useMemo<CategoryGroup[]>(() => {
    const groups = new Map<string, ICourse[]>();

    for (const course of data?.data ?? []) {
      const category = course.category?.trim();

      if (!category) {
        continue;
      }

      const existingCourses = groups.get(category) ?? [];
      existingCourses.push(course);
      groups.set(category, existingCourses);
    }

    return Array.from(groups.entries())
      .map(([name, courses]) => ({
        name,
        courses: [...courses].sort((a, b) =>
          a.title.localeCompare(b.title),
        ),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data?.data]);

  const selectedCategory =
    categoryGroups.find(
      (category) => category.name === hoveredCategory,
    ) ?? categoryGroups[0];

  useEffect(() => {
    setActiveDropdown(null);
    setHoveredCategory(null);
    setMobileCategory(null);
    setMobileMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (
      categoryGroups.length > 0 &&
      !categoryGroups.some(
        (category) => category.name === hoveredCategory,
      )
    ) {
      setHoveredCategory(categoryGroups[0].name);
    }
  }, [categoryGroups, hoveredCategory]);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleDropdownEnter = (dropdownName: string) => {
    clearHoverTimeout();
    setActiveDropdown(dropdownName);

    if (
      dropdownName === "categories" &&
      !hoveredCategory &&
      categoryGroups[0]
    ) {
      setHoveredCategory(categoryGroups[0].name);
    }
  };

  const handleDropdownLeave = () => {
    clearHoverTimeout();

    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const closeMenus = () => {
    clearHoverTimeout();
    setActiveDropdown(null);
    setHoveredCategory(null);
    setMobileCategory(null);
    setMobileMenu(false);
  };

  const isActivePath = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[80px] items-center justify-between md:h-[85px]">
            <div className="flex items-center gap-4 lg:gap-6">
              <Link
                href="/"
                className="flex flex-shrink-0 items-center"
                onClick={closeMenus}
              >
                <Image
                  src="/skillo.png"
                  alt="Skillo Logo"
                  width={160}
                  height={56}
                  className="h-12 w-auto object-contain md:h-14"
                  priority
                />
              </Link>

              <nav className="hidden items-center gap-2 lg:flex">
                {/* Dynamic course mega menu */}
                <div
                  className="relative"
                  onMouseEnter={() =>
                    handleDropdownEnter("categories")
                  }
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href="/course"
                    onClick={() => {
                      closeMenus();
                    }}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                      activeDropdown === "categories"
                        ? "bg-[#016ab7]/10 text-[#016ab7]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#016ab7]"
                    }`}
                  >
                    Explore Courses
                    <FaChevronDown
                      className={`text-[10px] transition-transform duration-200 ${
                        activeDropdown === "categories"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </Link>

                  {activeDropdown === "categories" && (
                    <div
                      className="absolute left-0 top-full z-50 mt-2 w-[780px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15"
                      onMouseEnter={clearHoverTimeout}
                    >
                      {coursesLoading ? (
                        <div className="grid min-h-[330px] grid-cols-[280px_1fr]">
                          <div className="space-y-3 border-r border-slate-100 bg-slate-50/70 p-4">
                            {Array.from({ length: 6 }).map(
                              (_, index) => (
                                <div
                                  key={index}
                                  className="h-11 animate-pulse rounded-xl bg-slate-200"
                                />
                              ),
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3 p-5">
                            {Array.from({ length: 6 }).map(
                              (_, index) => (
                                <div
                                  key={index}
                                  className="h-20 animate-pulse rounded-xl bg-slate-100"
                                />
                              ),
                            )}
                          </div>
                        </div>
                      ) : coursesError ? (
                        <div className="flex min-h-[260px] items-center justify-center p-8 text-center">
                          <div>
                            <p className="font-semibold text-slate-800">
                              Courses could not be loaded
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              Please refresh the page and try again.
                            </p>
                          </div>
                        </div>
                      ) : categoryGroups.length === 0 ? (
                        <div className="flex min-h-[260px] items-center justify-center p-8 text-center">
                          <div>
                            <p className="font-semibold text-slate-800">
                              No courses are available
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              Active courses will appear here.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid min-h-[320px] grid-cols-[280px_1fr]">
                          {/* Category names: left side */}
                          <div className="max-h-[420px] overflow-y-auto border-r border-slate-100 bg-slate-50/70 p-3">
                            <div className="space-y-1">
                              {categoryGroups.map((category) => {
                                const isSelected =
                                  selectedCategory?.name === category.name;

                                return (
                                  <Link
                                    key={category.name}
                                    href={getCategoryUrl(category.name)}
                                    onMouseEnter={() =>
                                      setHoveredCategory(category.name)
                                    }
                                    onFocus={() =>
                                      setHoveredCategory(category.name)
                                    }
                                    onClick={closeMenus}
                                    className={`block w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition-colors ${
                                      isSelected
                                        ? "bg-white text-[#016ab7] shadow-sm"
                                        : "text-slate-700 hover:bg-white hover:text-[#016ab7]"
                                    }`}
                                  >
                                    {category.name}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>

                          {/* Course titles: right side */}
                          <div className="max-h-[420px] overflow-y-auto p-4">
                            {selectedCategory && (
                              <div className="space-y-1">
                                {selectedCategory.courses.map((course) => (
                                  <Link
                                    key={course._id}
                                    href={getCourseUrl(course.slug)}
                                    onClick={closeMenus}
                                    className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-[#016ab7]/5 hover:text-[#016ab7]"
                                  >
                                    {course.title}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Top-level links */}
                {PRIMARY_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenus}
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                      isActivePath(link.href)
                        ? "bg-[#016ab7]/10 text-[#016ab7]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#016ab7]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-shrink-0 items-center gap-3">
              <div className="hidden items-center gap-3 xl:flex">
                <Image
                  src="/meity-logo.webp"
                  alt="Ministry of Electronics & Information Technology"
                  width={90}
                  height={36}
                  className="h-8 w-auto object-contain"
                />
                <Image
                  src="/nasscom-logo.webp"
                  alt="NASSCOM"
                  width={80}
                  height={32}
                  className="h-7 w-auto object-contain"
                />
              </div>

              <div className="hidden h-6 w-px bg-slate-200 xl:block" />

              <a
                href={LOGIN_URL}
                className="hidden cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg bg-[#016ab7] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25 lg:flex"
              >
                <FaSignInAlt className="h-4 w-4" />
                Login
              </a>

              <button
                type="button"
                aria-label="Toggle navigation menu"
                onClick={() => setMobileMenu((open) => !open)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              >
                {mobileMenu ? (
                  <FaTimes size={20} />
                ) : (
                  <FaBars size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenu
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenu(false)}
      />

      {/* Mobile menu */}
      <div
        className={`fixed bottom-0 right-0 top-0 z-[101] w-[88%] max-w-sm transform bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-white p-5">
          <Image
            src="/skillo.png"
            alt="Skillo Logo"
            width={100}
            height={32}
            className="h-8 w-auto"
          />

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenu(false)}
            className="p-2 text-slate-500"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="h-[calc(100vh-70px)] space-y-4 overflow-y-auto bg-white p-4">
          <div>
            <button
              type="button"
              onClick={() =>
                setActiveDropdown((current) =>
                  current === "mobile-categories"
                    ? null
                    : "mobile-categories",
                )
              }
              className="flex w-full items-center justify-between rounded-xl p-3 font-semibold text-slate-800 hover:bg-slate-50"
            >
              Explore Courses
              <FaChevronDown
                className={`text-slate-400 transition-transform ${
                  activeDropdown === "mobile-categories"
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {activeDropdown === "mobile-categories" && (
              <div className="mt-2 rounded-xl border border-slate-100 bg-white p-2">
                {coursesLoading ? (
                  <div className="space-y-2 p-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-11 animate-pulse rounded-lg bg-slate-100"
                      />
                    ))}
                  </div>
                ) : categoryGroups.length === 0 ? (
                  <p className="p-3 text-sm text-slate-500">
                    No courses are available.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {categoryGroups.map((category) => {
                      const isExpanded =
                        mobileCategory === category.name;

                      return (
                        <div key={category.name}>
                          <button
                            type="button"
                            onClick={() =>
                              setMobileCategory((current) =>
                                current === category.name
                                  ? null
                                  : category.name,
                              )
                            }
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                              isExpanded
                                ? "bg-[#016ab7]/10 text-[#016ab7]"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <Link
                              href={getCategoryUrl(category.name)}
                              onClick={closeMenus}
                              className="min-w-0 flex-1 truncate text-sm font-semibold"
                            >
                              {category.name}
                            </Link>

                            <FaChevronDown
                              className={`h-3 w-3 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="mb-2 ml-3 mt-1 space-y-1 border-l-2 border-[#016ab7]/15 pl-3">
                              {category.courses.map((course) => (
                                <Link
                                  key={course._id}
                                  href={getCourseUrl(course.slug)}
                                  onClick={closeMenus}
                                  className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-[#016ab7]"
                                >
                                  {course.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`flex items-center rounded-xl p-3 font-semibold transition ${
                  isActivePath(link.href)
                    ? "bg-[#016ab7]/10 text-[#016ab7]"
                    : "text-slate-800 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <a
            href={LOGIN_URL}
            onClick={closeMenus}
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#016ab7] py-3 text-sm font-semibold text-white transition-all hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25"
          >
            <FaSignInAlt className="h-4 w-4" />
            Login
          </a>

          <div className="mt-2 flex items-center justify-center gap-4 border-t border-slate-100 pt-4">
            <Image
              src="/meity-logo.webp"
              alt="Ministry of Electronics & Information Technology"
              width={90}
              height={36}
              className="h-8 w-auto object-contain"
            />
            <Image
              src="/nasscom-logo.webp"
              alt="NASSCOM"
              width={80}
              height={32}
              className="h-7 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
}