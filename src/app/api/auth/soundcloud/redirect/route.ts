import { NextRequest, NextResponse } from 'next/server';
import { getSoundCloudAuthorizeUrl } from '@/lib/soundcloud';

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const url = getSoundCloudAuthorizeUrl(origin);
  return NextResponse.redirect(url);
}
