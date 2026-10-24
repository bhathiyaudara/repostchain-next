/**
 * Exact Database Enum & Polymorphic Constants matching the existing Laravel MySQL data.
 * Keeping these 100% identical guarantees zero data loss and full cross-compatibility.
 */

export const MORPH_TYPES = {
  TRACK: 'App\\Models\\Track',
  PLAYLIST: 'App\\Models\\Playlist',
  CAMPAIGN: 'App\\Models\\Campaign',
  REPOST_REQUEST: 'App\\Models\\RepostRequest',
  USER: 'App\\Models\\User',
  ADMIN: 'App\\Models\\Admin',
  CREDIT: 'App\\Models\\Credit',
  PLAN: 'App\\Models\\Plan',
} as const;

export const USER_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
} as const;

export const CAMPAIGN_STATUS = {
  OPEN: 1,
  COMPLETED: 2,
  STOP: 3,
  CANCELLED: 4,
} as const;

export const CAMPAIGN_STATUS_LABELS: Record<number, string> = {
  [CAMPAIGN_STATUS.OPEN]: 'Open',
  [CAMPAIGN_STATUS.COMPLETED]: 'Completed',
  [CAMPAIGN_STATUS.STOP]: 'Stopped',
  [CAMPAIGN_STATUS.CANCELLED]: 'Cancelled',
};

/**
 * Note: In the existing database, status 4 is skipped for RepostRequest.
 */
export const REPOST_REQUEST_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  DECLINE: 2,
  EXPIRED: 3,
  CANCELLED: 5,
} as const;

export const REPOST_REQUEST_STATUS_LABELS: Record<number, string> = {
  [REPOST_REQUEST_STATUS.PENDING]: 'Pending',
  [REPOST_REQUEST_STATUS.APPROVED]: 'Approved',
  [REPOST_REQUEST_STATUS.DECLINE]: 'Declined',
  [REPOST_REQUEST_STATUS.EXPIRED]: 'Expired',
  [REPOST_REQUEST_STATUS.CANCELLED]: 'Cancelled',
};

/**
 * CRITICAL: Matches App\Models\CreditTransaction inverted accounting terminology:
 * - CALCULATION_TYPE_DEBIT (0) = ADDITION to user's credit balance
 * - CALCULATION_TYPE_CREDIT (1) = SUBTRACTION from user's credit balance
 */
export const CREDIT_CALCULATION_TYPE = {
  DEBIT_ADD: 0,
  CREDIT_SUBTRACT: 1,
} as const;

export const CREDIT_TRANSACTION_TYPE = {
  EARN: 0,
  SPEND: 1,
  REFUND: 2,
  PURCHASE: 3,
  PENALTY: 4,
  BONUS: 5,
  MANUAL: 6,
} as const;

export const CREDIT_TRANSACTION_STATUS = {
  PROCESSING: 0,
  SUCCEEDED: 1,
  FAILED: 2,
  REFUNDED: 3,
  CANCELED: 4,
} as const;

export const ORDER_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  REFUNDED: 3,
  CANCELED: 4,
} as const;

export const ORDER_TYPE = {
  CREDIT: 1,
  PLAN: 2,
} as const;

export const USER_PLAN_STATUS = {
  PENDING: 0,
  ACTIVE: 1,
  INACTIVE: 2,
  CANCELED: 3,
  EXPIRED: 4,
} as const;

export const USER_ANALYTICS_TYPE = {
  VIEW: 0,
  PLAY: 1,
  LIKE: 2,
  COMMENT: 3,
  REPOST: 4,
  REQUEST: 5,
  FOLLOW: 6,
} as const;

/**
 * Matches `repostPrice($repost_price, $commented, $liked)` in `app/Http/Helpers/MainHelper.php`
 */
export function calculateRepostPrice(
  baseRepostPrice: number,
  commented = false,
  liked = false
): number {
  const commentBonus = commented ? 2 : 0;
  const likeBonus = liked ? 2 : 0;
  return Number(baseRepostPrice || 1) + commentBonus + likeBonus;
}

/**
 * Matches `calculateFollowersLimit()` in `app/Livewire/User/Dashboard.php`
 */
export function calculateFollowersLimit(
  budgetCredits: number,
  likeable = true,
  commentable = true
): number {
  return Math.max(0, (budgetCredits - (likeable ? 2 : 0) - (commentable ? 2 : 0)) * 100);
}

/**
 * Minimum seconds of audio playback required before unlocking the Repost button
 */
export const PLAYBACK_ELIGIBILITY_SECONDS = 15;
