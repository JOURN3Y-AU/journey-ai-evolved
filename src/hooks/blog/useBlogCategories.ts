
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/types/blog';

export function useBlogCategories(isNew: boolean, setInitialCategoryId?: (id: string) => void) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_categories')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        if (data) {
          setCategories(data);
          // Set default category for new posts
          if (data.length > 0 && isNew && setInitialCategoryId) {
            setInitialCategoryId(data[0].id);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [isNew, setInitialCategoryId, toast]);

  return { categories, isLoading };
}
