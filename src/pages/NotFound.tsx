
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log the attempted access to non-existent route
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // No automatic redirect anymore
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-5xl font-bold mb-4 text-journey-purple">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! Page not found</p>
        <p className="text-md text-gray-500 mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Button asChild variant="default" className="bg-gradient-to-r from-journey-purple to-journey-blue text-white">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
