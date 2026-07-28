// skillo-frontend\src\features\course\api\courseApi.ts
import { baseApi } from '../../../services/baseApi';

// ==================== TYPES ====================

/**
 * Provider-neutral uploaded-file metadata returned by the S3 backend.
 */
export interface IUploadedFile {
  url: string;
  storageKey: string;
  mimeType: string;
  originalName: string;
  size: number;
  extension: string;
  uploadedAt: string;
  etag?: string;
  width?: number;
  height?: number;
  duration?: number;
  pages?: number;
}

export interface IResource {
  name: string;
  type: 'pdf' | 'image';
  file: IUploadedFile;
}

export interface IFAQ {
  question: string;
  answer: string;
}

export interface IHighlight {
  label: string;
  value: string;
}

export interface ITool {
  name: string;
  iconSlug?: string;
}

export interface ILesson {
  title: string;
  durationMinutes?: number;
  isPreview?: boolean;
}

export interface ICurriculumSection {
  label: string;
  title: string;
  description?: string;
  youBuild?: string;
  tools?: string[];
  lessons?: ILesson[];
}

export interface IProject {
  title: string;
  description?: string;
}

export interface ITestimonial {
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
}

export interface ICertificate {
  description?: string;
  requirements?: string[];
}

export type CourseStatus = 'upcoming' | 'active' | 'ended';

export type CourseLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'all-levels';

export interface ICourse {
  _id: string;

  // Required backend fields
  title: string;
  slug: string;
  category: string;

  // Optional backend fields returned with defaults
  subCategory: string;
  shortDescription: string;
  price: number;
  discountedPrice: number;
  currency: string;
  purchaseUrl: string;

  bannerImage?: IUploadedFile;

  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  status: CourseStatus;
  urls: string[];
  resources: IResource[];
  cms: string;
  faqs: IFAQ[];

  heroHeadline: string;
  highlights: IHighlight[];
  whatYouWillLearn: string[];
  requirements: string[];
  whoIsThisFor: string[];
  notFor: string[];
  tools: ITool[];
  curriculum: ICurriculumSection[];
  projects: IProject[];
  certificate: ICertificate;
  careerRoles: string[];
  testimonials: ITestimonial[];

  level: CourseLevel;
  language: string;
  durationWeeks: number;
  format: string;

  createdAt: string;
  updatedAt: string;
}

export interface CourseResponse {
  success: boolean;
  message?: string;
  data: ICourse;
}

export interface CoursePaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CoursesResponse {
  success: boolean;
  data: ICourse[];
  pagination?: CoursePaginationMeta;
}

// ==================== QUERY PARAMS ====================

export interface GetCoursesQuery {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
  level?: CourseLevel;
  search?: string;
  status?: CourseStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const normalizeCoursesResponse = (
  response: unknown,
): CoursesResponse => {
  if (Array.isArray(response)) {
    return {
      success: true,
      data: response as ICourse[],
    };
  }

  if (response && typeof response === 'object') {
    const record = response as {
      success?: boolean;
      data?: unknown;
      pagination?: CoursePaginationMeta;
    };

    return {
      success: record.success ?? true,
      data: Array.isArray(record.data)
        ? (record.data as ICourse[])
        : [],
      pagination: record.pagination,
    };
  }

  return {
    success: true,
    data: [],
  };
};

// ==================== API SERVICE ====================

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<
      CoursesResponse,
      GetCoursesQuery | void
    >({
      query: (params) => ({
        url: '/courses',
        method: 'GET',
        params: params ?? {},
        credentials: 'include',
      }),
      transformResponse: normalizeCoursesResponse,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Course' as const,
                id: _id,
              })),
              { type: 'Course' as const, id: 'LIST' },
            ]
          : [{ type: 'Course' as const, id: 'LIST' }],
    }),

    getCourseById: builder.query<CourseResponse, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'Course' as const, id },
      ],
    }),

    getCourseBySlug: builder.query<CourseResponse, string>({
      query: (slug) => ({
        url: `/courses/slug/${slug}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (_result, _error, slug) => [
        { type: 'Course' as const, id: `SLUG-${slug}` },
      ],
    }),

    createCourse: builder.mutation<CourseResponse, FormData>({
      query: (body) => ({
        url: '/courses',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: [
        { type: 'Course' as const, id: 'LIST' },
      ],
    }),

    updateCourse: builder.mutation<
      CourseResponse,
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/courses/${id}`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Course' as const, id },
        { type: 'Course' as const, id: 'LIST' },
      ],
    }),

    deleteCourse: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Course' as const, id },
        { type: 'Course' as const, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

// ==================== EXPORT HOOKS ====================

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetCourseBySlugQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;

export default courseApi;