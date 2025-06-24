
-- Drop existing policies
DROP POLICY IF EXISTS "Allow public insert on assessment sessions" ON public.assessment_sessions;
DROP POLICY IF EXISTS "Allow public select on assessment sessions" ON public.assessment_sessions;
DROP POLICY IF EXISTS "Allow public update on assessment sessions" ON public.assessment_sessions;
DROP POLICY IF EXISTS "Allow public insert on assessment responses" ON public.assessment_responses;
DROP POLICY IF EXISTS "Allow public select on assessment responses" ON public.assessment_responses;
DROP POLICY IF EXISTS "Allow public update on assessment responses" ON public.assessment_responses;

-- Create new policies that work for both anonymous and authenticated users
CREATE POLICY "Allow assessment session insert" 
  ON public.assessment_sessions 
  FOR INSERT 
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow assessment session select" 
  ON public.assessment_sessions 
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Allow assessment session update" 
  ON public.assessment_sessions 
  FOR UPDATE 
  TO public
  USING (true);

CREATE POLICY "Allow assessment response insert" 
  ON public.assessment_responses 
  FOR INSERT 
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow assessment response select" 
  ON public.assessment_responses 
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Allow assessment response update" 
  ON public.assessment_responses 
  FOR UPDATE 
  TO public
  USING (true);
