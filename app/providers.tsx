'use client';

import { NextUIProvider } from '@nextui-org/system';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { ApiCredentials } from '@/libs/gramjs/config';
import Telegram from '@/libs/gramjs/telegram';
import { localforage } from '@/libs/utils';
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
  const stringSession = new StringSession(authKey);

  // useEffect(() => {
  //   telegramRef.current = new Telegram(
  //     authKey,
  //     +ApiContext.apiId,
  //     ApiContext.apiHash
  //   );

  //   // 从localforage获取会话信息并更新authKey
  //   localforage.getItem('session').then((session) => {
  //     if (session) {
  //       setAuthKey(new StringSession(session as string));
  //     }
  //   });
  // }, [ApiContext.apiId, ApiContext.apiHash]);

  // useEffect(() => {
  //   // 在authKey更新时重新创建Telegram实例
  //   if (authKey) {
  //     telegramRef.current = new Telegram(
  //       authKey,
  //       +ApiContext.apiId,
  //       ApiContext.apiHash
  //     );
  //   }
  // }, [authKey, ApiContext.apiId, ApiContext.apiHash]);

  useEffect(() => {
    localforage.getItem<string>('session').then((session) => {
      if (session) {
        setAuthKey(session);
      }
    });
    console.log('authKey', authKey);
    console.log('apiID', ApiContext.apiId);
    console.log('apiHash', ApiContext.apiHash);
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
