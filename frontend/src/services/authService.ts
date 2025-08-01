import apiService from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role?: 'client' | 'barber';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'client' | 'barber' | 'admin';
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  preferences?: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    timezone: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
    language?: string;
    timezone?: string;
  };
}

class AuthService {
  // Login user
  async login(data: LoginData): Promise<{ data: AuthResponse }> {
    return apiService.post<AuthResponse>('/auth/login', data);
  }

  // Register user
  async register(data: RegisterData): Promise<{ data: AuthResponse }> {
    return apiService.post<AuthResponse>('/auth/register', data);
  }

  // Get current user
  async getCurrentUser(): Promise<{ data: { user: User } }> {
    return apiService.get<{ user: User }>('/auth/me');
  }

  // Update user profile
  async updateProfile(data: ProfileUpdateData): Promise<{ data: { user: User } }> {
    return apiService.put<{ user: User }>('/auth/profile', data);
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ data: { message: string } }> {
    return apiService.put<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ data: { message: string } }> {
    return apiService.post<{ message: string }>('/auth/forgot-password', { email });
  }

  // Reset password
  async resetPassword(token: string, password: string): Promise<{ data: { message: string } }> {
    return apiService.put<{ message: string }>('/auth/reset-password', {
      token,
      password,
    });
  }

  // Verify email
  async verifyEmail(token: string): Promise<{ data: { message: string } }> {
    return apiService.get<{ message: string }>(`/auth/verify-email?token=${token}`);
  }

  // Logout user
  async logout(): Promise<{ data: { message: string } }> {
    return apiService.post<{ message: string }>('/auth/logout');
  }
}

export const authService = new AuthService();
export default authService;