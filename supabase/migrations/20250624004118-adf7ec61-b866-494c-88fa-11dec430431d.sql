
-- Create assessment sessions table to track user progress
CREATE TABLE public.assessment_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token UUID NOT NULL DEFAULT gen_random_uuid(),
  ip_address INET,
  user_agent TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessment responses table to store questionnaire answers
CREATE TABLE public.assessment_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
  
  -- Contact information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  phone_number TEXT,
  
  -- Assessment answers
  q1_business_challenge TEXT NOT NULL,
  q2_time_waste TEXT NOT NULL,
  q3_revenue TEXT NOT NULL,
  q4_timeline TEXT NOT NULL,
  q5_investment_priority TEXT NOT NULL,
  q6_leadership_readiness TEXT NOT NULL,
  
  -- AI-generated content
  ai_assessment_result TEXT,
  ai_generation_status TEXT DEFAULT 'pending', -- pending, generating, completed, failed
  
  -- Tracking
  email_sent BOOLEAN DEFAULT false,
  notification_sent BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for session lookups
CREATE INDEX idx_assessment_sessions_token ON public.assessment_sessions(session_token);
CREATE INDEX idx_assessment_responses_session ON public.assessment_responses(session_id);
CREATE INDEX idx_assessment_responses_email ON public.assessment_responses(email);

-- Enable RLS
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;

-- Create policies - allow public access for this assessment (no auth required)
CREATE POLICY "Allow public insert on assessment sessions" 
  ON public.assessment_sessions 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Allow public select on assessment sessions" 
  ON public.assessment_sessions 
  FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "Allow public update on assessment sessions" 
  ON public.assessment_sessions 
  FOR UPDATE 
  TO anon 
  USING (true);

CREATE POLICY "Allow public insert on assessment responses" 
  ON public.assessment_responses 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Allow public select on assessment responses" 
  ON public.assessment_responses 
  FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "Allow public update on assessment responses" 
  ON public.assessment_responses 
  FOR UPDATE 
  TO anon 
  USING (true);

-- Add trigger to update updated_at column
CREATE TRIGGER update_assessment_sessions_updated_at 
  BEFORE UPDATE ON public.assessment_sessions 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_assessment_responses_updated_at 
  BEFORE UPDATE ON public.assessment_responses 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Create campaign leads entry function for assessment completions
CREATE OR REPLACE FUNCTION public.create_campaign_lead_from_assessment(
  assessment_response_id UUID
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  lead_id UUID;
  assessment_data RECORD;
  session_data RECORD;
BEGIN
  -- Get assessment response data
  SELECT ar.*, ass.utm_source, ass.utm_medium, ass.utm_campaign, ass.utm_content, ass.utm_term
  INTO assessment_data
  FROM public.assessment_responses ar
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
    'AI Readiness Assessment Completion',
    'ai-assessment',
    'assessment',
    assessment_data.utm_source,
    assessment_data.utm_medium,
    assessment_data.utm_campaign,
    assessment_data.utm_content,
    assessment_data.utm_term,
    jsonb_build_object(
      'assessment_response_id', assessment_response_id,
      'q1_business_challenge', assessment_data.q1_business_challenge,
      'q2_time_waste', assessment_data.q2_time_waste,
      'q3_revenue', assessment_data.q3_revenue,
      'q4_timeline', assessment_data.q4_timeline,
      'q5_investment_priority', assessment_data.q5_investment_priority,
      'q6_leadership_readiness', assessment_data.q6_leadership_readiness
    )
  ) RETURNING id INTO lead_id;
  
  RETURN lead_id;
END;
$$;
