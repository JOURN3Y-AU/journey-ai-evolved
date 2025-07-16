import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Page } from "@/types/page";
import { useToast } from "@/hooks/use-toast";

export const usePages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;

      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (pageData: Omit<Page, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .insert([pageData])
        .select()
        .single();

      if (error) throw error;

      await fetchPages();
      toast({
        title: "Success",
        description: "Page created successfully.",
      });
    } catch (error) {
      console.error('Error creating page:', error);
      toast({
        title: "Error",
        description: "Failed to create page. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePage = async (id: string, pageData: Partial<Page>) => {
    try {
      const { error } = await supabase
        .from('pages')
        .update(pageData)
        .eq('id', id);

      if (error) throw error;

      await fetchPages();
      toast({
        title: "Success",
        description: "Page updated successfully.",
      });
    } catch (error) {
      console.error('Error updating page:', error);
      toast({
        title: "Error",
        description: "Failed to update page. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchPages();
      toast({
        title: "Success",
        description: "Page deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: "Error",
        description: "Failed to delete page. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return {
    pages,
    loading,
    createPage,
    updatePage,
    deletePage,
    refetch: fetchPages,
  };
};