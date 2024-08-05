import { Api } from 'telegram';

export function getMediaType(media: Api.TypeMessageMedia) {
  if (media instanceof Api.MessageMediaPhoto) {
    return { type: 'photo', media };
  } else if (media instanceof Api.MessageMediaDocument) {
    const document = media.document as Api.Document;
    if (document.mimeType.startsWith('video/')) {
      return { type: 'video', media };
    } else if (document.mimeType.startsWith('image/')) {
      return { type: 'image', media };
    } else {
      return { type: 'document', media };
    }
  } else {
    return { type: 'other', media };
  }
}

export function bytesToBase64(bytes: string | any[]) {
  let mod3;
  let result = '';

  for (let nLen = bytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
    mod3 = nIdx % 3;
    nUint24 |= bytes[nIdx] << ((16 >>> mod3) & 24);
    if (mod3 === 2 || nLen - nIdx === 1) {
      result += String.fromCharCode(
        uint6ToBase64((nUint24 >>> 18) & 63),
        uint6ToBase64((nUint24 >>> 12) & 63),
        uint6ToBase64((nUint24 >>> 6) & 63),
        uint6ToBase64(nUint24 & 63)
      );
      nUint24 = 0;
    }
  }

  return result;
  // return result.replace( /A(?=A$|$)/g, '=' );
}

function uint6ToBase64(nUint6: number) {
  return nUint6 < 26
    ? nUint6 + 65
    : nUint6 < 52
      ? nUint6 + 71
      : nUint6 < 62
        ? nUint6 - 4
        : nUint6 === 62
          ? 43
          : nUint6 === 63
            ? 47
            : 65;
}
