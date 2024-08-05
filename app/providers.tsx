'use client';

import { NextUIProvider } from '@nextui-org/system';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { ApiCredentials } from '@/libs/gramjs/config';
import Telegram from '@/libs/gramjs/telegram';
import { createContext, useContext, useEffect, useState } from 'react';
import { StringSession } from 'telegram/sessions';

interface TelegramContextProps {
  telegram: Telegram | null;
}

const TelegramContext = createContext<TelegramContextProps | undefined>(
  undefined
);

export const useTelegramContext = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error(
      'useTelegramApiContext must be used within a TelegramProvider'
    );
  }
  return context.telegram;
};

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  ApiContext: ApiCredentials;
}

export function Providers({
  children,
  ApiContext,
  themeProps,
}: ProvidersProps) {
  const router = useRouter();
  const [telegram, setTelegram] = useState<Telegram | null>(null);
  const [authKey, setAuthKey] = useState<string>('');

  useEffect(() => {
    async function fetchSession() {
      const session = await Telegram.getSession();
      if (session) {
        router.push('/');
      } else {
        router.push('/auth');
      }
      setAuthKey(session);
    }
    fetchSession();
  }, [authKey]);

  useEffect(() => {
    const stringSession = new StringSession(authKey);
    console.log('stringSession', stringSession);
    console.log(ApiContext.apiId, ApiContext.apiHash);

    const telegramInstance = new Telegram(
      stringSession,
      +ApiContext.apiId,
      ApiContext.apiHash
    );

    setTelegram(telegramInstance);
  }, [authKey, ApiContext.apiId, ApiContext.apiHash]);

  return (
    <TelegramContext.Provider value={{ telegram }}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </NextUIProvider>
    </TelegramContext.Provider>
  );
}
