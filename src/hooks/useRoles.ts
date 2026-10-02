import { useState, useCallback, useEffect } from 'react';
import roleService, { RoleDto } from '../services/roleService';

interface UseRolesState {
  roles: RoleDto[];
  loading: boolean;
  error: string | null;
}

export const useRoles = () => {
  const [state, setState] = useState<UseRolesState>({
    roles: [],
    loading: false,
    error: null,
  });

  const fetchRoles = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const roles = await roleService.getRoles();
      setState({ roles, loading: false, error: null });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error?.response?.data?.message || error?.message || 'Erreur lors du chargement des rôles',
      }));
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  return { ...state, fetchRoles };
};
