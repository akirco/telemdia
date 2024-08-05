import { useTelegramContext } from '@/app/providers';
import { useEffect, useState } from 'react';
import Telegram from '../gramjs/telegram';

export const useTelegram = () => {
  const [tgClient, setTgClient] = useState<Telegram | null>(null);
  const tg = useTelegramContext();
  useEffect(() => {
    if (tg) {
      setTgClient(tg);
    }
  }, [tg]);
  return tgClient;
};
