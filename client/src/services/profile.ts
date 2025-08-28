import { authService } from './auth';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  farm_name: string | null;
  location: string | null;
  farm_size: string | null;
  crops: string[] | null;
  created_at: string;
  updated_at: string;
}

export class ProfileService {
  private baseUrl = '/api';

  async getProfile(): Promise<{ data: Profile | null; error: any }> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${this.baseUrl}/profile`, {
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async updateProfile(updates: Partial<Profile>): Promise<{ data: Profile | null; error: any }> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}

export const profileService = new ProfileService();