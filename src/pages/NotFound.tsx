
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const NotFound = () => {
  const location = useLocation();
  const [redirectDetected, setRedirectDetected] = useState<string | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  useEffect(() => {
    // Log the attempted access to non-existent route
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Check if there are any redirect attempts in the performance entries
    if (typeof window !== 'undefined' && 'performance' in window && 'getEntriesByType' in window.performance) {
      try {
        const navigationEntries = window.performance.getEntriesByType('navigation');
        if (navigationEntries && navigationEntries.length > 0) {
          // @ts-ignore - TypeScript doesn't know about the redirectCount property
          const redirectCount = navigationEntries[0].redirectCount;
          if (redirectCount > 0) {
            setRedirectDetected(`Detected ${redirectCount} redirect(s). This may be causing issues.`);
          }
        }
      } catch (error) {
        console.error("Error checking redirects:", error);
      }
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 text-journey-purple">404</h1>
          <p className="text-xl text-gray-700 mb-6">Oops! Page not found</p>
          <p className="text-md text-gray-500 mb-8">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          
          <Button asChild variant="default" className="bg-gradient-to-r from-journey-purple to-journey-blue text-white mb-6">
            <Link to="/">Return to Home</Link>
          </Button>

          {redirectDetected && (
            <div className="mt-8 text-left text-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox id="debug-info" checked={showDebugInfo} onCheckedChange={checked => setShowDebugInfo(!!checked)} />
                <label htmlFor="debug-info" className="cursor-pointer">Show debug information</label>
              </div>
              
              {showDebugInfo && (
                <Collapsible open={showDebugInfo} className="border p-4 rounded-md bg-gray-50">
                  <CollapsibleTrigger asChild>
                    <div className="font-medium text-journey-purple cursor-pointer">Redirect Information</div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 text-red-600">{redirectDetected}</div>
                    <div className="mt-2">
                      <p><strong>Current URL:</strong> {window.location.href}</p>
                      <p><strong>Requested Path:</strong> {location.pathname}</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-gray-500">
                        If you're seeing unwanted redirects to external sites (like journ3y.com.au/lander),
                        check your Lovable project settings or hosting configuration.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
