import { getApiCredentials } from '@/libs/gramjs/config';
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
    this.getApiCredentials();
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
    this.connect();
    this.client.addEventHandler((e) => {
      console.log(e);
    });
  }

  async createTelegramClient() {
    const session = await this.getSession();
    this.session = new StringSession(session || '');
    this.client = new TelegramClient(this.session, this.apiId, this.apiHash, {
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
    await this.connect();
    return this.client;
  }

  async singnInWithQRCode({ onError, qrCode, password }: QrCodeAuthParams) {
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
    await localforage.setItem('session', this.client.session.save());
    return user;
  }
  async connect() {
    await this.client.connect();
  }
  async getSession() {
    try {
      const session = await localforage.getItem<string>('session');
      return session;
    } catch (error) {
      return null;
    }
  }
  async getApiCredentials() {
    const apiId = (await getApiCredentials()).apiId;
    const apiHash = (await getApiCredentials()).apiHash;
    this.apiId = +apiId;
    this.apiHash = apiHash;
    return { apiId, apiHash };
  }
}

export default Telegram;
