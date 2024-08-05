import { getMediaType } from '@/libs/gramjs/helper';
import { localforage } from '@/libs/utils/localforage';
import PackageJson from '@/package.json';
import { toast } from 'sonner';
import { Api, Logger, TelegramClient } from 'telegram';
import { QrCodeAuthParams } from 'telegram/client/auth';
import { LogLevel } from 'telegram/extensions/Logger';
import { StringSession } from 'telegram/sessions';

class Telegram {
  public client: TelegramClient;
  public session: StringSession;
  private apiId: number;
  private apiHash: string;

  constructor(session: StringSession, apiId: number, apiHash: string) {
    this.session = session;
    this.apiId = apiId;
    this.apiHash = apiHash;
    this.client = new TelegramClient(session, apiId, apiHash, {
      connectionRetries: 5,
      baseLogger: new Logger(LogLevel.INFO),
      deviceModel: navigator.userAgent || 'TG-Media',
      appVersion: PackageJson.version,
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
    this.listenSessionUpdate(this.client);
  }
  async isUserAuthorized() {
    return await this.client.isUserAuthorized();
  }

  async singnInWithQRCode({ onError, qrCode, password }: QrCodeAuthParams) {
    try {
      await this.connect();
      if (await this.isUserAuthorized()) return;

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
      await localforage.setItem('tg_user', user);
      return user;
    } catch (error) {
      toast.error(error as string);
    }
  }
  async connect() {
    try {
      await this.client.connect();
    } catch (error) {
      toast.error(error as string);
    }
  }
  static async getSession() {
    try {
      const session = await localforage.getItem<string>('tg_session');
      return session ? session : '';
    } catch {
      return '';
    }
  }

  async getState() {
    try {
      await this.client.connect(); // This assumes you have already authenticated with .start()
      const result = await this.client.invoke(new Api.updates.GetState());
      console.log(result); // prints the result
    } catch (error) {
      console.error(error);
    }
  }

  async listenSessionUpdate(telegram: TelegramClient) {
    try {
      const handler = (update: any) => {
        if (update instanceof Api.UpdatesTooLong) {
          console.log(update, 'session过期');
          localforage.removeItem('tg_session');
          localforage.removeItem('tg_user');
          // this.handleTerminatedSession();
        } else if (update instanceof Api.UpdateConfig) {
          const currentUser: any = (
            update as Api.UpdateConfig & {
              _entities?: (Api.TypeUser | Api.TypeChat)[];
            }
          )._entities?.find(
            (entity) =>
              entity instanceof Api.User &&
              buildApiPeerId(entity.id, 'user') === currentUser.id
          );
          if (!(currentUser instanceof Api.User)) return;
        }
      };

      telegram.addEventHandler(handler);
    } catch (error) {
      console.error('监听设备退出会话事件时出错:', error);
    }
  }
  async handleTerminatedSession() {
    try {
      await this.client.invoke(
        new Api.account.ResetAuthorization({
          hash: (await this.client.getMe()).id,
        })
      );
    } catch (err: any) {
      if (
        err.message === 'AUTH_KEY_UNREGISTERED' ||
        err.message === 'SESSION_REVOKED'
      ) {
        console.log('用户会话已过期，正在重新登录');
      }
    }
  }
  async getAllChats() {
    try {
      await this.connect();
      const dialogs = await this.client.getDialogs({ archived: false });
      return dialogs.map((dialog) => ({ title: dialog.title, id: dialog.id }));
    } catch (error) {
      toast.error(error as string);
    }
  }
  // 获取频道信息列表
  async getChannels() {
    try {
      await this.connect();
      const dialogs = await this.client.getDialogs({ archived: false });
      return dialogs
        .filter((dialog) => dialog.isChannel)
        .map((dialog) => ({ title: dialog.title, id: dialog.id }));
    } catch (error) {
      toast.error(error as string);
    }
  }
  // 获取收藏夹信息，包括视频、图片等所有类型的消息列表
  async getSavedMessages() {
    try {
      await this.connect();
      const savedMessages = await this.client.getMessages('me');
      return savedMessages.map((message) => ({
        id: message.id,
        tags: message.message,
        media: message.media ? getMediaType(message.media) : null,
        date: message.date,
      }));
    } catch (error) {
      toast.error(error as string);
    }
  }
  async getPhoto() {
    try {
      await this.connect();
      const photos = await this.client.getMessages('me', {
        limit: 1,
        filter: new Api.InputMessagesFilterPhotos(),
      });

      return this.client.downloadMedia(photos[0], {});
    } catch (error) {
      toast.error(error as string);
    }
  }
  async downloadFile({
    FILE_ID,
    ACCESS_HASH,
    FILE_REFERENCE,
    thumbSize,
  }: {
    FILE_ID: bigInt.BigInteger;
    ACCESS_HASH: bigInt.BigInteger;
    FILE_REFERENCE: string;
    thumbSize: string;
    offset: bigInt.BigInteger;
  }) {
    const result = await this.client.invoke(
      new Api.upload.GetFile({
        location: new Api.InputDocumentFileLocation({
          id: FILE_ID,
          accessHash: ACCESS_HASH,
          fileReference: Buffer.from(FILE_REFERENCE, 'base64'),
          thumbSize,
        }),
        limit: 1024 * 1024,
      })
    );
    return result;
  }
}

export default Telegram;

function buildApiPeerId(
  id: bigInt.BigInteger,
  type: 'user' | 'chat' | 'channel'
) {
  return type === 'user' ? String(id) : `-${id}`;
}
