'use client';
import QrCode from '@/components/qrcode';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useEffect, useState } from 'react';

export default function Home() {
  const [currentToken, setCurrentToken] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  useEffect(() => {
    fetch('/api/init', {
      headers: {
        Connection: 'keep-alive',
      },
    });

    const eventSource = new EventSource('/api/init');
    eventSource.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);
        console.log('Received data:', data);
        if (data.token) {
          const tokenUrl = `tg://login?token=${data.token}`;
          setCurrentToken(tokenUrl);
        }
        if (data.hint) {
          setShowPasswordInput(true);
        }
      } catch (error) {
        console.error('Failed to parse event data:', error);
      }
    };

    eventSource.onerror = function (error) {
      console.error('EventSource error:', error);
      eventSource.close();
    };

    eventSource.onopen = function () {
      console.log('Connection to server opened.');
    };
  }, []);

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch('/api/pwd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
    } catch (error) {
      console.error('Error sending password:', error);
    }
  };

  return (
    <div className="m-auto h-full">
      <h1>Telegram QR Code 登录</h1>

      <div>
        <QrCode qrstr={currentToken} />
        {showPasswordInput && (
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handlePasswordSubmit}>Submit</Button>
          </div>
        )}
      </div>
    </div>
  );
}
