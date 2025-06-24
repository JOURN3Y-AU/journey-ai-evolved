
-- Add columns to store the prompt and AI response for testing purposes
ALTER TABLE public.assessment_responses 
ADD COLUMN ai_prompt_used TEXT,
ADD COLUMN ai_raw_response TEXT;

-- Add comments to clarify the purpose of these columns
COMMENT ON COLUMN public.assessment_responses.ai_prompt_used IS 'The actual prompt sent to the AI service for this assessment';
COMMENT ON COLUMN public.assessment_responses.ai_raw_response IS 'The raw response received from the AI service before any processing';
