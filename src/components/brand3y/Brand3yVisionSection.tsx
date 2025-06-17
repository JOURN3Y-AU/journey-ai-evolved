
import useScrollReveal from '@/hooks/useScrollReveal';
import { Zap, BarChart3, Brain, TrendingUp, FileText } from 'lucide-react';

const Brand3yVisionSection = () => {
  const sectionRef = useScrollReveal();

  const features = [
    {
      icon: Zap,
      title: "Real-time competitive intelligence at your fingertips",
      description: "Monitor competitor activities across all platforms instantly"
    },
    {
      icon: BarChart3,
      title: "Comprehensive brand health monitoring across all channels",
      description: "Track your brand's performance on Facebook, Instagram, Google, YouTube, Twitter, TikTok and more"
    },
    {
      icon: Brain,
      title: "Instant answers to executive questions",
      description: "AI-powered insights ready when leadership needs them most"
    },
    {
      icon: TrendingUp,
      title: "AI-powered insights that spot opportunities before competitors",
      description: "Stay ahead with predictive analysis and trend detection"
    },
    {
      icon: FileText,
      title: "Professional brand health reports ready in minutes, not weeks",
      description: "Generate comprehensive reports with just a few clicks"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div ref={sectionRef} className="reveal transition-all duration-500 ease-out text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Imagine Being the Marketer Who Always Knows
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform from reactive researcher to strategic oracle with comprehensive brand intelligence
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className={`reveal reveal-delay-${(index + 1) * 100} transition-all duration-500 ease-out`}>
              <div className="bg-white rounded-lg p-8 shadow-lg border border-orange-100 h-full">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brand3yVisionSection;
