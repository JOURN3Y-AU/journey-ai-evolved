
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';

interface Brand3yThankYouDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Brand3yThankYouDialog = ({ open, onOpenChange }: Brand3yThankYouDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="sr-only">Welcome to Brand3y (thats what we're calling it right now!)</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="text-center py-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Welcome to the future!</h2>
          <p className="text-gray-600 mb-6">
            You're now on the waitlist. We'll notify you as soon as we're ready to transform 
            how you understand your brand's performance.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Keep an eye on your inbox for exclusive updates and early access opportunities.
          </p>
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            Continue Exploring
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Brand3yThankYouDialog;
