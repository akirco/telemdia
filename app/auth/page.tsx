'use client';
import { useTelegramContext } from '@/app/providers';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/icons';
import QrCode from '@/components/qrcode';
import '@/styles/transitions.css';
import { Input } from '@nextui-org/input';
import { CircularProgress } from '@nextui-org/progress';
import { useRouter } from 'next/navigation';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

let resolvers = new Map<string, Function>();

export default function Auth() {
  const [qrcode, setQrcode] = useState('');
  const [step, setStep] = useState(1);
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const pwdRef = useRef('');
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const telegram = useTelegramContext();
  const nodeRef = useRef(null);
  useEffect(() => {
    if (telegram) {
      telegram
        .singnInWithQRCode({
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
        })
        .then(() => {
          router.push('/');
        });
    }
  }, [telegram]);

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

  return (
    <TransitionGroup className="m-auto">
      <CSSTransition
        nodeRef={nodeRef}
        key={step}
        timeout={300}
        classNames="fade"
      >
        <div
          ref={nodeRef}
          className="flex flex-col text-center max-w-[525px] gap-6 px-6"
        >
          {step === 1 && (
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
                    label=""
                    aria-label="progress"
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
              {error && (
                <p className="text-red-500 text-center mt-4">{error}</p>
              )}
            </div>
          )}
          {step === 2 && (
            <>
              <h1 className="text-6xl font-black">Enter Password</h1>
              <p>
                You have Two-Step Verification enabled, so your account is
                protected with an additional password.
              </p>
              <Input
                value={pwd}
                onChange={handlePasswordChange}
                onKeyDown={handleKeyDown}
                size="lg"
                variant="bordered"
                aria-label='"Enter Password"'
                placeholder="Enter your password"
                type={isVisible ? 'text' : 'password'}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
            </>
          )}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}
