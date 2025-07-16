
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield } from 'lucide-react';

const GleanHeroSection = () => {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-32 pb-20 bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>Authorized Glean Partner</span>
            </div>
            
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Transform your Business with Glean's Enterprise AI Platform
            </h1>
            
            <p className="text-xl text-gray-700 mb-8">
              Unlock the power of AI across your organisation with JOURN3Y, an Authorised Glean Implementation Partner. Our experts will deliver Glean's safe, secure, agent-ready Enterprise AI platform and have you at first prompt on YOUR data in 4 weeks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={scrollToDemo}>
                Schedule Demo
              </Button>
              <Button variant="outline" size="lg" onClick={scrollToFeatures}>
                Learn More
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>100+ Integrations</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <img 
              src="/Marketecture-diagram.png"
              alt="Glean AI Platform Architecture"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GleanHeroSection;
