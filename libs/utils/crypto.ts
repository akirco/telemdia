import CryptoJS from 'crypto-js';

const secret = process.env['KV_TELEGRAM_SECRET'] as string;

export function encrypt(text: string) {
  return CryptoJS.AES.encrypt(text, secret).toString();
}
export function decrypt(text: string) {
  return CryptoJS.AES.decrypt(text, secret).toString(CryptoJS.enc.Utf8);
}
