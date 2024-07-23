import { decrypt } from '@/libs/utils/crypto';
import { kv } from '@vercel/kv';
export const getApiCredentials = async () => {
  const apiId = (await kv.get('apiId')) as string;
  const apiHash = (await kv.get('apiHash')) as string;
  return {
    apiId: decrypt(apiId),
    apiHash: decrypt(apiHash),
  };
};

export type ApiCredentials = Awaited<ReturnType<typeof getApiCredentials>>;
