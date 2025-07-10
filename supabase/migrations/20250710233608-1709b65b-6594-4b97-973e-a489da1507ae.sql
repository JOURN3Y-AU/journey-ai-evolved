-- Create campaign leads for all assessment responses that don't have them
-- This backfills the missing data after removing the unique constraint

INSERT INTO public.campaign_leads (
  name,
  email,
  company,
  phone,
  message,
  campaign_source,
  service_type,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_content,
  utm_term,
  additional_data,
  created_at
)
SELECT 
  ar.first_name || ' ' || ar.last_name as name,
  ar.email,
  ar.company_name as company,
  ar.phone_number as phone,
  CASE 
    WHEN ar.interested_in_conversation THEN 'AI Readiness Assessment - Interested in Discovery Session'
    ELSE 'AI Readiness Assessment Completion'
  END as message,
  'ai-assessment-v2' as campaign_source,
  'assessment' as service_type,
  ass.utm_source,
  ass.utm_medium,
  ass.utm_campaign,
  ass.utm_content,
  ass.utm_term,
  jsonb_build_object(
    'assessment_response_id', ar.id,
    'company_size', ar.company_size,
    'industry', ar.industry,
    'selected_role', ar.selected_role,
    'interested_in_conversation', ar.interested_in_conversation,
    'responses', ar.responses,
    'backfilled', true
  ) as additional_data,
  ar.created_at
FROM public.assessment_responses_v2 ar
LEFT JOIN public.assessment_sessions ass ON ar.session_id = ass.id
WHERE NOT EXISTS (
  SELECT 1 
  FROM public.campaign_leads cl 
  WHERE cl.email = ar.email 
  AND cl.campaign_source = 'ai-assessment-v2'
  AND cl.service_type = 'assessment'
  AND cl.additional_data->>'assessment_response_id' = ar.id::text
);