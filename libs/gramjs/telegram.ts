import { localforage } from '@/libs/utils';
import { TelegramClient } from 'telegram';
import type { QrCodeAuthParams } from 'telegram/client/auth';
import { StringSession } from 'telegram/sessions';
import { apiHash, apiId } from './config';
export class Telegram {
  client: TelegramClient;
  private session: StringSession;

  constructor() {
    this.session = new StringSession();
    this.client = new TelegramClient(this.session, apiId, apiHash, {
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
  }

  async singnInWithQRCode({ onError, qrCode, password }: QrCodeAuthParams) {
    await this.client.connect();
    const user = await this.client.signInUserWithQrCode(
      {
        apiHash,
        apiId,
      },
      {
        onError,
        qrCode,
        password,
      }
    );
    await localforage.setItem('session', this.client.session.save());
    return user;
  }
  async singInWithOTP(phoneNumber: string) {
    await this.client.connect();
    await this.client.sendCode(
      {
        apiId,
        apiHash,
      },
      phoneNumber,
      false
    );
  }
}

export default new Telegram();
