
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface ContactSectionProps {
  contactInfo: any;
  onComplete: (contactInfo: any) => void;
}

const ContactSection = ({ contactInfo, onComplete }: ContactSectionProps) => {
  const [formData, setFormData] = useState({
    first_name: contactInfo.first_name || '',
    last_name: contactInfo.last_name || '',
    email: contactInfo.email || '',
    phone_number: contactInfo.phone_number || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete(formData);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Contact Information
        </h2>
        <p className="text-gray-600">
          We'll use this information to send you your personalized AI readiness report and follow up with strategic recommendations.
        </p>
      </div>

      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
              First Name *
            </Label>
            <Input
              id="first_name"
              type="text"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              className={`mt-1 ${errors.first_name ? 'border-red-500' : ''}`}
              placeholder="Enter your first name"
            />
            {errors.first_name && (
              <p className="text-sm text-red-600 mt-1">{errors.first_name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
              Last Name *
            </Label>
            <Input
              id="last_name"
              type="text"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              className={`mt-1 ${errors.last_name ? 'border-red-500' : ''}`}
              placeholder="Enter your last name"
            />
            {errors.last_name && (
              <p className="text-sm text-red-600 mt-1">{errors.last_name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
              Phone Number (Optional)
            </Label>
            <Input
              id="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              className="mt-1"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Important:</strong> Please complete this assessment in one session. 
            Your progress cannot be saved if you leave the page. The assessment takes approximately 15-20 minutes to complete.
          </p>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          Generate My AI Readiness Report
        </Button>
      </div>
    </div>
  );
};

export default ContactSection;
