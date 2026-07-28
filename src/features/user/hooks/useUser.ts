// features/user/hooks/useUser.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCheckLockStatusQuery,
  useLazyCheckLockStatusQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleVerificationMutation,
  GetUsersQuery,
  CreateUserRequest,
  UpdateUserRequest,
} from '../api/userApi';
import { clearUsers } from '../slices/userSlice';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const { users, currentUser, isLoading, error, pagination } = useAppSelector(
    (state) => state.user
  );

  // Query hooks
  const useGetUsers = useGetUsersQuery;
  const useGetUserById = useGetUserByIdQuery;
  const useCheckLockStatus = useCheckLockStatusQuery;
  const useLazyCheckLockStatus = useLazyCheckLockStatusQuery;

  // Mutation hooks
  const [createUserMutation] = useCreateUserMutation();
  const [updateUserMutation] = useUpdateUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();
  const [toggleVerificationMutation] = useToggleVerificationMutation();

  // Mutation methods
  const createUser = useCallback(
    async (data: CreateUserRequest) => {
      try {
        const result = await createUserMutation(data).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createUserMutation]
  );

  const updateUser = useCallback(
    async ({ id, body }: { id: string; body: UpdateUserRequest }) => {
      try {
        const result = await updateUserMutation({ id, body }).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateUserMutation]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        const result = await deleteUserMutation(id).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [deleteUserMutation]
  );

  const toggleVerification = useCallback(
    async (id: string) => {
      try {
        const result = await toggleVerificationMutation(id).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [toggleVerificationMutation]
  );

  const clearUserData = useCallback(() => {
    dispatch(clearUsers());
  }, [dispatch]);

  return {
    // State
    users,
    currentUser,
    isLoading,
    error,
    pagination,

    // Query hooks (to be called at component level)
    useGetUsers,
    useGetUserById,
    useCheckLockStatus,
    useLazyCheckLockStatus,

    // Mutation methods
    createUser,
    updateUser,
    deleteUser,
    toggleVerification,

    // Utilities
    clearUserData,
  };
};