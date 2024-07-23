import '@/styles/globals.css';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';

import { Providers } from './providers';

import { getApiCredentials } from '@/libs/gramjs/config';

export const metadata: Metadata = {
  title: {
    default: 'tgmedia',
    template: `%s - tgmedia`,
  },
  description: 'A social media manager for Telegram',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { apiId, apiHash } = await getApiCredentials();
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={clsx('min-h-screen bg-background')}>
        <Providers
          themeProps={{
            attribute: 'class',
            defaultTheme: 'dark',
            children: children,
          }}
          ApiContext={{ apiId, apiHash }}
        >
          <div className="flex flex-col h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
