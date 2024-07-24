import { localforage } from '@/libs/utils';
import { TelegramClient } from 'telegram';
import { QrCodeAuthParams } from 'telegram/client/auth';
import { StringSession } from 'telegram/sessions';

export class Telegram {
  public client: TelegramClient;
  public session: StringSession;
  public apiId: number;
  public apiHash: string;

  constructor(session: StringSession, apiId: number, apiHash: string) {
    this.session = session;
    this.apiId = apiId;
    this.apiHash = apiHash;
    this.client = new TelegramClient(session, apiId, apiHash, {
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
        apiHash: this.apiHash,
        apiId: this.apiId,
      },
      {
        onError,
        qrCode,
        password,
      }
    );
    await localforage.setItem('tg_session', this.client.session.save());
    return user;
  }
  async connect() {
    await this.client.connect();
  }
  async getSession() {
    try {
      const session = await localforage.getItem<string | undefined>(
        'tg_session'
      );
      return session;
    } catch (error) {
      return '';
    }
  }
}

export default Telegram;
