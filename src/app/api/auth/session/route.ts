import { NextResponse } from 'next/server';
import { clearSessionCookie, getCurrentUser } from '@/lib/auth';
import { getUserCreditBalance } from '@/lib/credits';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  let credits = 480;
  let dbConnected = false;

  try {
    credits = await getUserCreditBalance(user.urn);
    dbConnected = true;
  } catch {
    dbConnected = false;
  }

  return NextResponse.json({
    authenticated: true,
    dbConnected,
    user,
    credits,
  });
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
