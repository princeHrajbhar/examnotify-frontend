import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILead, LeadStats, LeadsResponse, LeadResponse, LeadStatsResponse } from '../api/leadApi';
import { leadApi } from '../api/leadApi';

interface LeadState {
  leads: ILead[];
  currentLead: ILead | null;
  stats: LeadStats | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  filters: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDir?: string;
  };
}

const initialState: LeadState = {
  leads: [],
  currentLead: null,
  stats: null,
  isLoading: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortDir: 'desc',
  },
};

const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    setLeads: (state, action: PayloadAction<ILead[]>) => {
      state.leads = action.payload;
    },
    setCurrentLead: (state, action: PayloadAction<ILead | null>) => {
      state.currentLead = action.payload;
    },
    setStats: (state, action: PayloadAction<LeadStats>) => {
      state.stats = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPagination: (state, action: PayloadAction<{
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    } | null>) => {
      state.pagination = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<LeadState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearLeads: (state) => {
      state.leads = [];
      state.currentLead = null;
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        leadApi.endpoints.getLeads.matchFulfilled,
        (state, action: PayloadAction<LeadsResponse>) => {
          state.leads = action.payload.data.leads;
          state.pagination = action.payload.data.pagination;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        leadApi.endpoints.getLeads.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        leadApi.endpoints.getLeads.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch leads';
        }
      )
      .addMatcher(
        leadApi.endpoints.getLeadById.matchFulfilled,
        (state, action: PayloadAction<LeadResponse>) => {
          state.currentLead = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        leadApi.endpoints.getLeadById.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        leadApi.endpoints.getLeadById.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch lead';
        }
      )
      .addMatcher(
        leadApi.endpoints.getLeadStats.matchFulfilled,
        (state, action: PayloadAction<LeadStatsResponse>) => {
          state.stats = action.payload.data;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        leadApi.endpoints.getLeadStats.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        leadApi.endpoints.getLeadStats.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to fetch lead stats';
        }
      )
      .addMatcher(
        leadApi.endpoints.createLead.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        leadApi.endpoints.createLead.matchFulfilled,
        (state) => {
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        leadApi.endpoints.createLead.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to create lead';
        }
      )
      .addMatcher(
        leadApi.endpoints.updateLead.matchFulfilled,
        (state, action: PayloadAction<LeadResponse>) => {
          state.isLoading = false;
          state.error = null;
          const index = state.leads.findIndex(lead => lead._id === action.payload.data._id);
          if (index !== -1) {
            state.leads[index] = action.payload.data;
          }
          if (state.currentLead?._id === action.payload.data._id) {
            state.currentLead = action.payload.data;
          }
        }
      )
      .addMatcher(
        leadApi.endpoints.updateLead.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to update lead';
        }
      )
      .addMatcher(
        leadApi.endpoints.deleteLead.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.error = null;
          const id = action.meta.arg.originalArgs;
          state.leads = state.leads.filter(lead => lead._id !== id);
          if (state.currentLead?._id === id) {
            state.currentLead = null;
          }
        }
      )
      .addMatcher(
        leadApi.endpoints.deleteLead.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to delete lead';
        }
      )
      .addMatcher(
        leadApi.endpoints.updateLeadStatus.matchFulfilled,
        (state, action: PayloadAction<LeadResponse>) => {
          state.isLoading = false;
          state.error = null;
          const index = state.leads.findIndex(lead => lead._id === action.payload.data._id);
          if (index !== -1) {
            state.leads[index] = action.payload.data;
          }
          if (state.currentLead?._id === action.payload.data._id) {
            state.currentLead = action.payload.data;
          }
        }
      )
      .addMatcher(
        leadApi.endpoints.updateLeadStatus.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.data?.message || 'Failed to update lead status';
        }
      );
  },
});

export const {
  setLeads,
  setCurrentLead,
  setStats,
  setLoading,
  setError,
  setPagination,
  setFilters,
  clearLeads,
} = leadSlice.actions;

export default leadSlice.reducer;