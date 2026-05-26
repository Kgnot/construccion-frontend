const API_URL = 'http://localhost:8082/api/v1/customers';

export interface LoginRequest {
  email: string;
  documentNumber: string;
}

export interface LoginResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  documentType: string;
  documentNumber: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function loginCustomer(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Autenticación fallida',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error during login:', error);
    return {
      success: false,
      message: 'Error de conexión con el servidor',
    };
  }
}

