
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BlogPostsTable from './blog/BlogPostsTable';
import { supabase } from '@/integrations/supabase/client';
import { User, Edit } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setCurrentUserEmail(data.user.email);
      }
    };
    
    fetchUserData();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {currentUserEmail && (
            <p className="text-gray-500 mt-1">Logged in as: {currentUserEmail}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate('/admin/users')} variant="outline" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Manage Users
          </Button>
          <Button onClick={() => navigate('/admin/new')} variant="default" className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            New Post
          </Button>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <BlogPostsTable />
      </div>
    </div>
  );
}
