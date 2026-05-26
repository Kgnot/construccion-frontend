import type { Product } from "../../../shared/lib/inventoryService";

export async function GetProductByUserIdUseCase(userId: string): Promise<Product | null> {
    const url = `http://localhost:8082/api/v1/products/user/${userId}/active`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(!response.ok) {
        throw new Error('Failed to fetch devices');
    }

    const res = await response.json();
    const product: Product | null = res.data || null;
    return product;
}