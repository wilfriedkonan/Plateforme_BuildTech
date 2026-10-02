import { apiClient } from './apiClient';

export interface RoleDto {
  id: string;
  name: string;
  description?: string;
}

export interface RoleListResponse {
  success: boolean;
  data?: RoleDto[];
  roles?: RoleDto[];
}

const roleService = {
  // GET /api/Roles
  async getRoles(): Promise<RoleDto[]> {
    try {
      const response = await apiClient.get<RoleListResponse | RoleDto[]>('/Roles');
      const body = response.data;
      if (Array.isArray(body)) return body;
      return (body as RoleListResponse).data ?? (body as RoleListResponse).roles ?? [];
    } catch (error: any) {
      console.error('[roleService] Error fetching roles:', error);
      throw error;
    }
  },
};

export default roleService;
