'use client';
import { localforage } from '@/libs/utils';
import { useEffect, useState } from 'react';
import { Api } from 'telegram';
import { useTelegramContext } from './providers';
export default function Home() {
  const [me, setMe] = useState<Api.User>();
  const telegram = useTelegramContext();
  useEffect(() => {
    localforage.getItem('session').then((session) => {
      if (!session) {
        window.location.href = '/auth';
      }
    });
  }, []);

  useEffect(() => {
    if (telegram) {
      console.log('telegram', telegram.client);
      telegram.connect().then(() => {
        telegram.client.getMe().then((user) => {
          console.log('user', user);
        });
      });
    }
  }, [telegram]);
  return (
    <main className="m-auto pt-16 flex justify-center flex-col items-center"></main>
  );
}
