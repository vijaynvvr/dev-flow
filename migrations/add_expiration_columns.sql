-- Migration to add credential expiration tracking
-- Run this on your database to add the new columns

ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS gemini_key_expires_at timestamp,
ADD COLUMN IF NOT EXISTS github_token_expires_at timestamp;

-- Optional: Set default expiration for existing credentials (6 months from now)
-- UPDATE user_settings 
-- SET 
--   gemini_key_expires_at = NOW() + INTERVAL '6 months' 
-- WHERE gemini_api_key IS NOT NULL AND gemini_key_expires_at IS NULL;

-- UPDATE user_settings 
-- SET 
--   github_token_expires_at = NOW() + INTERVAL '6 months' 
-- WHERE github_pat_token IS NOT NULL AND github_token_expires_at IS NULL;