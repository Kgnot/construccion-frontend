// API Configuration
const API_BASE_URL = 'http://localhost:8082/api/v1';

export interface Supplier {
  id: string;
  displayName: string;
  businessName?: string;
  tradeName?: string;
  companyName?: string;
  legalName?: string;
  taxId?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  status?: string;
  notes?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  raw?: Record<string, unknown>;
}

export interface CreateSupplierRequest {
  businessName: string;
  tradeName: string;
  taxId: string;
  contactName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: string;
  notes: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const firstString = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
};

const normalizeStatus = (status?: string) => {
  if (!status) return 'Activo';
  return status.trim();
};

const toRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
};

const normalizeSupplier = (value: unknown): Supplier => {
  const raw = toRecord(value);

  const companyName = firstString(
    raw.businessName,
    raw.companyName,
    raw.legalName,
    raw.name,
    raw.businessName,
    raw.tradeName,
    raw.supplierName,
  );

  const tradeName = firstString(raw.tradeName, raw.companyName, raw.businessName, raw.name);

  const contactName = firstString(
    raw.contactName,
    raw.contactPerson,
    raw.contact,
    raw.responsible,
  );

  const taxId = firstString(raw.taxId, raw.nit, raw.documentNumber, raw.identificationNumber);
  const email = firstString(raw.email, raw.mail, raw.contactEmail);
  const phone = firstString(raw.phone, raw.mobile, raw.cellPhone, raw.contactPhone);
  const address = firstString(raw.address, raw.street, raw.location);
  const city = firstString(raw.city, raw.town, raw.municipality);
  const country = firstString(raw.country, raw.nation, raw.countryName);
  const status = normalizeStatus(firstString(raw.status, raw.state));
  const notes = firstString(raw.notes, raw.observations, raw.comments, raw.description);
  const createdAt = firstString(raw.createdAt, raw.createdDate, raw.creationDate) ?? null;
  const updatedAt = firstString(raw.updatedAt, raw.updatedDate, raw.lastModifiedAt) ?? null;
  const id = firstString(raw.id, raw.supplierId, raw.code, raw.uuid, taxId, companyName) ?? 'supplier';

  return {
    id,
    displayName: companyName ?? 'Proveedor sin nombre',
    businessName: firstString(raw.businessName, raw.companyName, raw.legalName, raw.name),
    tradeName,
    companyName,
    legalName: firstString(raw.legalName, raw.companyName, raw.name),
    taxId,
    contactName,
    email,
    phone,
    address,
    city,
    country,
    status,
    notes,
    createdAt,
    updatedAt,
    raw,
  };
};

const parseJson = async <T>(response: Response): Promise<T | null> => {
  const text = await response.text();
  if (!text.trim()) {
    return null;
  }

  return JSON.parse(text) as T;
};

/**
 * Obtiene todos los proveedores del backend.
 */
export async function getAllSuppliers(): Promise<Supplier[]> {
  const response = await fetch(`${API_BASE_URL}/suppliers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const result = await parseJson<ApiResponse<unknown[]>>(response);

  if (result?.success && Array.isArray(result.data)) {
    return result.data.map(normalizeSupplier);
  }

  return [];
}

/**
 * Crea un nuevo proveedor en el backend.
 */
export async function createSupplier(supplier: CreateSupplierRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/suppliers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(supplier),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const result = await parseJson<ApiResponse<unknown>>(response);

  if (result && !result.success) {
    throw new Error(result.message || 'Failed to create supplier');
  }
}


