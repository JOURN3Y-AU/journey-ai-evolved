
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GleanThankYouDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GleanThankYouDialog = ({ open, onOpenChange }: GleanThankYouDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thank You!</DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Demo Request Received</h2>
          <p className="text-gray-600 mb-6">
            Our Glean specialist will contact you within 24 hours to schedule your personalized demo.
          </p>
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GleanThankYouDialog;
