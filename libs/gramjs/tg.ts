import { Logger, TelegramClient } from 'telegram';
import type { QrCodeAuthParams } from 'telegram/client/auth';
import { StringSession } from 'telegram/sessions';
import { apiHash, apiId } from './config';
export class Gram {
  client: TelegramClient;
  private session: StringSession;
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
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
  async singnIn({ onError, qrCode, password }: QrCodeAuthParams) {
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
    return user;
  }
  async signout() {}
}

export default new Gram();
