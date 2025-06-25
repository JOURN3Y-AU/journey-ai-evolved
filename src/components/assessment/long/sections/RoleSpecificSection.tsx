
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RoleSpecificSectionProps {
  answers: any;
  selectedRole?: string;
  onComplete: (answers: any) => void;
}

const RoleSpecificSection = ({ answers, selectedRole, onComplete }: RoleSpecificSectionProps) => {
  const [formData, setFormData] = useState({
    q23_role_specific: answers.q23_role_specific || '',
    q24_role_specific: answers.q24_role_specific || '',
  });

  const getRoleSpecificQuestions = (role: string) => {
    const questionSets = {
      cfo: [
        {
          id: 'q23_role_specific',
          question: 'What are your biggest financial reporting and analysis challenges?',
          options: [
            'Manual data consolidation and month-end closes take too long',
            'Lack of real-time financial visibility and forecasting',
            'Difficulty in cost allocation and profitability analysis',
            'Compliance and audit preparation inefficiencies',
            'Budget vs. actual variance analysis is time-consuming'
          ]
        },
        {
          id: 'q24_role_specific',
          question: 'Which AI-powered financial capabilities would deliver the most value?',
          options: [
            'Automated financial reporting and dashboard generation',
            'Predictive cash flow and financial forecasting',
            'Intelligent expense categorization and anomaly detection',
            'Automated audit trail and compliance monitoring',
            'Advanced financial modeling and scenario analysis'
          ]
        }
      ],
      cmo: [
        {
          id: 'q23_role_specific',
          question: 'What are your biggest marketing effectiveness and measurement challenges?',
          options: [
            'Attribution across multiple channels and touchpoints',
            'Content creation and personalization at scale',
            'Lead quality and conversion optimization',
            'Customer segmentation and targeting accuracy',
            'Marketing ROI measurement and optimization'
          ]
        },
        {
          id: 'q24_role_specific',
          question: 'Which AI-powered marketing capabilities would deliver the most value?',
          options: [
            'Automated content generation and optimization',
            'Predictive customer behavior and lifetime value',
            'Intelligent lead scoring and nurturing',
            'Dynamic pricing and promotional optimization',
            'Real-time campaign performance optimization'
          ]
        }
      ],
      chro: [
        {
          id: 'q23_role_specific',
          question: 'What are your biggest people management and HR challenges?',
          options: [
            'Talent acquisition and candidate screening efficiency',
            'Employee engagement and retention strategies',
            'Performance management and development planning',
            'Compensation benchmarking and equity analysis',
            'HR analytics and workforce planning'
          ]
        },
        {
          id: 'q24_role_specific',
          question: 'Which AI-powered HR capabilities would deliver the most value?',
          options: [
            'Automated resume screening and candidate matching',
            'Predictive turnover analysis and retention strategies',
            'Intelligent performance feedback and development recommendations',
            'Dynamic compensation analysis and benchmarking',
            'Employee sentiment analysis and engagement monitoring'
          ]
        }
      ],
      cpo: [
        {
          id: 'q23_role_specific',
          question: 'What are your biggest product development and management challenges?',
          options: [
            'Feature prioritization and roadmap planning',
            'User feedback analysis and product insights',
            'Market research and competitive intelligence',
            'Product performance measurement and optimization',
            'Time-to-market and development efficiency'
          ]
        },
        {
          id: 'q24_role_specific',
          question: 'Which AI-powered product capabilities would deliver the most value?',
          options: [
            'Automated user feedback analysis and feature recommendations',
            'Predictive product usage and adoption modeling',
            'Intelligent A/B testing and optimization',
            'Market trend analysis and opportunity identification',
            'Automated competitive analysis and positioning'
          ]
        }
      ],
      cto: [
        {
          id: 'q23_role_specific',
          question: 'What are your biggest technology and infrastructure challenges?',
          options: [
            'System integration and technical debt management',
            'Scalability and performance optimization',
            'Security and compliance requirements',
            'Development team productivity and code quality',
            'Technology stack modernization and architecture'
          ]
        },
        {
          id: 'q24_role_specific',
          question: 'Which AI-powered technology capabilities would deliver the most value?',
          options: [
            'Automated code review and quality assurance',
            'Intelligent system monitoring and anomaly detection',
            'Predictive infrastructure scaling and optimization',
            'Automated security threat detection and response',
            'Smart deployment and release management'
          ]
        }
      ],
      ceo: [
        {
          id: 'q23_role_specific',
          question: 'What are your biggest strategic and operational challenges?',
          options: [
            'Market opportunity identification and competitive positioning',
            'Operational efficiency and cost optimization',
            'Strategic decision-making with limited data insights',
            'Customer acquisition and retention strategies',
            'Organizational alignment and execution effectiveness'
          ]
        },
        {
          id: 'q24_role_specific',
          question: 'Which AI-powered strategic capabilities would deliver the most value?',
          options: [
            'Predictive market analysis and opportunity identification',
            'Automated competitive intelligence and benchmarking',
            'Intelligent customer insights and behavior prediction',
            'Strategic scenario modeling and risk analysis',
            'Real-time operational performance dashboards'
          ]
        }
      ]
    };

    return questionSets[role as keyof typeof questionSets] || questionSets.ceo;
  };

  const questions = getRoleSpecificQuestions(selectedRole || 'ceo');

  const handleInputChange = (questionId: string, value: string) => {
    setFormData(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '');
    if (allFieldsFilled) {
      onComplete(formData);
    }
  };

  const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '');

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Role-Specific Deep Dive
        </h2>
        <p className="text-gray-600">
          These final questions are tailored specifically to your role as a {selectedRole?.toUpperCase()} to provide the most relevant insights.
        </p>
      </div>

      <div className="space-y-8">
        {questions.map((q, index) => (
          <Card key={q.id} className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                {index + 23}. {q.question}
              </h3>
              
              <RadioGroup
                value={formData[q.id as keyof typeof formData]}
                onValueChange={(value) => handleInputChange(q.id, value)}
                className="space-y-3"
              >
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${q.id}-${optionIndex}`} />
                    <Label 
                      htmlFor={`${q.id}-${optionIndex}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!allFieldsFilled}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default RoleSpecificSection;
