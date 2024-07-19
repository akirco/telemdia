import { client, init } from '@/libs/gramjs/tg';
import { NextFetchEvent, NextRequest } from 'next/server';

export async function GET(req: NextRequest, event: NextFetchEvent) {
  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      await init({
        qrcodeCallback: async ({ token, expires }) => {
          const base64Token = token.toString('base64url');
          console.log('Generated token:', base64Token);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ token: base64Token, expires })}\n\n`
            )
          );
        },
        pwdCallback: async (hint?: string) => {
          console.log('Password required:', hint);
          if (hint) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ hint })}\n\n`)
            );
          }
          while (!process.env.GLOBAL_PASSWORD) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          const password = process.env.GLOBAL_PASSWORD;
          process.env.GLOBAL_PASSWORD = '';
          console.log('Password received:', password);
          return password;
        },
      }).then((USER) => {
        console.log('USER', USER);
        console.log('session:', client.session.save());
      });
    },
  });

  return new Response(readableStream, {
    status: 200,
    headers: {
      Connection: 'keep-alive',
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream; charset=utf-8',
    },
  });
}
