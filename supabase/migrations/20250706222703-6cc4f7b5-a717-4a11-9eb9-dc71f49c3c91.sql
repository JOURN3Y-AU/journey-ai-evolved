
-- Create a table to track documents
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  description TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true);

-- Add RLS policies for documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage documents
CREATE POLICY "Allow authenticated users to manage documents" 
  ON public.documents 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Allow public read access to documents table (for sharing links)
CREATE POLICY "Allow public read access to documents" 
  ON public.documents 
  FOR SELECT 
  USING (true);

-- Create storage policies for documents bucket
CREATE POLICY "Allow authenticated users to upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update documents"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public access to documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
