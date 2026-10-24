import { NextRequest, NextResponse } from 'next/server';
import { PLAYBACK_ELIGIBILITY_SECONDS } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

/**
 * Replaces `CampaignPlaybackController` & `RepostPlaybackController`.
 * Avoids writing session blobs to MySQL on every second of audio progress!
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    targetId,
    targetType = 'campaign', // 'campaign' | 'request'
    actualPlayTime = 0,
    action = 'progress', // 'play' | 'pause' | 'progress' | 'eligible' | 'finish'
  } = body;

  const playSeconds = Math.round(Number(actualPlayTime) * 100) / 100;
  const isEligible = playSeconds >= PLAYBACK_ELIGIBILITY_SECONDS;

  // Increment campaign playback_count in DB only once when threshold is first crossed ('eligible')
  if (action === 'eligible' && targetType === 'campaign' && targetId) {
    try {
      await prisma.campaign.update({
        where: { id: BigInt(targetId) },
        data: { playback_count: { increment: 1 } },
      });
    } catch {
      // Ignore if offline preview
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      targetId: String(targetId),
      targetType,
      actualPlayTime: playSeconds,
      isEligible,
      requiredSeconds: PLAYBACK_ELIGIBILITY_SECONDS,
    },
  });
}
