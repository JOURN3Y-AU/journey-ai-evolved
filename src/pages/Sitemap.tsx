import { useEffect } from 'react';

const Sitemap = () => {
  useEffect(() => {
    // Fetch the sitemap data from the edge function and redirect
    const fetchSitemap = async () => {
      try {
        const response = await fetch('https://ghtqdgkfbfdlnowrowpw.supabase.co/functions/v1/sitemap');
        const sitemapXml = await response.text();
        
        // Create a blob with the XML content
        const blob = new Blob([sitemapXml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        // Replace the current page content with the XML
        document.open();
        document.write(sitemapXml);
        document.close();
        
        // Set the correct content type
        if (document.contentType) {
          (document as any).contentType = 'application/xml';
        }
      } catch (error) {
        console.error('Error fetching sitemap:', error);
        document.open();
        document.write('<?xml version="1.0" encoding="UTF-8"?><error>Unable to load sitemap</error>');
        document.close();
      }
    };

    fetchSitemap();
  }, []);

  return null; // Component doesn't render anything as it manipulates the document directly
};

export default Sitemap;