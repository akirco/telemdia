import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  console.log('Received password:', password);
  process.env.GLOBAL_PASSWORD = password;

  return NextResponse.json({ success: true });
}
