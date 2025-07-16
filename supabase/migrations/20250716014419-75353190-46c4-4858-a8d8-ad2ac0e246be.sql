-- Create pages table for dynamic sitemap management
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL UNIQUE,
  meta_description TEXT,
  priority DECIMAL(2,1) NOT NULL DEFAULT 0.8,
  change_frequency TEXT NOT NULL DEFAULT 'monthly',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to published pages" 
ON public.pages 
FOR SELECT 
USING (is_published = true);

-- Create policies for authenticated admin access
CREATE POLICY "Allow authenticated users to manage pages" 
ON public.pages 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing static pages
INSERT INTO public.pages (title, slug, path, meta_description, priority, change_frequency) VALUES
('Home', 'home', '/', 'JOURN3Y - AI & Data Transformation Specialists', 1.0, 'weekly'),
('Contact', 'contact', '/contact', 'Get in touch with JOURN3Y for AI transformation services', 0.8, 'monthly'),
('Team', 'team', '/team', 'Meet the JOURN3Y team of AI and data experts', 0.7, 'monthly'),
('Resources', 'resources', '/resources', 'AI transformation resources and insights', 0.8, 'weekly'),
('Blog', 'blog', '/blog', 'Latest insights on AI transformation and data strategy', 0.9, 'weekly'),
('Privacy Policy', 'privacy', '/privacy', 'JOURN3Y privacy policy and data protection', 0.3, 'yearly'),
('AI Assessment', 'ai-assessment', '/products/ai-assessment', 'Free AI readiness assessment for your organization', 0.9, 'monthly'),
('AI Assessment Extended', 'ai-assessment-long', '/products/ai-assessment-long', 'Comprehensive AI readiness assessment', 0.8, 'monthly'),
('AI Assessment V2', 'ai-assessment-v2', '/products/ai-assessment-v2', 'Latest AI readiness assessment tool', 0.9, 'monthly'),
('Brand3y', 'brand3y', '/products/brand3y', 'Brand3y AI-powered branding solution', 0.8, 'monthly'),
('Glean Implementation', 'glean', '/products/glean', 'Glean enterprise search implementation services', 0.8, 'monthly'),
('AI Accelerators', 'accelerators', '/products/accelerators', 'AI implementation accelerators and frameworks', 0.7, 'monthly'),
('AI Blueprint', 'blueprint', '/products/blueprint', 'AI transformation blueprint and strategy', 0.7, 'monthly'),
('Services', 'services', '/products/services', 'JOURN3Y AI transformation services', 0.8, 'monthly');