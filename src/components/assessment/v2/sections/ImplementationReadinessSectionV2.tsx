import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ImplementationReadinessSectionV2Props {
  data: any;
  onComplete: (data: any) => void;
}

const ImplementationReadinessSectionV2 = ({ data, onComplete }: ImplementationReadinessSectionV2Props) => {
  const [formData, setFormData] = useState({
    q11_change_readiness: data.q11_change_readiness || '',
    q12_resource_allocation: data.q12_resource_allocation || '',
    q13_timeline_expectation: data.q13_timeline_expectation || '',
  });

  const changeReadinessOptions = [
    'High - Organization embraces change and adapts quickly',
    'Moderate-High - Generally receptive to change with proper communication',
    'Moderate - Change is possible but requires careful planning',
    'Low-Moderate - Resistance to change, needs strong change management',
    'Low - Significant resistance to change, prefers status quo'
  ];

  const resourceAllocationOptions = [
    'Dedicated budget and team ready for AI initiatives',
    'Budget approved, working on team formation',
    'Budget under consideration, exploring resource needs',
    'Limited budget, looking for cost-effective solutions',
    'No budget allocated yet, need to build business case'
  ];

  const timelineExpectationOptions = [
    'Immediate (0-3 months) - Need quick wins and pilot projects',
    'Short-term (3-6 months) - Plan to start implementation soon',
    'Medium-term (6-12 months) - Part of next year\'s strategy',
    'Long-term (12+ months) - Future consideration when ready',
    'Exploratory - No specific timeline, gathering information'
  ];

  const handleSubmit = () => {
    if (isFormValid()) {
      onComplete(formData);
    }
  };

  const isFormValid = () => {
    return formData.q11_change_readiness &&
           formData.q12_resource_allocation &&
           formData.q13_timeline_expectation;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Implementation Readiness
        </h2>
        <p className="text-gray-600">
          Assess your organization's readiness for change and resource allocation.
        </p>
      </div>

      <div className="space-y-8">
        {/* Q11: Change Readiness */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              11. How would you describe your organization's readiness for change?
            </h3>
            <RadioGroup
              value={formData.q11_change_readiness}
              onValueChange={(value) => setFormData(prev => ({ ...prev, q11_change_readiness: value }))}
              className="space-y-3"
            >
              {changeReadinessOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q11-${index}`} />
                  <Label htmlFor={`q11-${index}`} className="text-sm cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>

        {/* Q12: Resource Allocation */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              12. What is your current status regarding resource allocation for AI initiatives?
            </h3>
            <RadioGroup
              value={formData.q12_resource_allocation}
              onValueChange={(value) => setFormData(prev => ({ ...prev, q12_resource_allocation: value }))}
              className="space-y-3"
            >
              {resourceAllocationOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q12-${index}`} />
                  <Label htmlFor={`q12-${index}`} className="text-sm cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>

        {/* Q13: Timeline Expectation */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              13. What is your ideal timeline for beginning AI implementation?
            </h3>
            <RadioGroup
              value={formData.q13_timeline_expectation}
              onValueChange={(value) => setFormData(prev => ({ ...prev, q13_timeline_expectation: value }))}
              className="space-y-3"
            >
              {timelineExpectationOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q13-${index}`} />
                  <Label htmlFor={`q13-${index}`} className="text-sm cursor-pointer flex-1">
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

export default ImplementationReadinessSectionV2;