// services/profileService.ts
export interface Profile {
  id: string;
  user_id: string;
  business_name: string | null;
  phone: string | null;
  address: string | null;
  dateOfBirth: string | null;
  profile_image_url: string | null;
  user_type: 'vendor' | 'designer' | 'admin' | 'customer';
  commission_rate: number;
  status: string | null;
  location: string | null;
  stripe_id: string | null;
  created_at: string;
  updated_at: string;
}

class ProfileService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

   /* ---------- GET /api/profile ---------- */
  async getMyProfile(): Promise<Profile | null> {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error((await res.json()).message || 'Fetch failed');
    }
    const json = await res.json();
    return json.profile;
  }

  /* ---------- PUT /api/profile/:userId ---------- */
  async updateProfile(userId: string, data: Partial<Profile>) {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/profile/${userId}`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) throw new Error((await res.json()).message || 'Update failed');
    return res.json();
  }
}

export const profileService = new ProfileService();