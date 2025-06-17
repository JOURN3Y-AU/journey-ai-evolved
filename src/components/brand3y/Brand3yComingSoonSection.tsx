
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import useScrollReveal from '@/hooks/useScrollReveal';
import { supabase } from '@/integrations/supabase/client';
import { Rocket, Mail, Users } from 'lucide-react';

interface Brand3yComingSoonSectionProps {
  onFormSubmitSuccess: () => void;
}

const Brand3yComingSoonSection = ({ onFormSubmitSuccess }: Brand3yComingSoonSectionProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const sectionRef = useScrollReveal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        service_type: 'brand3y-waitlist',
        campaign_source: 'brand3y_coming_soon',
        message: `Waitlist signup for Brand3y\nRole: ${formData.role}`
      };

      console.log('Submitting Brand3y waitlist data:', submissionData);

      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: submissionData
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Success response:', data);

      onFormSubmitSuccess();
      
      toast({
        title: "Welcome to the waitlist!",
        description: "We'll notify you as soon as Brand3y is ready.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        role: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was a problem joining the waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="py-20 bg-gradient-to-br from-orange-600 to-red-600 text-white">
      <div className="container mx-auto px-4">
        <div ref={sectionRef} className="reveal transition-all duration-500 ease-out">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            
            {/* Left Column - Content */}
            <div>
              <div className="mb-6">
                <Rocket className="w-12 h-12 text-orange-200 mb-4" />
                <h2 className="text-4xl font-bold mb-6">
                  Revolutionary Brand Intelligence is Coming
                </h2>
                <p className="text-xl text-orange-100 mb-8 leading-relaxed">
                  We're building something that will change how marketers understand their competitive landscape forever. 
                  Join the waitlist to be among the first to experience the future of brand intelligence.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-orange-200" />
                  <span className="text-orange-100">Get exclusive early access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-orange-200" />
                  <span className="text-orange-100">Join marketing leaders from Fortune 500 companies</span>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-white rounded-lg shadow-xl p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-6 text-center">Join the Waitlist</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    name="role"
                    type="text"
                    required
                    value={formData.role}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="e.g. Marketing Director, Brand Manager"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-6 text-lg font-semibold"
                >
                  {isSubmitting ? 'Joining Waitlist...' : 'Join the Waitlist'}
                </Button>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                We'll only email you about Brand3y updates. No spam, ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brand3yComingSoonSection;
