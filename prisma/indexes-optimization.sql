-- ============================================================================
-- ZERO-DOWNTIME, ZERO-DATA-LOSS COMPOSITE INDEX OPTIMIZATION FOR MYSQL
-- Run safely on existing database to accelerate Dashboard, Campaigns & Analytics
-- ============================================================================

-- 1. Accelerate user credit balance calculation (replaces loading all rows into memory)
CREATE INDEX idx_credit_tx_receiver_status_calc
  ON credit_transactions (receiver_urn, status, calculation_type, deleted_at)
  ALGORITHM=INPLACE LOCK=NONE;

-- 2. Accelerate Campaign feeds (Recommended Pro, Recommended, All)
CREATE INDEX idx_campaigns_feed_filter
  ON campaigns (status, pro_feature, is_boost, is_featured, deleted_at, created_at)
  ALGORITHM=INPLACE LOCK=NONE;

CREATE INDEX idx_campaigns_user_status
  ON campaigns (user_urn, status, deleted_at)
  ALGORITHM=INPLACE LOCK=NONE;

-- 3. Accelerate Incoming / Outgoing Repost Requests on Dashboard
CREATE INDEX idx_repost_req_target_pending
  ON repost_requests (target_user_urn, status, expired_at, deleted_at)
  ALGORITHM=INPLACE LOCK=NONE;

CREATE INDEX idx_repost_req_requester_status
  ON repost_requests (requester_urn, status, deleted_at)
  ALGORITHM=INPLACE LOCK=NONE;

-- 4. Accelerate User Tracks sorting by SoundCloud creation date
CREATE INDEX idx_tracks_user_sc_created
  ON tracks (user_urn, deleted_at, created_at_soundcloud)
  ALGORITHM=INPLACE LOCK=NONE;

-- 5. Accelerate 30-day User Analytics aggregations
CREATE INDEX idx_user_analytics_act_date_type
  ON user_analytics (act_user_urn, created_at, type, deleted_at)
  ALGORITHM=INPLACE LOCK=NONE;

CREATE INDEX idx_user_analytics_owner_date_type
  ON user_analytics (owner_user_urn, created_at, type, deleted_at)
  ALGORITHM=INPLACE LOCK=NONE;
