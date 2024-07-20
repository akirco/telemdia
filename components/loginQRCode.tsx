'use client';
import Gram from '@/libs/gramjs/tg';
import { localforage } from '@/libs/utils';
import { Input } from '@nextui-org/input';
import { useEffect, useState } from 'react';
import QrCode from './qrcode';

const LoginQRCode = () => {
  const [qrcode, setQrcode] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [pwd, setPwd] = useState('');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    Gram.singnIn({
      onError: (e) => {},
      qrCode: async ({ token, expires }) => {
        setQrcode(`tg://login?token=${token.toString('base64')}`);
      },
      password: async (hint) => {
        const pwd = await new Promise((resolve) => {
          setShowInput(true);
          if (checked) {
            return resolve(pwd);
          }
        });
        console.log('pwd', pwd);
        return pwd as string;
      },
    }).then((user) => {
      console.log('user', user);
      localforage.setItem('session', Gram.client.session.save());
    });
  }, [qrcode, showInput, checked]);
  return showInput ? (
    <Input
      value={pwd}
      onChange={(e) => setPwd(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && pwd.length > 0) {
          setChecked(true);
          console.log('pwd', pwd);
        }
      }}
      size="lg"
      label="Password"
      variant="bordered"
      placeholder="Enter your password"
    />
  ) : (
    <>
      {qrcode ? <QrCode qrstr={qrcode} /> : <></>}
      <div className="pt-6">
        <h1 className="text-center text-xl font-semibold">
          Log in to Telegram by QR Code
        </h1>
        <div className="text-wrap max-w-[300px]">
          <span className="flex gap-3 pt-4">
            <p className="w-6 h-6 text-sm rounded-full bg-indigo-700 text-center flex items-center justify-center">
              1
            </p>
            <p className="flex-1 break-words">
              Open your Telegram app on your Phone
            </p>
          </span>
          <span className="flex gap-3 pt-4">
            <p className="w-6 h-6 text-sm rounded-full bg-indigo-700 text-center flex items-center justify-center">
              2
            </p>
            <p className="flex-1 break-words">
              Go to settings &gt; Devices &gt; Link Desktop Device
            </p>
          </span>
          <span className="flex gap-3 pt-4">
            <p className="w-6 h-6 text-sm rounded-full bg-indigo-700 text-center flex items-center justify-center">
              3
            </p>
            <p className="flex-1 break-words">
              Point your phone at this screen to confirm login
            </p>
          </span>
        </div>
      </div>
    </>
  );
};

export default LoginQRCode;
