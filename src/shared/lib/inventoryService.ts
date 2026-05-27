// API Configuration
const API_BASE_URL = 'http://localhost:8082/api/v1';

export interface CreateProductRequest {
  name: string;
  description: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  status: string;
  userId: string;
  deviceType: string;
  interval: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  status: string;
  userId: string;
  deviceType?: string;
  interval?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Crea un nuevo producto (dispositivo) en el backend
 */
export async function createProduct(
  product: CreateProductRequest
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result: ApiResponse<void> = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to create product');
    }
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

/**
 * Obtiene todos los productos
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result: ApiResponse<Product[]> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}

/**
 * Obtiene el producto activo de un cliente
 */
export async function getActiveProductByUserId(userId: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/user/${userId}/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Si es 404, no hay producto activo
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result: ApiResponse<Product> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching active product:', error);
    return null;
  }
}

/**
 * Genera un número de serie aleatorio
 */
export function generateSerialNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${timestamp}-${randomPart}`;
}

/**
 * Obtiene la descripción basada en el tipo de dispositivo
 */
export function getDescriptionByDeviceType(deviceType: string): string {
  const descriptions: Record<string, string> = {
    MEDICAL: 'Dispositivo médico de monitoreo general',
    METABOLIC: 'Monitor de metabolismo y análisis metabólico',
    LIPID: 'Analizador de perfiles de lípidos',
    ELECTROLYTE: 'Monitor de electrolitos y balance iónico',
    BLOOD_COUNT: 'Analizador hematológico completo',
    CARDIOMETABOLIC: 'Monitor cardiometabólico integrado',
    RENAL: 'Monitor de función renal',
    HEMATOMETABOLIC: 'Analizador hematometabólico',
    LIPID_ELECTROLYTE: 'Analizador combinado de lípidos y electrolitos',
    LIPID_HEMATOLOGY: 'Analizador de lípidos y hematología',
    ELECTROLYTE_HEMATOLOGY: 'Monitor de electrolitos y análisis hematológico',
    METABOLIC_COMPREHENSIVE: 'Panel metabólico comprensivo',
    CARDIO_HEMATOLOGY: 'Monitor cardio-hematológico',
    RENAL_HEMATOLOGY: 'Monitor de función renal y hematología',
    ELECTRO_LIPID_HEMATOLOGY: 'Analizador electrolitos, lípidos y hematología',
  };

  return descriptions[deviceType] || 'Dispositivo médico especializado';
}

/**
 * Activa un producto (dispositivo) por id
 */
export async function activateProduct(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<void> = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to activate product');
    }
  } catch (error) {
    console.error('Error activating product:', error);
    throw error;
  }
}

/**
 * Desactiva un producto (dispositivo) por id
 */
export async function deactivateProduct(id: string): Promise<void> {
  try {
    // Backend expone POST /products/deactivate?id=... (controller expects @RequestParam)
    const url = `${API_BASE_URL}/products/deactivate?id=${encodeURIComponent(id)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<void> = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to deactivate product');
    }
  } catch (error) {
    console.error('Error deactivating product:', error);
    throw error;
  }
}
