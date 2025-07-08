-- Update the check constraint to include 'Other' role
ALTER TABLE public.assessment_responses_v2 
DROP CONSTRAINT assessment_responses_v2_selected_role_check;

ALTER TABLE public.assessment_responses_v2 
ADD CONSTRAINT assessment_responses_v2_selected_role_check 
CHECK (selected_role IN ('CEO', 'CFO', 'CMO', 'CHRO', 'CPO', 'CTO', 'Other'));