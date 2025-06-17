
import useScrollReveal from '@/hooks/useScrollReveal';
import { Zap, Target, TrendingUp, Brain, BarChart3, Clock } from 'lucide-react';

const Brand3yVisionSection = () => {
  const sectionRef = useScrollReveal();

  const features = [
    {
      icon: Zap,
      title: "Real-time competitive intelligence at your fingertips",
      description: "Monitor competitor moves as they happen"
    },
    {
      icon: BarChart3,
      title: "Comprehensive brand health monitoring across all channels",
      description: "Track performance across every platform from one dashboard"
    },
    {
      icon: Brain,
      title: "Instant answers to executive questions",
      description: "AI-powered insights ready when leadership needs them"
    },
    {
      icon: Target,
      title: "AI-powered insights that spot opportunities before competitors",
      description: "Predictive analytics that keep you ahead of the curve"
    },
    {
      icon: Clock,
      title: "Professional brand health reports ready in minutes, not weeks",
      description: "Automated reporting that saves hours of manual work"
    },
    {
      icon: TrendingUp,
      title: "Strategic recommendations based on market data",
      description: "Actionable insights that drive real business results"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div ref={sectionRef} className="reveal transition-all duration-500 ease-out text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Imagine Being the Marketer Who Always Knows
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform from reactive researcher to strategic oracle with comprehensive brand intelligence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className={`reveal reveal-delay-${(index + 1) * 100} transition-all duration-500 ease-out`}>
              <div className="bg-green-50 rounded-lg p-6 border border-green-100 h-full">
                <feature.icon className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-8 border border-green-200 max-w-4xl mx-auto mt-12 text-center">
          <p className="text-xl text-gray-800 leading-relaxed">
            Stop being the marketer who says <span className="font-semibold text-green-600">"I'll look into that"</span>. 
            Start being the one who says <span className="font-semibold">"Here's exactly what's happening"</span> 
            with confidence and data to back it up.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Brand3yVisionSection;
