// API Configuration
const API_BASE_URL = 'http://localhost:8082/api/v1';

export interface PurchaseOrder {
  id: string;
  purchaseOrderId?: string;
  orderNumber: string;
  orderDate?: string | null;
  expectedDeliveryDate?: string | null;
  supplierId: string;
  status: string;
  totalAmount: number;
  notes?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  raw?: Record<string, unknown>;
}

export interface CreatePurchaseOrderRequest {
  orderNumber: string;
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  totalAmount: number;
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

const toRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
};

const normalizeAmount = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/,/g, '').trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
};

const normalizePurchaseOrder = (value: unknown): PurchaseOrder => {
  const raw = toRecord(value);

  const purchaseOrderId = firstString(raw.purchaseOrderId, raw.id, raw.uuid) ?? 'purchase-order';
  const orderNumber = firstString(raw.orderNumber, raw.number, raw.code) ?? 'Sin número';
  const supplierId = firstString(raw.supplierId, raw.providerId, raw.vendorId) ?? '—';
  const status = firstString(raw.status, raw.state) ?? 'PENDING';
  const orderDate = firstString(raw.orderDate, raw.date, raw.createdDate) ?? null;
  const expectedDeliveryDate = firstString(raw.expectedDeliveryDate, raw.deliveryDate, raw.expectedDate) ?? null;
  const notes = firstString(raw.notes, raw.observations, raw.description);
  const createdAt = firstString(raw.createdAt, raw.createdDate, raw.creationDate) ?? null;
  const updatedAt = firstString(raw.updatedAt, raw.updatedDate, raw.lastModifiedAt) ?? null;
  const totalAmount = normalizeAmount(raw.totalAmount ?? raw.amount ?? raw.total ?? raw.subtotal);

  return {
    id: purchaseOrderId,
    purchaseOrderId,
    orderNumber,
    orderDate,
    expectedDeliveryDate,
    supplierId,
    status,
    totalAmount,
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
 * Obtiene todas las órdenes de compra del backend.
 */
export async function getAllPurchaseOrders(): Promise<PurchaseOrder[]> {
  const response = await fetch(`${API_BASE_URL}/purchase-orders`, {
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
    return result.data.map(normalizePurchaseOrder);
  }

  return [];
}

/**
 * Crea una nueva orden de compra en el backend.
 */
export async function createPurchaseOrder(order: CreatePurchaseOrderRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/purchase-orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const result = await parseJson<ApiResponse<unknown>>(response);

  if (result && !result.success) {
    throw new Error(result.message || 'Failed to create purchase order');
  }
}

export const purchaseOrderApi = {
  getAllPurchaseOrders,
  createPurchaseOrder,
};


