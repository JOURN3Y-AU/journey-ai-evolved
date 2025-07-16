
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductsSection from '@/components/home/ProductsSection';
import BlogSection from '@/components/home/BlogSection';
import CTASection from '@/components/home/CTASection';
import { useMetaTags, META_CONFIGS } from '@/hooks/useMetaTags';

const Index = () => {
  useMetaTags(META_CONFIGS.home);

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <BlogSection />
      <CTASection />
    </>
  );
};

export default Index;
