
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  category: string;
  featured_on_homepage: boolean;
}

export interface Category {
  id: string;
  name: string;
}
