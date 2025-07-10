-- Remove the unique constraint that prevents multiple campaign leads for the same email/campaign/service combination
-- This allows users to create multiple campaign leads when they complete assessments multiple times

ALTER TABLE public.campaign_leads 
DROP CONSTRAINT IF EXISTS unique_email_campaign;