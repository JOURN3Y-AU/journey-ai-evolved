import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft } from 'lucide-react';
import RoleSelectionSectionV2 from './sections/RoleSelectionSectionV2';
import StrategicFoundationSectionV2 from './sections/StrategicFoundationSectionV2';
import DataAIReadinessSectionV2 from './sections/DataAIReadinessSectionV2';
import UseCasePrioritizationSectionV2 from './sections/UseCasePrioritizationSectionV2';
import ImplementationReadinessSectionV2 from './sections/ImplementationReadinessSectionV2';
import RoleSpecificSectionV2 from './sections/RoleSpecificSectionV2';
import ContactSectionV2 from './sections/ContactSectionV2';
import { AssessmentDataV2, ContactInfoV2, AssessmentSection } from '@/types/assessmentV2';

interface AssessmentFormV2Props {
  onComplete: (answers: AssessmentDataV2, contact: ContactInfoV2) => void;
}

const AssessmentFormV2 = ({ onComplete }: AssessmentFormV2Props) => {
  const [currentSection, setCurrentSection] = useState<AssessmentSection>('role_selection');
  const [assessmentData, setAssessmentData] = useState<Partial<AssessmentDataV2>>({
    responses: {
      q1_business_priorities: [],
      q2_ai_familiarity: '',
      q3_competitive_pressure: '',
      q4_data_landscape: '',
      q5_ai_barriers: [],
      q6_genai_experience: '',
      q7_data_quality: '',
      q8_priority_areas: [],
      q9_automation_readiness: '',
      q10_decision_making: '',
      q11_change_readiness: '',
      q12_resource_allocation: '',
      q13_timeline_expectation: '',
      q14_role_specific_1: '',
      q15_role_specific_2: '',
    }
  });
  const [contactInfo, setContactInfo] = useState<Partial<ContactInfoV2>>({});
  
  const sections: { id: AssessmentSection; title: string; description: string }[] = [
    { id: 'role_selection', title: 'Role & Company', description: 'Tell us about your role and company' },
    { id: 'strategic_foundation', title: 'Strategic Foundation', description: 'Your business priorities and AI readiness' },
    { id: 'data_ai_readiness', title: 'Data & AI Readiness', description: 'Current data landscape and AI experience' },
    { id: 'use_case_prioritization', title: 'Use Case Priorities', description: 'Where AI can make the biggest impact' },
    { id: 'implementation_readiness', title: 'Implementation Readiness', description: 'Change management and resource planning' },
    { id: 'role_specific', title: 'Role-Specific Deep Dive', description: 'Questions tailored to your specific role' },
    { id: 'contact_info', title: 'Contact Information', description: 'Get your personalized AI readiness report' },
  ];

  const currentIndex = sections.findIndex(s => s.id === currentSection);
  const progressPercentage = ((currentIndex + 1) / sections.length) * 100;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleSectionComplete = (sectionData: any) => {
    if (currentSection === 'contact_info') {
      // Final section - complete assessment
      const finalContact = { ...contactInfo, ...sectionData } as ContactInfoV2;
      const finalAssessment = { ...assessmentData } as AssessmentDataV2;
      
      if (isAssessmentComplete(finalAssessment, finalContact)) {
        onComplete(finalAssessment, finalContact);
      }
    } else if (currentSection === 'role_selection') {
      // Update core company info
      setAssessmentData(prev => ({ ...prev, ...sectionData }));
      setCurrentSection('strategic_foundation');
      scrollToTop();
    } else {
      // Update responses for other sections
      setAssessmentData(prev => ({
        ...prev,
        responses: { ...prev.responses, ...sectionData }
      }));
      
      // Navigate to next section
      const nextIndex = currentIndex + 1;
      if (nextIndex < sections.length) {
        setCurrentSection(sections[nextIndex].id);
        scrollToTop();
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1].id);
      scrollToTop();
    }
  };

  const isAssessmentComplete = (assessment: AssessmentDataV2, contact: ContactInfoV2): boolean => {
    const requiredFields = ['selected_role', 'company_name', 'company_size', 'industry'];
    const requiredContactFields = ['first_name', 'last_name', 'email'];
    
    return requiredFields.every(field => assessment[field as keyof AssessmentDataV2]) &&
           requiredContactFields.every(field => contact[field as keyof ContactInfoV2]) &&
           Object.keys(assessment.responses || {}).length >= 15; // All questions answered
  };

  const renderCurrentSection = () => {
    const props = {
      data: currentSection === 'role_selection' ? assessmentData : assessmentData.responses || {},
      onComplete: handleSectionComplete
    };

    switch (currentSection) {
      case 'role_selection':
        return <RoleSelectionSectionV2 {...props} />;
      case 'strategic_foundation':
        return <StrategicFoundationSectionV2 {...props} />;
      case 'data_ai_readiness':
        return <DataAIReadinessSectionV2 {...props} />;
      case 'use_case_prioritization':
        return <UseCasePrioritizationSectionV2 {...props} />;
      case 'implementation_readiness':
        return <ImplementationReadinessSectionV2 {...props} />;
      case 'role_specific':
        return (
          <RoleSpecificSectionV2 
            {...props} 
            selectedRole={assessmentData.selected_role}
          />
        );
      case 'contact_info':
        return (
          <ContactSectionV2 
            data={contactInfo}
            onComplete={handleSectionComplete}
            assessmentData={assessmentData}
          />
        );
      default:
        return null;
    }
  };

  const currentSectionData = sections[currentIndex];

  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AI Readiness Assessment
            </h1>
            <p className="text-gray-600 mb-2">
              {currentSectionData.description}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Section {currentIndex + 1} of {sections.length}: {currentSectionData.title}
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                {Math.round(progressPercentage)}% Complete
              </p>
            </div>
          </div>

          {/* Main Form Card */}
          <Card className="p-8 shadow-lg">
            {renderCurrentSection()}
            
            {/* Navigation */}
            {currentIndex > 0 && (
              <div className="flex justify-start mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AssessmentFormV2;