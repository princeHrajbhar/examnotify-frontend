import { baseApi } from '../../../services/baseApi';

// ==================== TYPES ====================

/**
 * Provider-neutral uploaded-file metadata returned by the S3 backend.
 * `uploadedAt` is a string because Date values are serialized over JSON.
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

export interface IFAQ {
  question: string;
  answer: string;
}

export interface ISocialMediaLink {
  platform: string;
  url: string;
}

export interface IResourceLink {
  title: string;
  url: string;
}

export type BlogStatus = 'draft' | 'published';

export interface IBlog {
  _id: string;

  // Required backend fields
  title: string;
  slug: string;
  content: string;

  // Optional backend fields returned with defaults
  description: string;
  category: string;
  keyword: string[];
  postingDate: string;
  postedBy: string;
  socialMediaLinks: ISocialMediaLink[];
  resourceLinks: IResourceLink[];
  banner?: IUploadedFile;
  files: IUploadedFile[];
  faq: IFAQ[];
  seoTitle: string;
  seoDescription: string;
  status: BlogStatus;

  createdAt: string;
  updatedAt: string;
}

export interface BlogStats {
  total: number;
  draft: number;
  published: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BlogsResponse {
  success: boolean;
  message: string;
  data: IBlog[];
  pagination: PaginationMeta;
}

export interface BlogResponse {
  success: boolean;
  message: string;
  data: IBlog;
}

export interface BlogStatsResponse {
  success: boolean;
  message: string;
  data: BlogStats;
}

// ==================== REQUEST TYPES ====================

/**
 * Only title, slug, and content are required by the backend.
 * File values are sent separately through FormData.
 */
export interface CreateBlogRequest {
  title: string;
  slug: string;
  content: string;
  description?: string;
  category?: string;
  keyword?: string[];
  postingDate?: string;
  postedBy?: string;
  socialMediaLinks?: ISocialMediaLink[];
  resourceLinks?: IResourceLink[];
  faq?: IFAQ[];
  seoTitle?: string;
  seoDescription?: string;
  status?: BlogStatus;
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
  id: string;
}

export interface GetBlogsQuery {
  page?: number;
  limit?: number;
  status?: BlogStatus;
  category?: string;
  search?: string;
  sortBy?: 'createdAt' | 'postingDate' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface BulkDeleteRequest {
  ids: string[];
}

export interface UpdateStatusRequest {
  id: string;
  status: BlogStatus;
}

export interface BulkDeleteResponse {
  success: boolean;
  message: string;
  data: {
    deletedCount: number;
    failedIds: string[];
  };
}

// ==================== API SERVICE ====================

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogsResponse, GetBlogsQuery | void>({
      query: (params) => ({
        url: '/blogs',
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Blog' as const,
                id: _id,
              })),
              { type: 'Blog' as const, id: 'LIST' },
            ]
          : [{ type: 'Blog' as const, id: 'LIST' }],
    }),

    getBlogById: builder.query<BlogResponse, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'Blog' as const, id },
      ],
    }),

    getBlogBySlug: builder.query<BlogResponse, string>({
      query: (slug) => ({
        url: `/blogs/slug/${slug}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, slug) => [
        { type: 'Blog' as const, id: `SLUG-${slug}` },
      ],
    }),

    getBlogStats: builder.query<BlogStatsResponse, void>({
      query: () => ({
        url: '/blogs/stats',
        method: 'GET',
      }),
      providesTags: [{ type: 'Blog' as const, id: 'STATS' }],
    }),

    createBlog: builder.mutation<BlogResponse, FormData>({
      query: (body) => ({
        url: '/blogs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Blog' as const, id: 'LIST' },
        { type: 'Blog' as const, id: 'STATS' },
      ],
    }),

    updateBlog: builder.mutation<
      BlogResponse,
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Blog' as const, id },
        { type: 'Blog' as const, id: 'LIST' },
        { type: 'Blog' as const, id: 'STATS' },
      ],
    }),

    deleteBlog: builder.mutation<BlogResponse, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Blog' as const, id },
        { type: 'Blog' as const, id: 'LIST' },
        { type: 'Blog' as const, id: 'STATS' },
      ],
    }),

    deleteMultipleBlogs: builder.mutation<
      BulkDeleteResponse,
      BulkDeleteRequest
    >({
      query: (body) => ({
        url: '/blogs/bulk-delete',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Blog' as const, id: 'LIST' },
        { type: 'Blog' as const, id: 'STATS' },
      ],
    }),

    updateBlogStatus: builder.mutation<
      BlogResponse,
      UpdateStatusRequest
    >({
      query: ({ id, status }) => ({
        url: `/blogs/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Blog' as const, id },
        { type: 'Blog' as const, id: 'LIST' },
        { type: 'Blog' as const, id: 'STATS' },
      ],
    }),
  }),
  overrideExisting: false,
});

// ==================== EXPORT HOOKS ====================

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogBySlugQuery,
  useGetBlogStatsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useDeleteMultipleBlogsMutation,
  useUpdateBlogStatusMutation,
} = blogApi;

export default blogApi;