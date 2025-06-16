
import { useState } from 'react';
import GleanHeroSection from '@/components/glean/GleanHeroSection';
import GleanCoreFeaturesSection from '@/components/glean/GleanCoreFeaturesSection';
import GleanPlatformSection from '@/components/glean/GleanPlatformSection';
import GleanIntegrationSection from '@/components/glean/GleanIntegrationSection';
import GleanSuccessMetricsSection from '@/components/glean/GleanSuccessMetricsSection';
import GleanDemoSection from '@/components/glean/GleanDemoSection';
import GleanThankYouDialog from '@/components/glean/GleanThankYouDialog';

const Glean = () => {
  const [showThankYou, setShowThankYou] = useState(false);

  const handleFormSubmitSuccess = () => {
    setShowThankYou(true);
  };

  return (
    <>
      <GleanHeroSection />
      <GleanCoreFeaturesSection />
      <GleanPlatformSection />
      <GleanIntegrationSection />
      <GleanSuccessMetricsSection />
      <GleanDemoSection onFormSubmitSuccess={handleFormSubmitSuccess} />
      <GleanThankYouDialog 
        open={showThankYou} 
        onOpenChange={setShowThankYou} 
      />
    </>
  );
};

export default Glean;
