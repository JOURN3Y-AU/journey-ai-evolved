import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface StrategicFoundationSectionV2Props {
  data: any;
  onComplete: (data: any) => void;
}

const StrategicFoundationSectionV2 = ({ data, onComplete }: StrategicFoundationSectionV2Props) => {
  const [formData, setFormData] = useState({
    q1_business_priorities: data.q1_business_priorities || [],
    q2_ai_familiarity: data.q2_ai_familiarity || '',
    q3_competitive_pressure: data.q3_competitive_pressure || '',
  });

  const businessPriorities = [
    'Revenue growth and market expansion',
    'Operational efficiency and cost reduction',
    'Customer experience improvement',
    'Innovation and product development',
    'Digital transformation',
    'Risk management and compliance',
    'Talent acquisition and retention',
    'Sustainability and ESG initiatives'
  ];

  const aiFamiliarityOptions = [
    'Expert - Deep understanding and experience with AI',
    'Advanced - Good knowledge, some implementation experience',
    'Intermediate - Basic understanding, exploring opportunities',
    'Beginner - Limited knowledge, just starting to learn',
    'Novice - Little to no AI knowledge or experience'
  ];

  const competitivePressureOptions = [
    'High - Competitors are already implementing AI successfully',
    'Moderate-High - Some competitors are ahead, need to catch up',
    'Moderate - Industry is exploring AI, no clear leaders yet',
    'Low-Moderate - Early stage industry adoption',
    'Low - AI adoption is not yet relevant in our industry'
  ];

  const handlePriorityChange = (priority: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      q1_business_priorities: checked 
        ? [...prev.q1_business_priorities, priority]
        : prev.q1_business_priorities.filter(p => p !== priority)
    }));
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onComplete(formData);
    }
  };

  const isFormValid = () => {
    return formData.q1_business_priorities.length >= 1 &&
           formData.q2_ai_familiarity &&
           formData.q3_competitive_pressure;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Strategic Foundation
        </h2>
        <p className="text-gray-600">
          Help us understand your business priorities and AI readiness context.
        </p>
      </div>

      <div className="space-y-8">
        {/* Q1: Business Priorities */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              1. What are your top business priorities for the next 12-18 months? (Select up to 3)
            </h3>
            <div className="space-y-3">
              {businessPriorities.map((priority) => (
                <div key={priority} className="flex items-center space-x-2">
                  <Checkbox
                    id={priority}
                    checked={formData.q1_business_priorities.includes(priority)}
                    onCheckedChange={(checked) => handlePriorityChange(priority, checked as boolean)}
                    disabled={!formData.q1_business_priorities.includes(priority) && formData.q1_business_priorities.length >= 3}
                  />
                  <Label htmlFor={priority} className="text-sm cursor-pointer flex-1">
                    {priority}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Q2: AI Familiarity */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              2. How would you describe your personal familiarity with AI technologies?
            </h3>
            <RadioGroup
              value={formData.q2_ai_familiarity}
              onValueChange={(value) => setFormData(prev => ({ ...prev, q2_ai_familiarity: value }))}
              className="space-y-3"
            >
              {aiFamiliarityOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q2-${index}`} />
                  <Label htmlFor={`q2-${index}`} className="text-sm cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>

        {/* Q3: Competitive Pressure */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              3. How much competitive pressure do you feel regarding AI adoption in your industry?
            </h3>
            <RadioGroup
              value={formData.q3_competitive_pressure}
              onValueChange={(value) => setFormData(prev => ({ ...prev, q3_competitive_pressure: value }))}
              className="space-y-3"
            >
              {competitivePressureOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q3-${index}`} />
                  <Label htmlFor={`q3-${index}`} className="text-sm cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StrategicFoundationSectionV2;