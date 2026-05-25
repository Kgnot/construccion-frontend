export type DeviceResponse = {
    id: string,
    name: string,
    description: string,
    serialNumber: string,
    model: string,
    manufacturer: string,
    status: string
}

const url = 'http://localhost:8082/api/v1/products';

export async function getDevicesUseCase(): Promise<DeviceResponse[]> {
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
    const data: DeviceResponse[] = res.data || [];
    return data;
}

