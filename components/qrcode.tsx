'use client';
import blankUrl from '@/public/telegram-logo.svg';
import { useEffect, useRef } from 'react';

import QRCodeStyling, {
  Options as QRCodeStylingOptions,
} from 'qr-code-styling';

const qrOptions: QRCodeStylingOptions = {
  width: 300,
  height: 300,
  image: blankUrl.src,
  margin: 10,
  type: 'svg',
  dotsOptions: {
    type: 'rounded',
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
  },
  imageOptions: {
    imageSize: 0.8,
    margin: 8,
  },
  qrOptions: {
    errorCorrectionLevel: 'M',
  },
};

const useQRCodeStyling = (
  options: QRCodeStylingOptions
): QRCodeStyling | null => {
  if (typeof window !== 'undefined') {
    const QRCodeStylingLib = require('qr-code-styling');
    const qrCodeStyling: QRCodeStyling = new QRCodeStylingLib(options);
    return qrCodeStyling;
  }
  return null;
};

const QrCode = ({ qrstr }: { qrstr: string }) => {
  console.log('qrstr', qrstr);
  const qrCode = useQRCodeStyling(qrOptions);
  const ref = useRef<any>(null);

  useEffect(() => {
    qrCode?.append(ref.current);
  }, [ref, qrCode]);

  useEffect(() => {
    qrCode?.update({
      data: `${qrstr}`,
    });
  }, [qrCode, qrstr]);

  return <div ref={ref} className="qrcode"></div>;
};

export default QrCode;
