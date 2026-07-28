import { baseApi } from '../../../services/baseApi';

export interface ILead {
  _id: string;
  name?: string;
  phone: string;
  email: string;
  course: string;
  source: string;
  pagePath?: string;
  pageTitle?: string;
  status: 'new' | 'contacted' | 'enrolled' | 'lost';
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export type LeadStatus = 'new' | 'contacted' | 'enrolled' | 'lost';

export interface LeadStats {
  new: number;
  contacted: number;
  enrolled: number;
  lost: number;
  total: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LeadsResponse {
  success: boolean;
  message?: string;
  data: {
    leads: ILead[];
    pagination: PaginationMeta;
  };
}

export interface LeadResponse {
  success: boolean;
  message?: string;
  data: ILead;
}

export interface LeadStatsResponse {
  success: boolean;
  message?: string;
  data: LeadStats;
}

export interface CreateLeadResponse {
  success: boolean;
  message?: string;
  data: {
    leadId: string;
  };
}

export interface CreateLeadRequest {
  name?: string;
  phone: string;
  email: string;
  course: string;
  source: string;
  pagePath?: string;
  pageTitle?: string;
}

export interface UpdateLeadRequest {
  name?: string;
  phone?: string;
  email?: string;
  course?: string;
  status?: LeadStatus;
}

export interface GetLeadsQuery {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  source?: string;
  course?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'status';
  sortDir?: 'asc' | 'desc';
}

export interface BulkDeleteRequest {
  ids: string[];
}

export interface UpdateStatusRequest {
  id: string;
  status: LeadStatus;
}

export const leadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query<LeadsResponse, GetLeadsQuery | void>({
      query: (params) => ({
        url: '/leads',
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) => {
        if (result?.data?.leads) {
          return [
            ...result.data.leads.map(({ _id }) => ({ type: 'lead' as const, id: _id })),
            { type: 'lead' as const, id: 'LIST' },
          ];
        }
        return [{ type: 'lead' as const, id: 'LIST' }];
      },
    }),

    getLeadById: builder.query<LeadResponse, string>({
      query: (id) => ({
        url: `/leads/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'lead' as const, id }],
    }),

    getLeadStats: builder.query<LeadStatsResponse, void>({
      query: () => ({
        url: '/leads/stats',
        method: 'GET',
      }),
      providesTags: [{ type: 'lead' as const, id: 'STATS' }],
    }),

    createLead: builder.mutation<CreateLeadResponse, CreateLeadRequest>({
      query: (body) => ({
        url: '/leads',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'lead' as const, id: 'LIST' }],
    }),

    updateLead: builder.mutation<LeadResponse, { id: string; body: UpdateLeadRequest }>({
      query: ({ id, body }) => ({
        url: `/leads/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'lead' as const, id },
        { type: 'lead' as const, id: 'LIST' },
        { type: 'lead' as const, id: 'STATS' },
      ],
    }),

    deleteLead: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/leads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'lead' as const, id },
        { type: 'lead' as const, id: 'LIST' },
        { type: 'lead' as const, id: 'STATS' },
      ],
    }),

    deleteMultipleLeads: builder.mutation<
      { success: boolean; message: string; data: { deletedCount: number; failedIds: string[] } },
      BulkDeleteRequest
    >({
      query: (body) => ({
        url: '/leads/bulk-delete',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'lead' as const, id: 'LIST' },
        { type: 'lead' as const, id: 'STATS' },
      ],
    }),

    updateLeadStatus: builder.mutation<LeadResponse, UpdateStatusRequest>({
      query: ({ id, status }) => ({
        url: `/leads/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'lead' as const, id },
        { type: 'lead' as const, id: 'LIST' },
        { type: 'lead' as const, id: 'STATS' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useGetLeadStatsQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useDeleteMultipleLeadsMutation,
  useUpdateLeadStatusMutation,
} = leadApi;