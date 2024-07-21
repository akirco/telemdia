'use client';
import QrCode from '@/components/qrcode';
import Gram from '@/libs/gramjs/telegram';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { CircularProgress } from '@nextui-org/progress';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

let resolvers = new Map<string, Function>();

export default function Auth() {
  const [qrcode, setQrcode] = useState('');
  const [step, setStep] = useState(1);
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const pwdRef = useRef('');

  useEffect(() => {
    Gram.singnInWithQRCode({
      onError: (e) => {
        setError(e.message);
        setStep(1);
      },
      qrCode: async ({ token, expires }) => {
        setQrcode(`tg://login?token=${token.toString('base64')}`);
      },
      password: async (hint) => {
        setStep(2);
        return new Promise((resolve) => {
          resolvers.set('password', resolve);
        });
      },
    }).then((user) => {
      setStep(3);
      console.log('user', user);
    });
  }, []);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPwd(e.currentTarget.value);
    pwdRef.current = e.currentTarget.value;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && pwd.length > 0) {
      const passwordResolver = resolvers.get('password');
      if (passwordResolver) {
        passwordResolver(pwdRef.current);
      }
    }
  };

  switch (step) {
    case 1:
      return (
        <div className="m-auto">
          {qrcode ? (
            <QrCode qrstr={qrcode} />
          ) : (
            <div className="h-[300px] w-[300px] rounded-3xl shadow-md flex justify-center items-center">
              <CircularProgress
                classNames={{
                  svg: 'w-36 h-36 drop-shadow-md',
                  indicator: 'black',
                  track: 'black',
                  value: 'text-3xl font-semibold text-white',
                }}
                strokeWidth={4}
                showValueLabel={true}
              />
            </div>
          )}
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
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      );
    case 2:
      return (
        <Input
          value={pwd}
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
          size="lg"
          label="Password"
          variant="bordered"
          placeholder="Enter your password"
        />
      );
    case 3:
      return (
        <div>
          <h1 className="text-center text-xl font-semibold">
            Successfully logged in
          </h1>
          <Button onClick={() => console.log('Proceed to next step')}>
            Continue
          </Button>
        </div>
      );
  }
}
