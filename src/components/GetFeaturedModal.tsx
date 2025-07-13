
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { SCHOOL_DATABASE } from "@/config/schoolDatabase";

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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select a photo under 5MB",
          variant: "destructive",
        });
        return;
      }
      setPhoto(file);
    }
  };

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

  const removePhoto = () => {
    setPhoto(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Instagram className="h-4 w-4 text-white" />
            </div>
            Get Featured on Instagram
          </DialogTitle>
          <DialogDescription>
            Share your story or photo to be featured on your school's FroshMeet Instagram account!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="school">Select your school</Label>
            <SearchableSelect
              options={SCHOOL_DATABASE}
              value={selectedSchool}
              onValueChange={setSelectedSchool}
              placeholder="Search and select your school..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Share your story, excitement about college, or a fun fact about yourself..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Upload a photo (optional)</Label>
            {photo ? (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Upload className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{photo.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(photo.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removePhoto}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="border-dashed border-2 p-6">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload a photo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Max 5MB • JPG, PNG, GIF
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="mt-3"
                  />
                </div>
              </Card>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 border-0"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
