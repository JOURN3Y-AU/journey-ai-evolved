
import useScrollReveal from '@/hooks/useScrollReveal';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Brand3yFAQSection = () => {
  const sectionRef = useScrollReveal();

  const faqs = [
    {
      question: "When will this be available?",
      answer: "We're in private beta now with select Fortune 500 companies. Public launch is planned for Q2 2025. Waitlist members will get early access before the public launch."
    },
    {
      question: "Who is this for?",
      answer: "Brand3y is designed for marketing professionals, brand managers, CMOs, and marketing directors who need competitive intelligence and brand health insights to make strategic decisions."
    },
    {
      question: "How is this different from existing tools?",
      answer: "We combine multiple data sources (social media, advertising platforms, search data) with AI to give you insights that typically require a team of analysts. Our platform provides real-time competitive intelligence, not just historical reporting."
    },
    {
      question: "What platforms does it integrate with?",
      answer: "Brand3y connects to Facebook, Instagram, Google Search, YouTube, Twitter, TikTok, LinkedIn, and other major advertising and social media platforms to provide comprehensive brand intelligence."
    },
    {
      question: "What does it cost?",
      answer: "Pricing will be announced closer to launch. Waitlist members will be the first to receive pricing information and will have access to exclusive early-bird pricing."
    },
    {
      question: "Can I see a demo?",
      answer: "We're currently offering demos to qualified enterprise prospects. Join the waitlist and we'll reach out to schedule a personalized demo if you're a good fit for our beta program."
    }
  ];

  return (
    <section id="learn-more" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div ref={sectionRef} className="reveal transition-all duration-500 ease-out text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            What You're Wondering
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to the most common questions about Brand3y
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-orange-200">
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-orange-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">Still have questions?</p>
          <a 
            href="#waitlist" 
            className="inline-flex items-center justify-center bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Join the Waitlist for Updates
          </a>
        </div>
      </div>
    </section>
  );
};

export default Brand3yFAQSection;
