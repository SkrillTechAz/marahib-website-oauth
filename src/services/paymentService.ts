// services/paymentService.ts
export interface BillingAddress {
  address: string;
  city: string;
  emirate: string;
  country: string;
  postalCode: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  stripe_payment_method_id?: string;
  payment_type: 'card' | 'bank_transfer' | 'digital_wallet';
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: string;
  card_exp_year?: string;
  cardholder_name?: string;
  is_default: boolean;
  billing_address?: BillingAddress;
  metadata?: any;
  created_at: string;
  updated_at: string;
  formatted_card_number?: string;
  formatted_expiry?: string;
}

export interface CreatePaymentMethodData {
  stripe_payment_method_id?: string;
  payment_type?: 'card' | 'bank_transfer' | 'digital_wallet';
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: string;
  card_exp_year?: string;
  cardholder_name?: string;
  is_default?: boolean;
  billing_address?: BillingAddress;
  metadata?: any;
}

export interface UpdatePaymentMethodData {
  id: string;
  cardholder_name?: string;
  card_exp_month?: string;
  card_exp_year?: string;
  is_default?: boolean;
  billing_address?: BillingAddress;
  metadata?: any;
}

export interface CardTokenizationData {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  cardholderName: string;
  billingAddress?: BillingAddress;
}

// Updated to match your API response format
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  payment_methods?: T[];
  payment_method?: T;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class PaymentService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }


  // Get all payment methods for the current user
  async getUserPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment-methods`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse<PaymentMethod> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch payment methods');
      }

      return data.payment_methods || [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  // Get a specific payment method by ID
  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment-methods/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse<PaymentMethod> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch payment method');
      }

      if (!data.payment_method) {
        throw new Error('Payment method not found');
      }

      return data.payment_method;
    } catch (error) {
      console.error('Error fetching payment method:', error);
      throw error;
    }
  }

  // Create a new payment method
  async createPaymentMethod(paymentMethodData: CreatePaymentMethodData): Promise<PaymentMethod> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment-methods`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(paymentMethodData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse<PaymentMethod> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment method');
      }

      if (!data.payment_method) {
        throw new Error('No payment method returned from server');
      }

      return data.payment_method;
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }
  }

  // Update an existing payment method
  async updatePaymentMethod(paymentMethodData: UpdatePaymentMethodData): Promise<PaymentMethod> {
    try {
      const { id, ...updateData } = paymentMethodData;
      
      const response = await fetch(`${API_BASE_URL}/api/payment-methods/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse<PaymentMethod> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update payment method');
      }

      if (!data.payment_method) {
        throw new Error('No payment method returned from server');
      }

      return data.payment_method;
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  }

  // Delete a payment method
  async deletePaymentMethod(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment-methods/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to delete payment method');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  // Set a payment method as default
  async setDefaultPaymentMethod(id: string): Promise<PaymentMethod> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment-methods/${id}/default`, {
        method: 'PATCH', // Using PATCH to match your address API pattern
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse<PaymentMethod> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to set default payment method');
      }

      if (!data.payment_method) {
        throw new Error('No payment method returned from server');
      }

      return data.payment_method;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }

  // Helper method to detect card brand from card number
  detectCardBrand(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\s/g, '').replace(/•/g, '');
    
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
    if (/^3[0689]/.test(cleanNumber)) return 'diners';
    if (/^35/.test(cleanNumber)) return 'jcb';
    
    return 'unknown';
  }

  // Helper method to format card number with spaces
  formatCardNumber(value: string): string {
    const cleanValue = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const limitedValue = cleanValue.substring(0, 16);
    const parts = [];
    
    for (let i = 0; i < limitedValue.length; i += 4) {
      parts.push(limitedValue.substring(i, i + 4));
    }
    
    return parts.join(' ');
  }

  // Helper method to validate card number using Luhn algorithm
  validateCardNumber(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (!/^\d{13,19}$/.test(cleanNumber)) {
      return false;
    }
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  // Helper method to validate expiry date
  validateExpiryDate(month: string, year: string): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    if (expYear > currentYear + 20) return false;
    
    return true;
  }

  // Helper method to validate CVV
  validateCVV(cvv: string, cardBrand?: string): boolean {
    const cleanCvv = cvv.replace(/\D/g, '');
    
    if (cardBrand === 'amex') {
      return /^\d{4}$/.test(cleanCvv);
    } else {
      return /^\d{3}$/.test(cleanCvv);
    }
  }

  // Comprehensive card validation
  validateCardData(cardData: {
    cardNumber: string;
    expMonth: string;
    expYear: string;
    cvv: string;
    cardholderName: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!cardData.cardNumber || !this.validateCardNumber(cardData.cardNumber)) {
      errors.push('Invalid card number');
    }
    
    if (!this.validateExpiryDate(cardData.expMonth, cardData.expYear)) {
      errors.push('Invalid or expired date');
    }
    
    const cardBrand = this.detectCardBrand(cardData.cardNumber);
    if (!this.validateCVV(cardData.cvv, cardBrand)) {
      errors.push('Invalid CVV');
    }
    
    if (!cardData.cardholderName || cardData.cardholderName.trim().length < 2) {
      errors.push('Cardholder name is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Test if the API is working
  async testConnection(): Promise<boolean> {
    try {
      await this.getUserPaymentMethods();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Simulate Stripe tokenization (replace with actual Stripe integration in production)
  async tokenizeCard(cardData: CardTokenizationData): Promise<CreatePaymentMethodData> {
    const validation = this.validateCardData({
      cardNumber: cardData.cardNumber,
      expMonth: cardData.expMonth,
      expYear: cardData.expYear,
      cvv: cardData.cvv,
      cardholderName: cardData.cardholderName
    });
    
    if (!validation.isValid) {
      throw new Error(`Invalid card data: ${validation.errors.join(', ')}`);
    }
    
    const cleanCardNumber = cardData.cardNumber.replace(/\s/g, '');
    const last4 = cleanCardNumber.slice(-4);
    const brand = this.detectCardBrand(cleanCardNumber);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      stripe_payment_method_id: `pm_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      payment_type: 'card',
      card_brand: brand,
      card_last4: last4,
      card_exp_month: cardData.expMonth.padStart(2, '0'),
      card_exp_year: cardData.expYear,
      cardholder_name: cardData.cardholderName,
      billing_address: cardData.billingAddress,
    };
  }

  // Get formatted display text for payment method
  getPaymentMethodDisplay(paymentMethod: PaymentMethod): string {
    if (paymentMethod.payment_type === 'card' && paymentMethod.card_brand && paymentMethod.card_last4) {
      return `${paymentMethod.card_brand.toUpperCase()} •••• ${paymentMethod.card_last4}`;
    }
    return 'Payment Method';
  }

  // Get card brand icon/color class
  getCardBrandClass(brand?: string): string {
    switch (brand?.toLowerCase()) {
      case 'visa': return 'bg-blue-100 text-blue-700';
      case 'mastercard': return 'bg-red-100 text-red-700';
      case 'amex': return 'bg-green-100 text-green-700';
      case 'discover': return 'bg-orange-100 text-orange-700';
      case 'diners': return 'bg-purple-100 text-purple-700';
      case 'jcb': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  // Format expiry date for display
  formatExpiry(month?: string, year?: string): string {
    if (!month || !year) return '';
    return `${month.padStart(2, '0')}/${year}`;
  }

  // Check if payment method is expired
  isPaymentMethodExpired(month?: string, year?: string): boolean {
    if (!month || !year) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expYear < currentYear) return true;
    if (expYear === currentYear && expMonth < currentMonth) return true;
    
    return false;
  }
}

export const paymentService = new PaymentService();