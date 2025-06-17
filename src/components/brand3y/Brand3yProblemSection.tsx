
import useScrollReveal from '@/hooks/useScrollReveal';
import { MessageCircleQuestion, Clock, TrendingDown } from 'lucide-react';

const Brand3yProblemSection = () => {
  const sectionRef = useScrollReveal();

  const problems = [
    {
      icon: MessageCircleQuestion,
      question: "How's our brand performing against competitors?",
      delay: "reveal-delay-100"
    },
    {
      icon: TrendingDown,
      question: "What's driving their recent growth?",
      delay: "reveal-delay-200"
    },
    {
      icon: Clock,
      question: "Should we be worried about their new campaign?",
      delay: "reveal-delay-300"
    },
    {
      icon: MessageCircleQuestion,
      question: "What's our share of voice this quarter?",
      delay: "reveal-delay-400"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div ref={sectionRef} className="reveal transition-all duration-500 ease-out text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Every Brand Meeting Feels Like This
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {problems.map((problem, index) => (
            <div key={index} className={`reveal ${problem.delay} transition-all duration-500 ease-out`}>
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                <div className="flex items-start space-x-4">
                  <problem.icon className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-800 font-medium italic">
                    "{problem.question}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xl text-gray-600 leading-relaxed">
            These questions take <span className="font-semibold text-red-600">weeks to research</span>. 
            By the time you have answers, the market has moved on.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Brand3yProblemSection;
