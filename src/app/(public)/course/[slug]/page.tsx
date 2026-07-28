// skillo-frontend\src\app\(public)\course\[slug]\page.tsx
"use client";

import type { ComponentType, ReactNode } from "react";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { useCourse } from "@/features/course/hooks/useCourse";
import ContentPreview from "@/components/editor/ContentPreview";
import TestimonialCarousel from "@/components/home/Testimonial";

import type {
  ICurriculumSection,
  ITool,
  IProject,
} from "@/features/course/api/courseApi";

import {
  ArrowLeft,
  Clock,
  CheckCircle,
  ChevronDown,
  Loader2,
  ShieldCheck,
  Infinity as InfinityIcon,
  Award,
  AlertCircle,
  ShoppingCart,
  BookOpen,
  GraduationCap,
  Video,
  Layers,
  Wrench,
  Target,
  Users,
  Briefcase,
  Globe,
  BarChart3,
  Sparkles,
  Hammer,
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  XCircle,
  CalendarClock,
} from "lucide-react";

type AssetReference = {
  url?: string | null;
  storageKey?: string | null;
  originalName?: string | null;
  mimeType?: string | null;
};

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=1200";

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

/**
 * Prefer storageKey because it is the canonical field returned by the current
 * upload utility. The URL field remains supported for existing records.
 *
 * NEXT_PUBLIC_ASSET_BASE_URL should match the backend ASSET_BASE_URL, for
 * example: https://sn.shikshanation.com
 */
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

  /*
   * Rewrite legacy dotted-bucket S3 URLs through the configured asset host.
   * Example:
   * images.example.com.s3.ap-south-1.amazonaws.com/key
   * -> sn.example.com/key
   */
  if (ASSET_BASE_URL) {
    try {
      const url = new URL(value);

      if (
        url.hostname.includes(".s3.") &&
        url.hostname.endsWith(".amazonaws.com")
      ) {
        return `${ASSET_BASE_URL}/${encodeAssetPath(url.pathname)}`;
      }
    } catch {
      return value;
    }
  }

  return value;
};

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

const formatMinutes = (minutes: number): string => {
  if (!minutes) return "";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours <= 0) return `${remainingMinutes}m`;
  if (remainingMinutes <= 0) return `${hours}h`;

  return `${hours}h ${remainingMinutes}m`;
};

const normalizeCourseLevel = (value: unknown): string =>
  String(value ?? "all-levels")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  "all-levels": "All Levels",
};

const STATUS_LABEL: Record<string, string> = {
  upcoming: "Upcoming",
  active: "Enrolling Now",
  ended: "Ended",
};

const STATUS_CLASS: Record<string, string> = {
  upcoming: "bg-amber-400/20 text-amber-100",
  active: "bg-emerald-400/20 text-emerald-100",
  ended: "bg-white/15 text-white/80",
};

const getExternalUrlLabel = (value: string): string => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};

const ToolChip = ({ tool }: { tool: ITool }) => (
  <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#016ab7] to-[#6cb84d] text-sm font-bold text-white">
      {tool.name?.charAt(0).toUpperCase() || "T"}
    </span>
    <span className="text-sm font-medium text-gray-800">
      {tool.name}
    </span>
  </div>
);

const SectionHeading = ({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) => (
  <div className="flex items-center gap-3">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#016ab7]/10">
      <Icon className="h-5 w-5 text-[#016ab7]" />
    </span>
    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
      {children}
    </h2>
  </div>
);

export default function CourseDetailPage() {
  const params = useParams();
  const { useGetCourseBySlug } = useCourse();

  /*
   * This file lives at:
   *   src/app/(public)/course/[slug]/page.tsx
   *
   * Therefore Next.js exposes the dynamic segment as `params.slug`.
   */
  const slug = getRouteParam(
    params?.slug as string | string[] | undefined,
  );

  const [expandedCurriculum, setExpandedCurriculum] =
    useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const {
    data: courseData,
    isLoading,
    error,
  } = useGetCourseBySlug(slug);

  const course = courseData?.data;

  const totalFacts = useMemo(() => {
    const curriculum: ICurriculumSection[] =
      course?.curriculum ?? [];

    const totalLessons = curriculum.reduce(
      (total, section) =>
        total + (section.lessons?.length ?? 0),
      0,
    );

    const totalMinutes = curriculum.reduce(
      (total, section) =>
        total +
        (section.lessons ?? []).reduce(
          (lessonTotal, lesson) =>
            lessonTotal +
            Number(lesson.durationMinutes ?? 0),
          0,
        ),
      0,
    );

    return {
      totalLessons,
      totalMinutes,
    };
  }, [course?.curriculum]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#016ab7]" />
          <p className="mt-4 text-gray-600">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md px-4 text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            Course Not Found
          </h3>
          <p className="mb-4 text-gray-600">
            The course you&apos;re looking for doesn&apos;t
            exist or has been removed.
          </p>
          <Link
            href="/course"
            className="inline-flex items-center gap-2 rounded-lg bg-[#016ab7] px-6 py-2 text-white transition-colors hover:bg-[#015a9e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const whatYouWillLearn = course.whatYouWillLearn ?? [];
  const curriculum: ICurriculumSection[] =
    course.curriculum ?? [];
  const tools: ITool[] = course.tools ?? [];
  const whoIsThisFor = course.whoIsThisFor ?? [];
  const notFor = course.notFor ?? [];
  const requirements = course.requirements ?? [];
  const projects: IProject[] = course.projects ?? [];
  const careerRoles = course.careerRoles ?? [];
  const certificate = course.certificate;
  const highlights = course.highlights ?? [];
  const testimonials = course.testimonials ?? [];
  const faqs = course.faqs ?? [];
  const resources = course.resources ?? [];
  const externalUrls = (course.urls ?? []).filter(Boolean);

  const originalPrice = Number(course.price ?? 0);
  const discountedPrice = Number(course.discountedPrice ?? 0);

  const hasDiscount =
    originalPrice > 0 &&
    discountedPrice > 0 &&
    discountedPrice < originalPrice;

  const finalPrice = hasDiscount
    ? discountedPrice
    : originalPrice;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((originalPrice - discountedPrice) / originalPrice) *
          100,
      )
    : 0;

  const durationWeeks = Number(course.durationWeeks ?? 0);

  const duration =
    durationWeeks > 0
      ? `${durationWeeks} ${
          durationWeeks === 1 ? "week" : "weeks"
        }`
      : "Self-paced";

  const courseStatus = course.status ?? "upcoming";
  const canEnroll = courseStatus === "active";

  const heroHeadline =
    course.heroHeadline?.trim() ||
    course.shortDescription?.trim() ||
    course.title;

  const purchaseUrl = course.purchaseUrl?.trim() || "";

  const bannerUrl =
    resolveAssetUrl(course.bannerImage) || FALLBACK_BANNER;

  const level = normalizeCourseLevel(course.level);
  const levelLabel = LEVEL_LABEL[level] ?? "All Levels";

  const hasCertificate =
    Boolean(certificate) &&
    Boolean(
      certificate?.description?.trim() ||
        certificate?.requirements?.length,
    );

  const includes: Array<{
    icon: ComponentType<{ className?: string }>;
    label: string;
  }> = [];

  if (course.format) {
    includes.push({
      icon: Video,
      label: course.format,
    });
  }

  if (durationWeeks > 0) {
    includes.push({
      icon: Clock,
      label: `${duration} program`,
    });
  }

  if (totalFacts.totalMinutes > 0) {
    includes.push({
      icon: Layers,
      label: `${formatMinutes(
        totalFacts.totalMinutes,
      )} of lessons`,
    });
  } else if (totalFacts.totalLessons > 0) {
    includes.push({
      icon: Layers,
      label: `${totalFacts.totalLessons} lessons`,
    });
  }

  if (course.language) {
    includes.push({
      icon: Globe,
      label: `Taught in ${course.language}`,
    });
  }

  if (resources.length > 0) {
    includes.push({
      icon: Download,
      label: `${resources.length} downloadable resource${
        resources.length === 1 ? "" : "s"
      }`,
    });
  }

  includes.push({
    icon: InfinityIcon,
    label: "Lifetime access on any device",
  });

  if (hasCertificate) {
    includes.push({
      icon: Award,
      label: "Certificate of completion",
    });
  }

  const handleEnrollNow = () => {
    if (!canEnroll) return;

    if (purchaseUrl) {
      window.location.assign(purchaseUrl);
      return;
    }

    setIsEnrolling(true);

    window.setTimeout(() => {
      setIsEnrolling(false);
      setEnrollSuccess(true);

      window.setTimeout(() => {
        setEnrollSuccess(false);
      }, 3000);
    }, 1200);
  };

  const getActionLabel = (): string => {
    if (courseStatus === "upcoming") return "Coming Soon";
    if (courseStatus === "ended") return "Course Ended";
    if (isEnrolling) return "Enrolling...";
    if (enrollSuccess) return "Enrolled!";
    return purchaseUrl ? "Buy Now" : "Enroll Now";
  };

  const actionLabel = getActionLabel();

  const actionContent = (
    <>
      {isEnrolling ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : enrollSuccess ? (
        <CheckCircle className="h-4 w-4" />
      ) : courseStatus === "upcoming" ? (
        <CalendarClock className="h-4 w-4" />
      ) : courseStatus === "ended" ? (
        <XCircle className="h-4 w-4" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {actionLabel}
    </>
  );

  const buyCard = (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
      <div className="relative mb-5 aspect-[2/1] w-full overflow-hidden rounded-xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerUrl}
          alt={course.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(finalPrice, course.currency)}
        </span>

        {hasDiscount && (
          <>
            <span className="mb-1 text-base text-gray-400 line-through">
              {formatPrice(originalPrice, course.currency)}
            </span>
            <span className="mb-1 rounded-full bg-[#6cb84d]/10 px-2 py-0.5 text-xs font-semibold text-[#6cb84d]">
              {discountPercentage}% off
            </span>
          </>
        )}
      </div>

      {purchaseUrl && canEnroll ? (
        <a
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#016ab7] py-3 font-semibold text-white transition-all hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25"
        >
          {actionContent}
        </a>
      ) : (
        <button
          type="button"
          onClick={handleEnrollNow}
          disabled={!canEnroll || isEnrolling}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#016ab7] py-3 font-semibold text-white transition-all hover:bg-[#0158a0] hover:shadow-lg hover:shadow-[#016ab7]/25 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-70"
        >
          {actionContent}
        </button>
      )}

      {enrollSuccess && (
        <div className="mt-2 text-center text-sm font-medium text-[#6cb84d]">
          Successfully enrolled in the course!
        </div>
      )}

      <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-sm text-gray-600">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          This course includes
        </p>

        {includes.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            <item.icon className="h-4 w-4 shrink-0 text-[#6cb84d]" />
            <span>{item.label}</span>
          </div>
        ))}

        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#6cb84d]" />
          <span>Secure checkout</span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-[#016ab7] via-[#0158a0] to-[#013b6b] text-white">
        <div className="mx-auto max-w-7xl px-4 pb-32 pt-6 sm:px-6 md:pb-40 lg:px-8">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/60">
            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/course"
              className="transition-colors hover:text-white"
            >
              Courses
            </Link>

            {course.category && (
              <>
                <span>/</span>
                <span className="capitalize text-white/75">
                  {course.category}
                </span>
              </>
            )}
          </nav>

          <div className="space-y-4 lg:max-w-[62%]">
            <div className="flex flex-wrap items-center gap-2">
              {course.category && (
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold capitalize backdrop-blur">
                  {course.category}
                </span>
              )}

              {course.subCategory && (
                <span className="inline-block rounded-full bg-[#6cb84d] px-3 py-1 text-xs font-semibold">
                  {course.subCategory}
                </span>
              )}

              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  STATUS_CLASS[courseStatus] ??
                  STATUS_CLASS.upcoming
                }`}
              >
                {STATUS_LABEL[courseStatus] ?? "Upcoming"}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight md:text-4xl lg:text-[2.75rem]">
              {course.title}
            </h1>

            <p className="text-base leading-relaxed text-white/85 md:text-lg">
              {heroHeadline}
            </p>

            {course.shortDescription &&
              course.shortDescription.trim() !==
                heroHeadline.trim() && (
                <p className="max-w-3xl text-sm leading-relaxed text-white/65 md:text-base">
                  {course.shortDescription}
                </p>
              )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm text-white/75">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#6cb84d]" />
                {duration}
              </span>

              <span className="flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-[#6cb84d]" />
                {levelLabel}
              </span>

              {course.language && (
                <span className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-[#6cb84d]" />
                  {course.language}
                </span>
              )}

              {course.format && (
                <span className="flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-[#6cb84d]" />
                  {course.format}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-24 max-w-7xl px-4 sm:px-6 md:-mt-28 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="min-w-0 space-y-8 lg:w-[63%]">
            {highlights.length > 0 && (
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-3">
                {highlights.map((highlight, index) => (
                  <div key={`${highlight.label}-${index}`}>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      {highlight.label}
                    </p>
                    <p className="mt-0.5 font-bold text-gray-900">
                      {highlight.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="lg:hidden">{buyCard}</div>

            {whatYouWillLearn.length > 0 && (
              <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
                <SectionHeading icon={GraduationCap}>
                  What You Will Learn
                </SectionHeading>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {whatYouWillLearn.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#6cb84d]" />
                      <p className="leading-relaxed text-gray-700">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {curriculum.length > 0 && (
              <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
                <SectionHeading icon={BookOpen}>
                  Course Curriculum
                </SectionHeading>

                <p className="text-sm text-gray-500">
                  {curriculum.length} section
                  {curriculum.length === 1 ? "" : "s"}
                  {totalFacts.totalLessons > 0 &&
                    ` • ${totalFacts.totalLessons} lessons`}
                  {totalFacts.totalMinutes > 0 &&
                    ` • ${formatMinutes(
                      totalFacts.totalMinutes,
                    )} total`}
                </p>

                <div className="space-y-3">
                  {curriculum.map((section, index) => {
                    const isOpen =
                      expandedCurriculum === index;
                    const lessons = section.lessons ?? [];
                    const sectionTools = section.tools ?? [];

                    return (
                      <div
                        key={`${section.title}-${index}`}
                        className="overflow-hidden rounded-xl border border-gray-200 transition-colors hover:border-[#016ab7]/30"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedCurriculum(
                              isOpen ? null : index,
                            )
                          }
                          className="flex w-full items-center justify-between gap-3 bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {section.label && (
                              <span className="shrink-0 rounded-md bg-[#016ab7]/10 px-2 py-0.5 text-xs font-semibold text-[#016ab7]">
                                {section.label}
                              </span>
                            )}

                            <span className="truncate font-semibold text-gray-900">
                              {section.title}
                            </span>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            {lessons.length > 0 && (
                              <span className="hidden text-xs text-gray-500 sm:inline">
                                {lessons.length} lesson
                                {lessons.length === 1
                                  ? ""
                                  : "s"}
                              </span>
                            )}

                            <ChevronDown
                              className={`h-5 w-5 text-gray-400 transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="space-y-4 border-t border-gray-100 p-4 md:p-5">
                            {section.description && (
                              <p className="text-sm leading-relaxed text-gray-600">
                                {section.description}
                              </p>
                            )}

                            {section.youBuild && (
                              <div className="flex items-start gap-2.5 rounded-lg bg-[#6cb84d]/10 p-3">
                                <Hammer className="mt-0.5 h-4 w-4 shrink-0 text-[#6cb84d]" />
                                <p className="text-sm text-gray-700">
                                  <span className="font-semibold text-gray-900">
                                    You build:{" "}
                                  </span>
                                  {section.youBuild}
                                </p>
                              </div>
                            )}

                            {sectionTools.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {sectionTools.map(
                                  (tool, toolIndex) => (
                                    <span
                                      key={`${tool}-${toolIndex}`}
                                      className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                                    >
                                      {tool}
                                    </span>
                                  ),
                                )}
                              </div>
                            )}

                            {lessons.length > 0 && (
                              <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
                                {lessons.map(
                                  (lesson, lessonIndex) => (
                                    <div
                                      key={`${lesson.title}-${lessonIndex}`}
                                      className="flex items-center justify-between gap-3 p-3"
                                    >
                                      <div className="flex min-w-0 items-center gap-3">
                                        <Video className="h-4 w-4 shrink-0 text-[#016ab7]" />

                                        <span className="truncate text-sm text-gray-700">
                                          {lesson.title}
                                        </span>

                                        {lesson.isPreview && (
                                          <span className="shrink-0 rounded bg-[#016ab7]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#016ab7]">
                                            Preview
                                          </span>
                                        )}
                                      </div>

                                      {Number(
                                        lesson.durationMinutes ??
                                          0,
                                      ) > 0 && (
                                        <span className="shrink-0 text-xs text-gray-500">
                                          {formatMinutes(
                                            Number(
                                              lesson.durationMinutes,
                                            ),
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <div className="hidden lg:block lg:w-[37%]">
            <div className="sticky top-24 w-full max-w-[420px]">
              {buyCard}
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-10 pb-16">
          {tools.length > 0 && (
            <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
              <SectionHeading icon={Wrench}>
                Tools You&apos;ll Master
              </SectionHeading>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {tools.map((tool, index) => (
                  <ToolChip
                    key={`${tool.name}-${index}`}
                    tool={tool}
                  />
                ))}
              </div>
            </section>
          )}

          {(whoIsThisFor.length > 0 ||
            requirements.length > 0 ||
            notFor.length > 0) && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {whoIsThisFor.length > 0 && (
                <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6">
                  <SectionHeading icon={Users}>
                    Who This Is For
                  </SectionHeading>

                  <ul className="space-y-3">
                    {whoIsThisFor.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex items-start gap-2.5"
                      >
                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#016ab7]" />
                        <span className="text-gray-700">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {requirements.length > 0 && (
                <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6">
                  <SectionHeading icon={ShieldCheck}>
                    Requirements
                  </SectionHeading>

                  <ul className="space-y-3">
                    {requirements.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex items-start gap-2.5"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#016ab7]" />
                        <span className="text-gray-700">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {notFor.length > 0 && (
                <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6">
                  <SectionHeading icon={XCircle}>
                    Who This Is Not For
                  </SectionHeading>

                  <ul className="space-y-3">
                    {notFor.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex items-start gap-2.5"
                      >
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                        <span className="text-gray-700">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {projects.length > 0 && (
            <section className="space-y-5">
              <SectionHeading icon={Target}>
                What You&apos;ll Build
              </SectionHeading>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {projects.map((project, index) => (
                  <div
                    key={`${project.title}-${index}`}
                    className="rounded-xl border border-gray-200 bg-white p-5"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                        {project.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {(hasCertificate ||
            careerRoles.length > 0) && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {hasCertificate && (
                <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
                  <SectionHeading icon={Award}>
                    Certificate
                  </SectionHeading>

                  {certificate?.description && (
                    <p className="text-sm leading-relaxed text-gray-600">
                      {certificate.description}
                    </p>
                  )}

                  {(certificate?.requirements?.length ??
                    0) > 0 && (
                    <ul className="space-y-2">
                      {certificate?.requirements?.map(
                        (requirement, index) => (
                          <li
                            key={`${requirement}-${index}`}
                            className="flex items-start gap-2.5"
                          >
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#6cb84d]" />
                            <span className="text-sm text-gray-700">
                              {requirement}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </section>
              )}

              {careerRoles.length > 0 && (
                <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
                  <SectionHeading icon={Briefcase}>
                    Roles This Prepares You For
                  </SectionHeading>

                  <div className="flex flex-wrap gap-2">
                    {careerRoles.map((role, index) => (
                      <span
                        key={`${role}-${index}`}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {resources.length > 0 && (
            <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
              <SectionHeading icon={Download}>
                Course Resources
              </SectionHeading>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {resources.map((resource, index) => {
                  const resourceUrl = resolveAssetUrl(
                    resource.file,
                  );

                  const isImage =
                    resource.type === "image" ||
                    resource.file?.mimeType?.startsWith(
                      "image/",
                    );

                  return (
                    <div
                      key={`${resource.name}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 p-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#016ab7]/10">
                        {isImage ? (
                          <ImageIcon className="h-5 w-5 text-[#016ab7]" />
                        ) : (
                          <FileText className="h-5 w-5 text-[#016ab7]" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {resource.name ||
                            resource.file?.originalName ||
                            `Resource ${index + 1}`}
                        </p>
                        <p className="text-xs uppercase text-gray-400">
                          {resource.type || "file"}
                        </p>
                      </div>

                      {resourceUrl && (
                        <a
                          href={resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#016ab7] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0158a0]"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Open
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {externalUrls.length > 0 && (
            <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
              <SectionHeading icon={ExternalLink}>
                Useful Links
              </SectionHeading>

              <div className="flex flex-wrap gap-3">
                {externalUrls.map((url, index) => (
                  <a
                    key={`${url}-${index}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-[#016ab7]/40 hover:text-[#016ab7]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {getExternalUrlLabel(url)}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {testimonials.length > 0 && (
        <TestimonialCarousel
          testimonials={testimonials}
          title="What Our Learners Say"
          subtitle={`Success stories from the ${course.title} program`}
        />
      )}

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        {faqs.length > 0 && (
          <section className="space-y-5 rounded-2xl">
            <SectionHeading icon={AlertCircle}>
              Frequently Asked Questions
            </SectionHeading>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={`${faq.question}-${index}`}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors hover:border-[#016ab7]/30"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(
                        openFaq === index ? null : index,
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>

                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                        openFaq === index
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {openFaq === index && (
                    <div className="border-t border-gray-100 p-4 text-sm leading-relaxed text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {course.cms && (
          <section className="space-y-5 rounded-2xl">
            <SectionHeading icon={Sparkles}>
              More About This Course
            </SectionHeading>
            <ContentPreview html={course.cms} />
          </section>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 shadow-lg md:hidden">
        <div>
          <p className="text-base font-bold text-gray-900">
            {formatPrice(finalPrice, course.currency)}
          </p>

          {hasDiscount && (
            <p className="text-xs text-gray-500 line-through">
              {formatPrice(originalPrice, course.currency)}
            </p>
          )}
        </div>

        {purchaseUrl && canEnroll ? (
          <a
            href={purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#016ab7] to-[#6cb84d] px-6 py-2.5 font-semibold text-white transition-all hover:shadow-lg"
          >
            <ShoppingCart className="h-4 w-4" />
            Buy Now
          </a>
        ) : (
          <button
            type="button"
            onClick={handleEnrollNow}
            disabled={!canEnroll || isEnrolling}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#016ab7] to-[#6cb84d] px-6 py-2.5 font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
          >
            {actionContent}
          </button>
        )}
      </div>

      <div className="h-16 md:hidden" />
    </main>
  );
}
