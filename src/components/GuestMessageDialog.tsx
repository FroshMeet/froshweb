
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
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary/30 to-primary/50 rounded-2xl mx-auto mb-4 flex items-center justify-center neon-glow">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-foreground">Create an Account to Message Classmates</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Join FroshMeet to start conversations and connect with your fellow students.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border border-border">
            <MessageSquare className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-sm text-foreground">Message classmates</p>
              <p className="text-xs text-muted-foreground">Start conversations and make friends</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-border text-foreground hover:bg-muted">
              Continue Browsing
            </Button>
            <Button onClick={onCreateAccount} className="flex-1 bg-primary hover:bg-primary/90 neon-glow">
              Create Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestMessageDialog;
