-- Create new flexible assessment table for redesigned questionnaire
CREATE TABLE public.assessment_responses_v2 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  
  -- Contact Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  
  -- Core Info
  company_name TEXT NOT NULL,
  selected_role TEXT NOT NULL CHECK (selected_role IN ('CEO', 'CFO', 'CMO', 'CHRO', 'CPO', 'CTO')),
  company_size TEXT NOT NULL,
  industry TEXT NOT NULL,
  
  -- Flexible assessment responses structure
  responses JSONB NOT NULL DEFAULT '{}',
  
  -- Campaign Interest
  interested_in_conversation BOOLEAN,
  
  -- AI Generated Results
  ai_dashboard_data JSONB,
  ai_written_assessment TEXT,
  ai_generation_status TEXT DEFAULT 'pending',
  ai_prompt_used TEXT,
  ai_raw_response TEXT,
  
  -- Tracking
  email_sent BOOLEAN DEFAULT false,
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.assessment_responses_v2 ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (same as original assessment)
CREATE POLICY "Allow assessment response v2 insert" 
  ON public.assessment_responses_v2 
  FOR INSERT 
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow assessment response v2 select" 
  ON public.assessment_responses_v2 
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Allow assessment response v2 update" 
  ON public.assessment_responses_v2 
  FOR UPDATE 
  TO public
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_assessment_responses_v2_updated_at
  BEFORE UPDATE ON public.assessment_responses_v2
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to create campaign lead from v2 assessment
CREATE OR REPLACE FUNCTION public.create_campaign_lead_from_assessment_v2(assessment_response_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  lead_id UUID;
  assessment_data RECORD;
  session_data RECORD;
BEGIN
  -- Get assessment response data
  SELECT ar.*, ass.utm_source, ass.utm_medium, ass.utm_campaign, ass.utm_content, ass.utm_term
  INTO assessment_data
  FROM public.assessment_responses_v2 ar
  JOIN public.assessment_sessions ass ON ar.session_id = ass.id
  WHERE ar.id = assessment_response_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Assessment response not found';
  END IF;
  
  -- Insert into campaign_leads table
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
    additional_data
  ) VALUES (
    assessment_data.first_name || ' ' || assessment_data.last_name,
    assessment_data.email,
    assessment_data.company_name,
    assessment_data.phone_number,
    CASE 
      WHEN assessment_data.interested_in_conversation THEN 'AI Readiness Assessment - Interested in Discovery Session'
      ELSE 'AI Readiness Assessment Completion'
    END,
    'ai-assessment-v2',
    'assessment',
    assessment_data.utm_source,
    assessment_data.utm_medium,
    assessment_data.utm_campaign,
    assessment_data.utm_content,
    assessment_data.utm_term,
    jsonb_build_object(
      'assessment_response_id', assessment_response_id,
      'company_size', assessment_data.company_size,
      'industry', assessment_data.industry,
      'selected_role', assessment_data.selected_role,
      'interested_in_conversation', assessment_data.interested_in_conversation,
      'responses', assessment_data.responses
    )
  ) RETURNING id INTO lead_id;
  
  RETURN lead_id;
END;
$function$;