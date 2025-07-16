export interface Page {
  id: string;
  title: string;
  slug: string;
  path: string;
  meta_description?: string;
  priority: number;
  change_frequency: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageFormData {
  title: string;
  slug: string;
  path: string;
  meta_description: string;
  priority: number;
  change_frequency: string;
  is_published: boolean;
}