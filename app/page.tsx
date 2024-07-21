'use client';
import { localforage } from '@/libs/utils';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    localforage.getItem('session').then((session) => {
      if (!session) {
        window.location.href = '/auth';
      }
    });
  }, []);
  return (
    <main className="mx-auto pt-16 flex justify-center flex-col items-center">
      {/* <LoginQRCode /> */}
      hello
    </main>
  );
}
