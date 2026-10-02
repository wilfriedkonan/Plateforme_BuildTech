import { useState, useCallback } from 'react';
import userService, {
  UserDto,
  CreateUserRequest,
  UpdateUserRequest,
} from '../services/userService';

interface UseUsersState {
  users: UserDto[];
  selectedUser: UserDto | null;
  loading: boolean;
  error: string | null;
  total: number;
}

export const useUsers = () => {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    total: 0,
  });

  const setLoading = (loading: boolean) =>
    setState(prev => ({ ...prev, loading, error: null }));

  const setError = (message: string) =>
    setState(prev => ({ ...prev, loading: false, error: message }));

  // ── GET /api/Users ─────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers();
      const data = res.users ?? [];
      setState(prev => ({
        ...prev,
        users: data,
        total: res.total ?? data.length,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Erreur lors du chargement des utilisateurs');
    }
  }, []);

  // ── GET /api/Users/{id} ────────────────────────────────────────────────────
  const getUserById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const user = await userService.getUserById(id);
      setState(prev => ({ ...prev, selectedUser: user, loading: false, error: null }));
      return user;
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Erreur lors du chargement de l\'utilisateur');
      return null;
    }
  }, []);

  // ── POST /api/Users ────────────────────────────────────────────────────────
  const createUser = useCallback(async (data: CreateUserRequest) => {
    setLoading(true);
    try {
      const res = await userService.createUser(data);
      if (res.success) {
        await fetchUsers();
        return res;
      }
      throw new Error(res.message || 'Erreur lors de la création de l\'utilisateur');
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Erreur lors de la création de l\'utilisateur');
      throw error;
    }
  }, [fetchUsers]);

  // ── PUT /api/Users/{id} ────────────────────────────────────────────────────
  const updateUser = useCallback(async (id: string, data: UpdateUserRequest) => {
    setLoading(true);
    try {
      const res = await userService.updateUser(id, data);
      if (res.success) {
        await fetchUsers();
        return res;
      }
      throw new Error(res.message || 'Erreur lors de la mise à jour de l\'utilisateur');
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
      throw error;
    }
  }, [fetchUsers]);

  // ── DELETE /api/Users/{id} ─────────────────────────────────────────────────
  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await userService.deleteUser(id);
      if (res.success) {
        setState(prev => ({
          ...prev,
          users: prev.users.filter(u => u.id !== id),
          selectedUser: prev.selectedUser?.id === id ? null : prev.selectedUser,
          total: prev.total - 1,
          loading: false,
          error: null,
        }));
        return res;
      }
      throw new Error(res.message || 'Erreur lors de la suppression de l\'utilisateur');
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Erreur lors de la suppression de l\'utilisateur');
      throw error;
    }
  }, []);

  return {
    ...state,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};
