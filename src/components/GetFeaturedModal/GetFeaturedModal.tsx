
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { GetFeaturedModalHeader } from "./GetFeaturedModalHeader";
import { SchoolSelector } from "./SchoolSelector";
import { MessageInput } from "./MessageInput";
import { PhotoUpload } from "./PhotoUpload";
import { FormActions } from "./FormActions";

interface GetFeaturedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GetFeaturedModal: React.FC<GetFeaturedModalProps> = ({ open, onOpenChange }) => {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSchool || (!message && !photo)) {
      toast({
        title: "Missing information",
        description: "Please select a school and provide either a message or photo",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      toast({
        title: "Submission received!",
        description: "Your content has been submitted for review. We'll feature the best submissions on our Instagram!",
      });
      
      // Reset form
      setSelectedSchool("");
      setMessage("");
      setPhoto(null);
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-visible" hideCloseButton>
        <GetFeaturedModalHeader />

        <form onSubmit={handleSubmit} className="space-y-6">
          <SchoolSelector
            selectedSchool={selectedSchool}
            onSchoolChange={setSelectedSchool}
          />

          <MessageInput
            message={message}
            onMessageChange={setMessage}
          />

          <PhotoUpload
            photo={photo}
            onPhotoUpload={setPhoto}
          />

          <FormActions
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
            onSubmit={() => {}}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};
