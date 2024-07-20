import LoginQRCode from '@/components/loginQRCode';

export default async function Home() {
  return (
    <main className="mx-auto pt-16 flex justify-center flex-col items-center">
      <LoginQRCode />
    </main>
  );
}
