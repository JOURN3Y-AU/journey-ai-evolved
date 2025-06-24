
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle, Calendar } from 'lucide-react';
import { ContactInfo } from '@/pages/products/AIAssessment';

interface AssessmentResultsProps {
  assessmentResult: string | null;
  contactInfo: ContactInfo | null;
  isGenerating: boolean;
  onComplete: () => void;
}

const AssessmentResults = ({ 
  assessmentResult, 
  contactInfo, 
  isGenerating, 
  onComplete 
}: AssessmentResultsProps) => {
  const [startTime] = useState(Date.now());
  const [completionTime, setCompletionTime] = useState<number | null>(null);

  useEffect(() => {
    if (assessmentResult && !isGenerating) {
      setCompletionTime(Math.round((Date.now() - startTime) / 1000));
    }
  }, [assessmentResult, isGenerating, startTime]);

  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {isGenerating ? (
            <Card className="p-8 shadow-lg text-center">
              <div className="mb-6">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Analyzing Your Responses
                </h2>
                <p className="text-gray-600">
                  Our AI is generating personalized insights based on your assessment...
                </p>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </Card>
          ) : (
            <div className="space-y-8">
              
              {/* Success Header */}
              <Card className="p-8 shadow-lg text-center bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Your AI Readiness Assessment is Complete!
                </h2>
                <p className="text-gray-600 mb-4">
                  Hi {contactInfo?.first_name}, here are your personalized insights
                </p>
                {completionTime && (
                  <p className="text-sm text-gray-500">
                    Assessment completed in {completionTime} seconds
                  </p>
                )}
              </Card>

              {/* Assessment Results */}
              <Card className="p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Your Personalized AI Readiness Report
                </h3>
                
                <div className="prose prose-lg max-w-none">
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-6">
                    {assessmentResult && (
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {assessmentResult}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Next Steps */}
              <Card className="p-8 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Take the Next Step?
                  </h3>
                  <p className="text-blue-100 mb-6 text-lg">
                    Book a complimentary 30-minute strategy call with our AI transformation experts 
                    to discuss your specific opportunities and create a tailored implementation roadmap.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-white text-blue-600 hover:bg-gray-100"
                      onClick={() => window.open('https://calendly.com/journ3y', '_blank')}
                    >
                      Book Strategy Call
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-blue-600"
                      onClick={onComplete}
                    >
                      Continue to JOURN3Y
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Email Confirmation */}
              <Card className="p-6 shadow-lg bg-green-50 border-green-200">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">
                    Your detailed assessment has been sent to {contactInfo?.email}
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    Check your inbox for the complete report and next steps
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AssessmentResults;
