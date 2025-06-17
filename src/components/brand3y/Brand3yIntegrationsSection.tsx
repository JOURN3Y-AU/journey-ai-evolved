
import useScrollReveal from '@/hooks/useScrollReveal';
import { Facebook, Instagram, Youtube, Twitter, Search, TrendingUp } from 'lucide-react';

const Brand3yIntegrationsSection = () => {
  const sectionRef = useScrollReveal();

  const integrations = [
    {
      icon: Facebook,
      name: "Facebook",
      description: "Ad spend, engagement metrics, and audience insights"
    },
    {
      icon: Instagram,
      name: "Instagram", 
      description: "Stories, posts, influencer partnerships, and reach data"
    },
    {
      icon: Youtube,
      name: "YouTube",
      description: "Video performance, advertising campaigns, and channel analytics"
    },
    {
      icon: Twitter,
      name: "Twitter/X",
      description: "Mentions, hashtag performance, and sentiment tracking"
    },
    {
      icon: Search,
      name: "Google Ads",
      description: "Search campaigns, display ads, and keyword performance"
    },
    {
      icon: TrendingUp,
      name: "TikTok",
      description: "Viral content tracking, ad campaigns, and trend analysis"
    }
  ];

  return (
    <section className="py-20 bg-green-50">
      <div className="container mx-auto px-4">
        <div ref={sectionRef} className="reveal transition-all duration-500 ease-out text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Connect to Where Your Brand Data Lives
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Brand3y seamlessly integrates with all the platforms where your marketing data exists, 
            giving you a unified view of your brand's performance across every channel.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {integrations.map((integration, index) => (
            <div key={index} className={`reveal reveal-delay-${(index + 1) * 100} transition-all duration-500 ease-out`}>
              <div className="bg-white rounded-lg p-6 shadow-lg border border-green-200 hover:shadow-xl transition-shadow duration-300">
                <integration.icon className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{integration.name}</h3>
                <p className="text-gray-600">{integration.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-8 shadow-lg border border-green-200 max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            One Dashboard. All Your Data.
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            No more jumping between platforms or manually compiling reports. Brand3y automatically 
            pulls data from every source, analyzes it with AI, and presents actionable insights 
            in a single, comprehensive dashboard.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Brand3yIntegrationsSection;
