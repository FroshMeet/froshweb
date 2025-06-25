
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";

interface GuestMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount: () => void;
}

const GuestMessageDialog = ({ isOpen, onClose, onCreateAccount }: GuestMessageDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Users className="h-8 w-8 text-white" />
          </div>
          <DialogTitle>Create an Account to Message Classmates</DialogTitle>
          <DialogDescription>
            Join FroshMeet to start conversations and connect with your fellow students.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
            <MessageSquare className="h-5 w-5 text-slate-600" />
            <div>
              <p className="font-medium text-sm">Message classmates</p>
              <p className="text-xs text-slate-600">Start conversations and make friends</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Continue Browsing
            </Button>
            <Button onClick={onCreateAccount} className="flex-1 bg-slate-900 hover:bg-slate-800">
              Create Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestMessageDialog;
