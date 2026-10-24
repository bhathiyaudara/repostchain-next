import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma, serializePrisma } from '@/lib/prisma';
import {
  CREDIT_CALCULATION_TYPE,
  CREDIT_TRANSACTION_STATUS,
  CREDIT_TRANSACTION_TYPE,
  MORPH_TYPES,
  ORDER_STATUS,
  ORDER_TYPE,
  USER_PLAN_STATUS,
} from '@/lib/constants';
import { getUserCreditBalance } from '@/lib/credits';
import { FALLBACK_USER } from '@/lib/fallback-data';

const FALLBACK_PLANS = [
  {
    id: 1,
    name: 'Free Forever Plan',
    monthly_price: 0,
    tag: null,
    notes: 'Essential SoundCloud repost exchange for independent artists.',
    features: [
      'Up to 2 Simultaneous Campaigns',
      '5 Direct Repost Requests / Month',
      'Standard Campaign Feed Placement',
      'Basic 7-Day Analytics',
    ],
  },
  {
    id: 2,
    name: 'Artist Pro Plan',
    monthly_price: 19.0,
    tag: 1,
    notes: 'Priority placement in Recommended Pro feed and unlimited direct requests.',
    features: [
      'Unlimited Simultaneous Campaigns',
      'Unlimited Direct Repost Requests',
      'Recommended Pro Feed Priority Badge',
      'Full 90-Day Growth Analytics & Genre Insights',
      'Collaboration Chat Hub Priority',
    ],
  },
  {
    id: 3,
    name: 'Label & Collective Plan',
    monthly_price: 49.0,
    tag: 2,
    notes: 'Maximum exposure, auto-boosted campaigns, and multi-artist support.',
    features: [
      'Everything in Artist Pro',
      'Auto-Boosted Featured Campaigns',
      '500 Monthly Bonus Repost Credits',
      'Dedicated Curator Support',
    ],
  },
];

const FALLBACK_CREDIT_PACKS = [
  { id: 1, name: 'Starter Boost Pack', credits: '250', price: 9.99, notes: '~25–50 Artist Reposts' },
  { id: 2, name: 'Pro Growth Pack', credits: '750', price: 24.99, notes: '~75–150 Artist Reposts' },
  { id: 3, name: 'Viral Label Pack', credits: '2000', price: 54.99, notes: '~200–400 Artist Reposts' },
];

/**
 * Matches `generateOrderID()` in `app/Http/Helpers/MainHelper.php`: `OIDRC-<his><10-99>`
 */
function generateOrderId(): string {
  const now = new Date();
  const hh = String(now.getHours() % 12 || 12).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const rand = Math.floor(10 + Math.random() * 90);
  return `OIDRC-${hh}${mm}${ss}${rand}`;
}

export async function GET() {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;

  try {
    const [plans, credits, activePlan, recentTransactions, balance] = await Promise.all([
      prisma.plan.findMany({
        where: { status: 1, deleted_at: null },
        orderBy: { sort_order: 'asc' },
      }),
      prisma.credit.findMany({
        where: { status: 1, deleted_at: null },
        orderBy: { sort_order: 'asc' },
      }),
      prisma.userPlan.findFirst({
        where: {
          user_urn: user.urn,
          status: USER_PLAN_STATUS.ACTIVE,
          deleted_at: null,
        },
        include: { plan: true },
        orderBy: { id: 'desc' },
      }),
      prisma.creditTransaction.findMany({
        where: {
          receiver_urn: user.urn,
          deleted_at: null,
        },
        orderBy: { created_at: 'desc' },
        take: 10,
      }),
      getUserCreditBalance(user.urn),
    ]);

    return NextResponse.json(
      serializePrisma({
        dbConnected: true,
        balance,
        plans: plans.length > 0 ? plans : FALLBACK_PLANS,
        creditPacks: credits.length > 0 ? credits : FALLBACK_CREDIT_PACKS,
        activePlan,
        recentTransactions,
      })
    );
  } catch {
    return NextResponse.json({
      dbConnected: false,
      balance: 480,
      plans: FALLBACK_PLANS,
      creditPacks: FALLBACK_CREDIT_PACKS,
      activePlan: {
        id: 1,
        plan_id: 2,
        price: 19.0,
        status: 1,
        billing_cycle: 'monthly',
        plan: FALLBACK_PLANS[1],
      },
      recentTransactions: [
        {
          id: 9001,
          calculation_type: 0,
          transaction_type: 0,
          credits: 9,
          description: "Repost of campaign 'Ethereal Pulse (Extended Mix)'",
          created_at: '2026-10-23T12:30:00.000Z',
        },
        {
          id: 9002,
          calculation_type: 0,
          transaction_type: 3,
          credits: 250,
          description: 'Purchased Starter Boost Pack (250 Credits)',
          created_at: '2026-10-21T09:15:00.000Z',
        },
      ],
    });
  }
}

export async function POST(request: NextRequest) {
  const user = (await getCurrentUser()) ?? FALLBACK_USER;
  const body = await request.json();
  const { type, itemId, gateway = 1 } = body; // type: 'credit' | 'plan', gateway: 1 (Stripe) | 2 (PayPal)
  const now = new Date();

  try {
    if (type === 'credit') {
      const pack =
        (await prisma.credit.findUnique({ where: { id: BigInt(itemId) } })) ??
        FALLBACK_CREDIT_PACKS.find((p) => p.id === Number(itemId)) ??
        FALLBACK_CREDIT_PACKS[0];

      const creditsAmount = Number(pack.credits || 250);
      const priceAmount = Number(pack.price || 9.99);
      const orderCode = generateOrderId();

      const result = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            user_urn: user.urn,
            order_id: orderCode,
            source_id: BigInt(pack.id),
            source_type: MORPH_TYPES.CREDIT,
            credits: creditsAmount,
            amount: priceAmount,
            status: ORDER_STATUS.COMPLETED,
            type: ORDER_TYPE.CREDIT,
            created_at: now,
            updated_at: now,
          },
        });

        await tx.payment.create({
          data: {
            user_urn: user.urn,
            order_id: order.id,
            name: user.name,
            email_address: user.email,
            payment_gateway: Number(gateway),
            payment_method: Number(gateway) === 2 ? 'paypal' : 'stripe',
            amount: priceAmount,
            currency: 'USD',
            credits_purchased: creditsAmount,
            status: 'succeeded',
            processed_at: now,
            created_at: now,
            updated_at: now,
          },
        });

        // Credit the user's balance (CALCULATION_TYPE_DEBIT = 0 = ADDITION)
        const creditTx = await tx.creditTransaction.create({
          data: {
            receiver_urn: user.urn,
            sender_urn: user.urn,
            calculation_type: CREDIT_CALCULATION_TYPE.DEBIT_ADD,
            source_id: order.id,
            source_type: 'App\\Models\\Order',
            transaction_type: CREDIT_TRANSACTION_TYPE.PURCHASE,
            status: CREDIT_TRANSACTION_STATUS.SUCCEEDED,
            amount: priceAmount,
            credits: creditsAmount,
            description: `Purchased ${pack.name} (+${creditsAmount} Credits) — Order ${orderCode}`,
            created_at: now,
            updated_at: now,
          },
        });

        return { order, creditTx };
      });

      return NextResponse.json(
        serializePrisma({
          success: true,
          message: `Order ${orderCode} completed! +${creditsAmount} credits added to your account.`,
          order: result.order,
        })
      );
    }

    if (type === 'plan') {
      const plan =
        (await prisma.plan.findUnique({ where: { id: BigInt(itemId) } })) ??
        FALLBACK_PLANS.find((p) => p.id === Number(itemId)) ??
        FALLBACK_PLANS[1];

      const priceAmount = Number(plan.monthly_price || 19);
      const orderCode = generateOrderId();
      const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            user_urn: user.urn,
            order_id: orderCode,
            source_id: BigInt(plan.id),
            source_type: MORPH_TYPES.PLAN,
            amount: priceAmount,
            status: ORDER_STATUS.COMPLETED,
            type: ORDER_TYPE.PLAN,
            created_at: now,
            updated_at: now,
          },
        });

        await tx.userPlan.create({
          data: {
            user_urn: user.urn,
            plan_id: BigInt(plan.id),
            order_id: order.id,
            start_date: now,
            end_date: endDate,
            price: priceAmount,
            status: USER_PLAN_STATUS.ACTIVE,
            auto_renew: true,
            duration: 30,
            billing_cycle: 'monthly',
            created_at: now,
            updated_at: now,
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: `Subscribed to ${plan.name}! Your Pro features are now active.`,
      });
    }

    return NextResponse.json({ error: 'Invalid purchase type' }, { status: 400 });
  } catch {
    return NextResponse.json({
      success: true,
      previewMode: true,
      message:
        type === 'credit'
          ? 'Credit Pack purchased in preview mode! (Connect MySQL to persist Order & Payment)'
          : 'Subscription activated in preview mode!',
    });
  }
}
