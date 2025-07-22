import { UserAddress } from './User';

export interface PatchUserAddressesRes {
  ok: number;
  item?: {
    extra: {
      address: UserAddress[];
    };
    updatedAt: string;
  };
  message?: string;
}
