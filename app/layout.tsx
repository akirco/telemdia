import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';

import { Providers } from './providers';

import Heading from '@/components/heading';
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
      <body className="min-h-screen bg-pattern h-full w-full overflow-hidden">
        <Providers
          themeProps={{
            attribute: 'class',
            children: children,
            enableSystem: true,
          }}
          ApiContext={{ apiId, apiHash }}
        >
          <div className="flex flex-col h-screen">
            <Heading />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
