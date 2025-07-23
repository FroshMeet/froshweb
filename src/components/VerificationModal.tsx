import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GraduationCap, Shield, CheckCircle } from "lucide-react";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolName: string;
  onStartVerification: () => void;
}

const VerificationModal = ({ 
  isOpen, 
  onClose, 
  schoolName, 
  onStartVerification 
}: VerificationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">🔒 Verification Required</DialogTitle>
              <DialogDescription>
                Access exclusive {schoolName} features
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">
              Only verified {schoolName} students can join this group
            </h3>
            <p className="text-muted-foreground text-sm">
              Verify your student status to unlock the {schoolName} Exclusive GC and connect with verified classmates.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">Secure student verification process</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">Connect with verified classmates only</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">Access exclusive school features</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={onStartVerification}
              className="w-full neon-glow"
              size="lg"
            >
              Start Verification
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-full"
            >
              Not Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;