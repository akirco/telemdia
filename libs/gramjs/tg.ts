import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { apiHash, apiId } from './config';

const stringSession = new StringSession(process.env.TELEGRAM_SESSION || '');

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
  useWSS: false,
  proxy: {
    ip: '127.0.0.1',
    port: 1081,
    MTProxy: false,
    secret: '',
    socksType: 5,
    timeout: 2,
  },
});

interface QrCodeAuthParams {
  qrcodeCallback: (qrCode: { token: Buffer; expires: number }) => Promise<void>;
  pwdCallback: (hint?: string) => Promise<string>;
}

const init = async ({ qrcodeCallback, pwdCallback }: QrCodeAuthParams) => {
  // await client.disconnect();

  await client.connect();
  const user = await client.signInUserWithQrCode(
    {
      apiHash,
      apiId,
    },
    {
      onError: (err) => {},
      qrCode: qrcodeCallback,
      password: pwdCallback,
    }
  );
  if (user) {
    return user;
  }
};

export { client, init };
