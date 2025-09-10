// services/addressService.ts
export interface Address {
  id: string;
  user_id: string;
  address_type: 'shipping' | 'billing' | 'home' | 'work' | 'other';
  is_default: boolean;
  full_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  formatted_address?: string;
  formatted_name?: string;
}

export interface CreateAddressData {
  address_type: 'shipping' | 'billing' | 'home' | 'work' | 'other';
  is_default?: boolean;
  full_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id: string;
}

class AddressService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Get all addresses for the current user
  async getUserAddresses(): Promise<Address[]> {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/addresses`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch addresses');
    }

    const data = await response.json();
    return data.addresses || [];
  }

  // Get a specific address by ID
  async getAddress(id: string): Promise<Address> {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/addresses/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();
    return data.address;
  }

  // Create a new address
  async createAddress(addressData: CreateAddressData): Promise<Address> {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/addresses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create address');
    }

    const data = await response.json();
    return data.address;
  }

  // Update an existing address
  async updateAddress(addressData: UpdateAddressData): Promise<Address> {
    const { id, ...updateData } = addressData;
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/addresses/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update address');
    }

    const data = await response.json();
    return data.address;
  }

  // Delete an address
  async deleteAddress(id: string): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/addresses/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete address');
    }
  }

  // Set an address as default
  async setDefaultAddress(id: string): Promise<Address> {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/addresses/${id}/default`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to set default address');
    }

    const data = await response.json();
    return data.address;
  }
}

export const addressService = new AddressService();