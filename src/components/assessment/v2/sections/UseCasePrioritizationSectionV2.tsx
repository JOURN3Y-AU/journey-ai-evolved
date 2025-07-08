import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface UseCasePrioritizationSectionV2Props {
  data: any;
  onComplete: (data: any) => void;
}

const UseCasePrioritizationSectionV2 = ({ data, onComplete }: UseCasePrioritizationSectionV2Props) => {
  const [formData, setFormData] = useState({
    q8_priority_areas: data.q8_priority_areas || [],
    q9_automation_readiness: data.q9_automation_readiness || '',
    q10_decision_making: data.q10_decision_making || '',
  });

  const priorityAreas = [
    'Customer service and support automation',
    'Content creation and marketing optimization',
    'Data analysis and business intelligence',
    'Process automation and workflow optimization',
    'Predictive analytics and forecasting',
    'Knowledge management and information retrieval',
    'Product development and innovation',
    'Quality assurance and testing',
    'Financial analysis and reporting',
    'Human resources and talent management'
  ];

  const automationReadinessOptions = [
    'High - We have many repetitive processes ready for automation',
    'Moderate-High - Several clear opportunities for process improvement',
    'Moderate - Some processes could benefit from automation',
    'Low-Moderate - Limited automation opportunities identified',
    'Low - Most of our work requires human judgment and creativity'
  ];

  const decisionMakingOptions = [
    'Data-driven - We base most decisions on quantitative analysis',
    'Mixed approach - Combination of data and experience/intuition',
    'Experience-based - Primarily rely on expertise and past experience',
    'Collaborative - Group consensus and stakeholder input',
    'Ad-hoc - Decision-making process varies by situation'
  ];

  const handlePriorityChange = (area: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      q8_priority_areas: checked 
        ? [...prev.q8_priority_areas, area]
        : prev.q8_priority_areas.filter(a => a !== area)
    }));
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onComplete(formData);
    }
  };

  const isFormValid = () => {
    return formData.q8_priority_areas.length >= 1 &&
           formData.q9_automation_readiness &&
           formData.q10_decision_making;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Use Case Prioritization
        </h2>
        <p className="text-gray-600">
          Identify where AI can make the biggest impact in your organization.
        </p>
      </div>

      <div className="space-y-8">
        {/* Q8: Priority Areas */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              8. Which areas would you prioritize for AI implementation? (Select up to 3)
            </h3>
            <div className="space-y-3">
              {priorityAreas.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={area}
                    checked={formData.q8_priority_areas.includes(area)}
                    onCheckedChange={(checked) => handlePriorityChange(area, checked as boolean)}
                    disabled={!formData.q8_priority_areas.includes(area) && formData.q8_priority_areas.length >= 3}
                  />
                  <Label htmlFor={area} className="text-sm cursor-pointer flex-1">
                    {area}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Q9: Automation Readiness */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              9. How ready is your organization for process automation?
            </h3>
            <RadioGroup
              value={formData.q9_automation_readiness}
              onValueChange={(value) => setFormData(prev => ({ ...prev, q9_automation_readiness: value }))}
              className="space-y-3"
            >
              {automationReadinessOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q9-${index}`} />
                  <Label htmlFor={`q9-${index}`} className="text-sm cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>

        {/* Q10: Decision Making */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              10. How would you describe your organization's approach to decision-making?
            </h3>
            <RadioGroup
              value={formData.q10_decision_making}
              onValueChange={(value) => setFormData(prev => ({ ...prev, q10_decision_making: value }))}
              className="space-y-3"
            >
              {decisionMakingOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q10-${index}`} />
                  <Label htmlFor={`q10-${index}`} className="text-sm cursor-pointer flex-1">
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

export default UseCasePrioritizationSectionV2;