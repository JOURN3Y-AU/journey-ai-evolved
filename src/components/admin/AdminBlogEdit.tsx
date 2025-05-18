
import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Image, Upload, Save } from 'lucide-react';

interface AdminBlogEditProps {
  onLogout: () => void;
  isNew?: boolean;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminBlogEdit({ onLogout, isNew = false }: AdminBlogEditProps) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [blogPost, setBlogPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category_id: ''
  });
  
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
          if (data.length > 0 && isNew) {
            setBlogPost(prev => ({ ...prev, category_id: data[0].id }));
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      }
    };
    
    const fetchBlogPost = async () => {
      if (isNew) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setBlogPost({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            image_url: data.image_url,
            category_id: data.category_id
          });
          
          setImagePreview(data.image_url);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast({
          title: "Error",
          description: "Failed to load blog post",
          variant: "destructive",
        });
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
    fetchBlogPost();
  }, [slug, isNew, navigate, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'title' && isNew) {
      // Auto-generate slug from title for new posts
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setBlogPost(prev => ({
        ...prev,
        [name]: value,
        slug
      }));
    } else {
      setBlogPost(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return blogPost.image_url;
    
    // Generate unique filename
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;
    
    try {
      const { error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, imageFile);
        
      if (error) throw error;
      
      // Get public URL
      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Upload image if selected
      let imageUrl = blogPost.image_url;
      if (imageFile) {
        imageUrl = await uploadImage() || '';
      }
      
      const postData = {
        title: blogPost.title,
        slug: blogPost.slug,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        image_url: imageUrl,
        category_id: blogPost.category_id
      };
      
      let error;
      
      if (isNew) {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([postData]);
        error = insertError;
      } else {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('slug', slug);
        error = updateError;
      }
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: isNew ? "Blog post created successfully" : "Blog post updated successfully",
      });
      
      navigate('/admin');
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: "Error",
        description: `Failed to ${isNew ? 'create' : 'update'} blog post`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return <div className="container mx-auto py-10 px-4">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {isNew ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Cancel
          </Button>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={blogPost.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={blogPost.slug}
                onChange={handleInputChange}
                required
                disabled={!isNew}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category_id"
                value={blogPost.category_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={blogPost.excerpt}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">
                Featured Image
              </Label>
              <Card className="border-dashed">
                <CardContent className="p-4 flex flex-col items-center justify-center space-y-4">
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setBlogPost(prev => ({ ...prev, image_url: '' }));
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-gray-100 rounded-full">
                        <Image className="h-8 w-8 text-gray-500" />
                      </div>
                      <Label 
                        htmlFor="image" 
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2 text-gray-700"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </Label>
                      <p className="text-sm text-gray-500">
                        JPG, PNG or GIF up to 10MB
                      </p>
                    </>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required={isNew && !blogPost.image_url}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={blogPost.content}
              onChange={handleInputChange}
              className="min-h-[400px]"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-journey-purple hover:bg-journey-dark-purple flex items-center gap-2"
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}
