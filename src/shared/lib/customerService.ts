// API Configuration
const API_BASE_URL = 'http://localhost:8082/api/v1';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  documentType: string;
  documentNumber: string;
  birthDate: string | null;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  documentType: string;
  document: string;
  birthDay: string;
}

export interface LoginRequest {
  email: string;
  documentNumber: string;
}

export interface LoginResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  documentType: string | null;
  documentNumber: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Obtiene todos los clientes del backend
 */
export async function getAllCustomers(): Promise<Customer[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result: ApiResponse<Customer[]> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result: ApiResponse<Customer> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
}

/**
 * Crea un nuevo cliente en el backend
 */
export async function createCustomer(
  customer: CreateCustomerRequest
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result: ApiResponse<void> = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to create customer');
    }
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

/**
 * Inicia sesión verificando email y documentNumber
 */
export async function login(
  credentials: LoginRequest
): Promise<LoginResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 404) {
        return null; // Credenciales inválidas
      }
      throw new Error(`Error: ${response.statusText}`);
    }

    const result: ApiResponse<LoginResponse> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

