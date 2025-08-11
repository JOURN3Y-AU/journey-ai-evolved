import { useState, useEffect } from 'react';
import SmallBusinessHeroSection from '@/components/smallbusiness/SmallBusinessHeroSection';
import SmallBusinessIndustrySelector from '@/components/smallbusiness/SmallBusinessIndustrySelector';
import SmallBusinessHowItWorksSection from '@/components/smallbusiness/SmallBusinessHowItWorksSection';
import SmallBusinessFinalCTA from '@/components/smallbusiness/SmallBusinessFinalCTA';
import { useMetaTags, META_CONFIGS } from '@/hooks/useMetaTags';

const SmallBusiness = () => {
  useMetaTags(META_CONFIGS.smallBusiness);

  const [utmParams, setUtmParams] = useState<Record<string, string>>({});

  // Capture UTM parameters on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    
    urlParams.forEach((value, key) => {
      if (key.startsWith('utm_') || key === 'industry') {
        params[key] = value;
      }
    });
    
    setUtmParams(params);

    // Track page view with Google Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Small Business Solutions',
        page_location: window.location.href,
        industry: params.industry || 'default'
      });
    }
  }, []);

  return (
    <>
      <SmallBusinessHeroSection utmParams={utmParams} />
      <SmallBusinessIndustrySelector utmParams={utmParams} />
      <SmallBusinessHowItWorksSection />
      <SmallBusinessFinalCTA utmParams={utmParams} />
    </>
  );
};

export default SmallBusiness;