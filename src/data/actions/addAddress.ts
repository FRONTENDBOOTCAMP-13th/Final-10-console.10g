import axios from 'axios';
import type { ApiResPromise } from '@/types';
import type { UserAddress } from '@/types/User';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

interface AddAddressPayload {
  extra: {
    address: UserAddress[];
  };
  address?: string;
}

export async function addAddress(userId: number, accessToken: string, newAddress: Omit<UserAddress, 'id'>): ApiResPromise<{ ok: number }> {
  try {
    const authAPI = axios.create({
      baseURL: API_URL,
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { data: user } = await authAPI.get(`/users/${userId}`);
    const currentAddresses: UserAddress[] = user.item.extra?.address || [];
    const lastId = currentAddresses.length > 0 ? currentAddresses[currentAddresses.length - 1].id : 0;

    const newAddressWithId: UserAddress = {
      id: lastId + 1,
      ...newAddress,
    };

    const updatedAddresses = newAddressWithId.isDefault
      ? [
          ...currentAddresses.map(addr => ({
            ...addr,
            isDefault: false,
          })),
          newAddressWithId,
        ]
      : [...currentAddresses, newAddressWithId];

    const payload: AddAddressPayload = {
      extra: {
        address: updatedAddresses,
      },
    };

    if (newAddressWithId.isDefault) {
      payload.address = `${newAddressWithId.value} ${newAddressWithId.detailAddress}`;
    }

    const { data: result } = await authAPI.patch(`/users/${userId}`, payload);
    return result;
  } catch (error) {
    console.error('addAddress Error (axios):', error);
    throw error;
  }
}
