import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ContactSectionV2Props {
  data: any;
  assessmentData: any;
  onComplete: (data: any) => void;
}

const getRoleDisplayName = (roleCode: string) => {
  const roleMap: { [key: string]: string } = {
    'CEO': 'Executive Leadership',
    'CFO': 'Finance',
    'CMO': 'Marketing',
    'CHRO': 'Human Resources',
    'CPO': 'Product',
    'CTO': 'Technology',
    'Other': 'Other Executive/Leadership Role'
  };
  return roleMap[roleCode] || roleCode;
};

const ContactSectionV2 = ({ data, assessmentData, onComplete }: ContactSectionV2Props) => {
  const [formData, setFormData] = useState({
    first_name: data.first_name || '',
    last_name: data.last_name || '',
    email: data.email || '',
    phone_number: data.phone_number || '',
    interested_in_conversation: data.interested_in_conversation ?? true,
  });

  const handleSubmit = () => {
    if (isFormValid()) {
      onComplete(formData);
    }
  };

  const isFormValid = () => {
    return formData.first_name.trim() !== '' &&
           formData.last_name.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.email.includes('@');
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Get Your Personalized AI Readiness Report
        </h2>
        <p className="text-gray-600">
          Provide your contact details to receive your comprehensive assessment results and personalized recommendations.
        </p>
      </div>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">Your Assessment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Company:</span> {assessmentData.company_name}
          </div>
          <div>
            <span className="font-medium text-gray-700">Role:</span> {getRoleDisplayName(assessmentData.selected_role)}
          </div>
          <div>
            <span className="font-medium text-gray-700">Industry:</span> {assessmentData.industry}
          </div>
          <div>
            <span className="font-medium text-gray-700">Size:</span> {assessmentData.company_size}
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {/* First Name */}
        <div>
          <Label htmlFor="first_name" className="text-base font-medium">First Name *</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
            placeholder="Your first name"
            className="mt-2"
          />
        </div>

        {/* Last Name */}
        <div>
          <Label htmlFor="last_name" className="text-base font-medium">Last Name *</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
            placeholder="Your last name"
            className="mt-2"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-base font-medium">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your.email@company.com"
            className="mt-2"
          />
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phone_number" className="text-base font-medium">Phone Number (Optional)</Label>
          <Input
            id="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
            placeholder="+1 (555) 123-4567"
            className="mt-2"
          />
        </div>

        {/* Conversation Interest */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="interested_in_conversation"
              checked={formData.interested_in_conversation}
              onCheckedChange={(checked) => setFormData(prev => ({ 
                ...prev, 
                interested_in_conversation: checked as boolean 
              }))}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="interested_in_conversation" className="cursor-pointer font-medium text-blue-900">
                Yes, I'm interested in a complimentary AI Strategy Session with JOURN3Y
              </Label>
              <p className="text-sm text-blue-700 mt-1">
                Get a personalized 45-minute consultation to discuss your assessment results, identify quick wins, 
                and develop a strategic roadmap for AI implementation in your organization.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">What you'll receive:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Comprehensive AI readiness score with industry benchmarks</li>
          <li>• Personalized recommendations based on your specific role and industry</li>
          <li>• Priority action items for immediate implementation</li>
          <li>• Strategic roadmap for long-term AI transformation</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        >
          Get My AI Readiness Report
        </Button>
      </div>
    </div>
  );
};

export default ContactSectionV2;