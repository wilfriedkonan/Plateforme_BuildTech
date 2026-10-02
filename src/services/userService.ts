import { apiClient } from './apiClient';

// ─── Types DTO — miroir exact du backend C# ───────────────────────────────────

export interface UserDto {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  idEntreprise: string;
  nomEntreprise?: string;
  idRole?: string;
  roleName?: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  password?: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  idEntreprise: string;
  idRole?: string;
}

export interface UpdateUserRequest {
  email?: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  idRole?: string;
  isActive?: boolean;
  password?: string;
}

// ─── Enveloppes réponse ───────────────────────────────────────────────────────

export interface UserListResponse {
  success: boolean;
  total: number;
  users: UserDto[];
  message?: string;
}

export interface UserDetailResponse {
  success: boolean;
  data?: UserDto;
  user?: UserDto;
  message?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

const userService = {
  // GET /api/Users
  async getUsers(): Promise<UserListResponse> {
    try {
      const response = await apiClient.get<UserListResponse>('/Users');
      return response.data;
    } catch (error: any) {
      console.error('[userService] Error fetching users:', error);
      throw error;
    }
  },

  // POST /api/Users
  async createUser(data: CreateUserRequest): Promise<UserDetailResponse> {
    try {
      const response = await apiClient.post<UserDetailResponse>('/Users', data);
      return response.data;
    } catch (error: any) {
      console.error('[userService] Error creating user:', error);
      throw error;
    }
  },

  // GET /api/Users/{id}
  async getUserById(id: string): Promise<UserDto | null> {
    try {
      const response = await apiClient.get<UserDetailResponse>(`/Users/${id}`);
      return response.data.data ?? response.data.user ?? null;
    } catch (error: any) {
      console.error('[userService] Error fetching user by id:', error);
      throw error;
    }
  },

  // PUT /api/Users/{id}
  async updateUser(id: string, data: UpdateUserRequest): Promise<UserDetailResponse> {
    try {
      const response = await apiClient.put<UserDetailResponse>(`/Users/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('[userService] Error updating user:', error);
      throw error;
    }
  },

  // DELETE /api/Users/{id}
  async deleteUser(id: string): Promise<UserDetailResponse> {
    try {
      const response = await apiClient.delete<UserDetailResponse>(`/Users/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('[userService] Error deleting user:', error);
      throw error;
    }
  },
};

export default userService;
