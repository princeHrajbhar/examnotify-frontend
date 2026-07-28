import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useGetLeadStatsQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useDeleteMultipleLeadsMutation,
  useUpdateLeadStatusMutation,
  GetLeadsQuery,
} from '../api/leadApi';
import {
  setLeads,
  setCurrentLead,
  setStats,
  setLoading,
  setError,
  setPagination,
  setFilters,
  clearLeads,
} from '../slices/leadSlice';

export const useLead = () => {
  const dispatch = useAppDispatch();
  const { leads, currentLead, stats, isLoading, error, pagination, filters } = useAppSelector(
    (state) => state.lead
  );

  const useGetLeads = (params?: GetLeadsQuery) => {
    return useGetLeadsQuery(params, {
      refetchOnMountOrArgChange: true,
    });
  };

  const useGetLeadById = (id: string) => {
    return useGetLeadByIdQuery(id, {
      skip: !id,
    });
  };

  const useGetLeadStats = () => {
    return useGetLeadStatsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });
  };

  const [createLeadMutation] = useCreateLeadMutation();
  const [updateLeadMutation] = useUpdateLeadMutation();
  const [deleteLeadMutation] = useDeleteLeadMutation();
  const [deleteMultipleLeadsMutation] = useDeleteMultipleLeadsMutation();
  const [updateLeadStatusMutation] = useUpdateLeadStatusMutation();

  const createLead = useCallback(
    async (data: any) => {
      try {
        const result = await createLeadMutation(data).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createLeadMutation]
  );

  const updateLead = useCallback(
    async ({ id, body }: { id: string; body: any }) => {
      try {
        const result = await updateLeadMutation({ id, body }).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateLeadMutation]
  );

  const deleteLead = useCallback(
    async (id: string) => {
      try {
        const result = await deleteLeadMutation(id).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [deleteLeadMutation]
  );

  const deleteMultipleLeads = useCallback(
    async (ids: string[]) => {
      try {
        const result = await deleteMultipleLeadsMutation({ ids }).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [deleteMultipleLeadsMutation]
  );

  const updateLeadStatus = useCallback(
    async ({ id, status }: { id: string; status: 'new' | 'contacted' | 'enrolled' | 'lost' }) => {
      try {
        const result = await updateLeadStatusMutation({ id, status }).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateLeadStatusMutation]
  );

  const updateFilters = useCallback(
    (newFilters: any) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const changePage = useCallback(
    (page: number) => {
      dispatch(setFilters({ page }));
    },
    [dispatch]
  );

  const changeLimit = useCallback(
    (limit: number) => {
      dispatch(setFilters({ limit, page: 1 }));
    },
    [dispatch]
  );

  const clearLeadData = useCallback(() => {
    dispatch(clearLeads());
  }, [dispatch]);

  return {
    leads,
    currentLead,
    stats,
    isLoading,
    error,
    pagination,
    filters,
    useGetLeads,
    useGetLeadById,
    useGetLeadStats,
    createLead,
    updateLead,
    deleteLead,
    deleteMultipleLeads,
    updateLeadStatus,
    updateFilters,
    changePage,
    changeLimit,
    clearLeadData,
  };
};