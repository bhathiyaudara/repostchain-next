import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Safely serializes Prisma records containing MySQL BigInt and Decimal values for JSON responses.
 */
export function serializePrisma<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) => {
      if (typeof value === 'bigint') {
        const asNumber = Number(value);
        return Number.isSafeInteger(asNumber) ? asNumber : value.toString();
      }
      if (
        value !== null &&
        typeof value === 'object' &&
        (value.constructor?.name === 'Decimal' || 'd' in value && 'e' in value && 's' in value)
      ) {
        return Number(value.toString());
      }
      return value;
    })
  );
}
