
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BlogPostsTable from './blog/BlogPostsTable';
import { BlogPost } from '@/types/blog';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch blog posts
  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*, blog_categories(name)')
          .order('published_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedPosts = data.map(post => ({
            id: post.id as string,
            title: post.title as string,
            slug: post.slug as string,
            published_at: new Date(post.published_at as string).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            category: (post.blog_categories as { name: string })?.name || '',
            featured_on_homepage: post.featured_on_homepage as boolean || false
          }));
          
          setBlogPosts(formattedPosts);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blog posts',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchBlogPosts();
  }, [toast]);

  // Delete a blog post
  const handleDelete = (id: string) => {
    // Just update the UI, actual deletion is handled in DeletePostButton
    setBlogPosts(blogPosts.filter(post => post.id !== id));
  };

  // Toggle featured status
  const handleToggleFeature = (id: string, newStatus: boolean) => {
    // Update the UI
    setBlogPosts(blogPosts.map(post => 
      post.id === id 
        ? { ...post, featured_on_homepage: newStatus } 
        : post
    ));
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button asChild variant="default">
            <Link to="/admin/new">
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Link>
          </Button>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <BlogPostsTable
            posts={blogPosts}
            onDeletePost={handleDelete}
            onToggleFeature={handleToggleFeature}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
