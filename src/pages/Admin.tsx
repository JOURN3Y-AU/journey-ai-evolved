
import { useState } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminBlogEdit from '@/components/admin/AdminBlogEdit';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleLogin = (username: string, password: string) => {
    // Simple authentication for demo purposes
    // In a real app, you would use proper authentication through Supabase
    if (username === 'admin' && password === 'password123') {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard onLogout={handleLogout} />} />
      <Route path="/edit/:slug" element={<AdminBlogEdit onLogout={handleLogout} />} />
      <Route path="/new" element={<AdminBlogEdit onLogout={handleLogout} isNew />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
