
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface DataAIReadinessSectionProps {
  answers: any;
  onComplete: (answers: any) => void;
}

const DataAIReadinessSection = ({ answers, onComplete }: DataAIReadinessSectionProps) => {
  const [formData, setFormData] = useState({
    q17_data_quality: answers.q17_data_quality || '',
    q18_analytics_maturity: answers.q18_analytics_maturity || '',
    q19_automation_level: answers.q19_automation_level || '',
    q20_technology_stack: answers.q20_technology_stack || '',
    q21_ai_experience: answers.q21_ai_experience || '',
    q22_implementation_timeline: answers.q22_implementation_timeline || '',
  });

  const questions = [
    {
      id: 'q17_data_quality',
      question: 'How would you rate your organization\'s data quality and accessibility?',
      options: [
        'Excellent - Clean, well-organized, easily accessible across systems',
        'Good - Mostly clean with some integration challenges',
        'Fair - Usable but requires significant cleanup and organization',
        'Poor - Fragmented, inconsistent, difficult to access',
        'Unknown - We haven\'t assessed our data quality'
      ]
    },
    {
      id: 'q18_analytics_maturity',
      question: 'What is your current analytics and reporting maturity level?',
      options: [
        'Advanced - Predictive analytics, real-time dashboards, data-driven decisions',
        'Intermediate - Regular reports, some automated dashboards',
        'Basic - Spreadsheet-based analysis, manual reporting',
        'Minimal - Limited reporting, mostly reactive analysis',
        'None - No formal analytics or reporting processes'
      ]
    },
    {
      id: 'q19_automation_level',
      question: 'How much of your organization\'s routine work is currently automated?',
      options: [
        'Highly automated (>75%) - Most processes are automated',
        'Moderately automated (50-75%) - Key processes automated',
        'Partially automated (25-50%) - Some automation in place',
        'Minimally automated (10-25%) - Very limited automation',
        'Manual processes (<10%) - Almost everything is manual'
      ]
    },
    {
      id: 'q20_technology_stack',
      question: 'How would you describe your organization\'s technology infrastructure?',
      options: [
        'Modern and integrated - Cloud-based, APIs, modern architecture',
        'Mixed environment - Some modern tools, some legacy systems',
        'Legacy-heavy - Mostly older systems with limited integration',
        'Outdated - Significant technology debt and limitations',
        'Uncertain - Not sure about our technical capabilities'
      ]
    },
    {
      id: 'q21_ai_experience',
      question: 'What is your organization\'s experience with AI technologies?',
      options: [
        'Experienced - Already using AI in multiple areas successfully',
        'Pilot stage - Testing AI solutions in specific use cases',
        'Planning - Researching and planning AI implementations',
        'Curious - Interested but no concrete plans yet',
        'Skeptical - Uncertain about AI value or readiness'
      ]
    },
    {
      id: 'q22_implementation_timeline',
      question: 'What is your ideal timeline for implementing AI solutions?',
      options: [
        'Immediate (0-3 months) - Ready to start right away',
        'Short-term (3-6 months) - Want to begin soon',
        'Medium-term (6-12 months) - Planning for next year',
        'Long-term (1-2 years) - Part of longer strategy',
        'Uncertain - Still evaluating timing and approach'
      ]
    }
  ];

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
          Data & AI Readiness Assessment
        </h2>
        <p className="text-gray-600">
          Help us understand your organization's technical foundation and experience with data and AI technologies.
        </p>
      </div>

      <div className="space-y-8">
        {questions.map((q, index) => (
          <Card key={q.id} className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                {index + 17}. {q.question}
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

export default DataAIReadinessSection;
