
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define types for our blog posts
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  published_at: string;
  image_url: string;
  category: string;
}

const POSTS_PER_PAGE = 6;

export default function useBlogPosts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  
  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('blog_categories')
          .select('name')
          .order('name');
          
        if (error) throw error;
        
        if (data) {
          const categoryNames = data.map(cat => cat.name);
          setCategories(['All', ...categoryNames]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    
    fetchCategories();
  }, []);
  
  // Fetch blog posts
  useEffect(() => {
    async function fetchBlogPosts() {
      setLoading(true);
      
      try {
        // First get total count for pagination
        let query = supabase
          .from('blog_posts')
          .select('*', { count: 'exact' });
          
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
        }
        
        if (activeCategory !== 'All') {
          // Get category id first, then use it in the filter
          const { data: categoryData } = await supabase
            .from('blog_categories')
            .select('id')
            .eq('name', activeCategory)
            .single();
            
          if (categoryData) {
            query = query.eq('category_id', categoryData.id);
          }
        }
        
        const { count, error: countError } = await query;
        
        if (countError) throw countError;
        setTotalPosts(count || 0);
        
        // Now fetch the actual data for the current page
        let dataQuery = supabase
          .from('blog_posts')
          .select('*, blog_categories(name)')
          .order('published_at', { ascending: false })
          .range((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE - 1);
          
        if (searchQuery) {
          dataQuery = dataQuery.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
        }
        
        if (activeCategory !== 'All') {
          const { data: categoryData } = await supabase
            .from('blog_categories')
            .select('id')
            .eq('name', activeCategory)
            .single();
            
          if (categoryData) {
            dataQuery = dataQuery.eq('category_id', categoryData.id);
          }
        }
        
        const { data, error } = await dataQuery;
        
        if (error) throw error;
        
        if (data) {
          const formattedPosts = data.map(post => ({
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            published_at: new Date(post.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            image_url: post.image_url,
            category: post.blog_categories?.name || ''
          }));
          
          setBlogPosts(formattedPosts);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBlogPosts();
  }, [searchQuery, activeCategory, currentPage]);
  
  // Reset to first page when changing filter or search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return {
    blogPosts,
    loading,
    categories,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    currentPage,
    setCurrentPage,
    totalPages
  };
}
