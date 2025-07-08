import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface DataAIReadinessSectionV2Props {
  data: any;
  onComplete: (data: any) => void;
}

const DataAIReadinessSectionV2 = ({ data, onComplete }: DataAIReadinessSectionV2Props) => {
  const [formData, setFormData] = useState({
    q4_data_landscape: data.q4_data_landscape || '',
    q5_ai_barriers: data.q5_ai_barriers || [],
    q6_genai_experience: data.q6_genai_experience || '',
    q7_data_quality: data.q7_data_quality || '',
  });

  const dataLandscapeOptions = [
    'Modern cloud-based infrastructure with integrated data platforms',
    'Mixed environment - some cloud, some on-premise systems',
    'Primarily on-premise with limited cloud adoption',
    'Legacy systems with significant technical debt',
    'Uncertain - limited visibility into our data infrastructure'
  ];

  const aiBarriers = [
    'Lack of AI expertise or skills',
    'Data quality and accessibility issues',
    'Budget constraints and unclear ROI',
    'Security and privacy concerns',
    'Integration with existing systems',
    'Executive buy-in and support',
    'Change management and adoption',
    'Regulatory and compliance requirements'
  ];

  const genaiExperienceOptions = [
    'Extensive - Using GenAI tools daily for various business functions',
    'Moderate - Regular use of ChatGPT, Copilot, or similar tools',
    'Limited - Occasional experimentation with AI tools',
    'Minimal - Tried a few times but not regular use',
    'None - Have not used Generative AI tools yet'
  ];

  const dataQualityOptions = [
    'Excellent - Clean, integrated, and easily accessible',
    'Good - Mostly reliable with some integration challenges',
    'Fair - Usable but requires significant cleanup',
    'Poor - Fragmented across systems, inconsistent quality',
    'Unknown - Haven\'t assessed our data quality'
  ];

  const handleBarrierChange = (barrier: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      q5_ai_barriers: checked 
        ? [...prev.q5_ai_barriers, barrier]
        : prev.q5_ai_barriers.filter(b => b !== barrier)
    }));
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onComplete(formData);
    }
  };

  const isFormValid = () => {
    return formData.q4_data_landscape &&
           formData.q5_ai_barriers.length >= 1 &&
           formData.q6_genai_experience &&
           formData.q7_data_quality;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Data & AI Readiness
        </h2>
        <p className="text-gray-600">
          Assess your current data infrastructure and AI experience.
        </p>
      </div>

      <div className="space-y-8">
        {/* Q4: Data Landscape */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              4. How would you describe your organization's current data and technology landscape?
            </h3>
            <RadioGroup
              value={formData.q4_data_landscape}
              onValueChange={(value) => setFormData(prev => ({ ...prev, q4_data_landscape: value }))}
              className="space-y-3"
            >
              {dataLandscapeOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q4-${index}`} />
                  <Label htmlFor={`q4-${index}`} className="text-sm cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>

        {/* Q5: AI Barriers */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              5. What do you see as the biggest barriers to AI adoption in your organization? (Select all that apply)
            </h3>
            <div className="space-y-3">
              {aiBarriers.map((barrier) => (
                <div key={barrier} className="flex items-center space-x-2">
                  <Checkbox
                    id={barrier}
                    checked={formData.q5_ai_barriers.includes(barrier)}
                    onCheckedChange={(checked) => handleBarrierChange(barrier, checked as boolean)}
                  />
                  <Label htmlFor={barrier} className="text-sm cursor-pointer flex-1">
                    {barrier}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Q6: GenAI Experience */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              6. What is your organization's experience with Generative AI tools (ChatGPT, Claude, Copilot, etc.)?
            </h3>
            <RadioGroup
              value={formData.q6_genai_experience}
              onValueChange={(value) => setFormData(prev => ({ ...prev, q6_genai_experience: value }))}
              className="space-y-3"
            >
              {genaiExperienceOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q6-${index}`} />
                  <Label htmlFor={`q6-${index}`} className="text-sm cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>

        {/* Q7: Data Quality */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              7. How would you rate your organization's data quality and accessibility?
            </h3>
            <RadioGroup
              value={formData.q7_data_quality}
              onValueChange={(value) => setFormData(prev => ({ ...prev, q7_data_quality: value }))}
              className="space-y-3"
            >
              {dataQualityOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q7-${index}`} />
                  <Label htmlFor={`q7-${index}`} className="text-sm cursor-pointer flex-1">
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

export default DataAIReadinessSectionV2;