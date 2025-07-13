import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GetFeaturedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SCHOOL_OPTIONS = [
  { name: "University of California, Los Angeles", slug: "ucla" },
  { name: "Stanford University", slug: "stanford" },
  { name: "University of California, Berkeley", slug: "uc-berkeley" },
  { name: "University of Southern California", slug: "usc" },
  { name: "Harvard University", slug: "harvard" },
  { name: "Arizona State University", slug: "asu" },
  { name: "University of California, Santa Barbara", slug: "ucsb" },
  { name: "New York University", slug: "nyu" },
  { name: "University of Florida", slug: "uf" },
  { name: "Texas A&M University", slug: "texas-aandm" },
  { name: "Cornell University", slug: "cornell" },
  { name: "Pennsylvania State University", slug: "penn-state" },
  { name: "Duke University", slug: "duke" },
  { name: "Florida State University", slug: "fsu" },
  { name: "University of Pennsylvania", slug: "upenn" },
  { name: "Dartmouth College", slug: "dartmouth" },
  { name: "Columbia University", slug: "columbia" },
  { name: "University of California, Irvine", slug: "uc-irvine" },
  { name: "University of Michigan", slug: "umich" },
  { name: "Massachusetts Institute of Technology", slug: "mit" },
  { name: "Northeastern University", slug: "northeastern" },
  { name: "University of California, San Diego", slug: "ucsd" },
  { name: "University of Central Florida", slug: "ucf" },
  { name: "Princeton University", slug: "princeton" },
  { name: "Brown University", slug: "brown" },
  { name: "Yale University", slug: "yale" },
  { name: "Georgetown University", slug: "georgetown" },
  { name: "University of California, Santa Cruz", slug: "uc-santa-cruz" },
  { name: "Carnegie Mellon University", slug: "cmu" },
  { name: "University of Miami", slug: "umiami" },
  { name: "Northwestern University", slug: "northwestern" },
  { name: "Rice University", slug: "rice" },
  { name: "Purdue University", slug: "purdue" },
  { name: "University of Chicago", slug: "uchicago" },
  { name: "Vanderbilt University", slug: "vanderbilt" },
  { name: "Indiana University Bloomington", slug: "iu-bloomington" },
  { name: "University of Georgia", slug: "uga" },
  { name: "University of Illinois Urbana-Champaign", slug: "uiuc" },
  { name: "Ohio State University", slug: "ohio-state" },
  { name: "Michigan State University", slug: "michigan-state" },
  { name: "University of Minnesota", slug: "umn" },
  { name: "University of North Carolina at Chapel Hill", slug: "unc" },
  { name: "University of Oregon", slug: "uoregon" },
  { name: "University of Texas at Austin", slug: "ut-austin" },
  { name: "University of Virginia", slug: "uva" },
  { name: "University of Washington", slug: "uw" },
  { name: "University of Wisconsin–Madison", slug: "uw-madison" },
  { name: "California Polytechnic State University, San Luis Obispo", slug: "cal-poly-slo" },
  { name: "California State Polytechnic University, Pomona", slug: "cal-poly-pomona" },
  { name: "University of California, Davis", slug: "uc-davis" },
  { name: "University of California, Riverside", slug: "uc-riverside" },
  { name: "University of California, Merced", slug: "uc-merced" },
  { name: "California Institute of Technology", slug: "caltech" },
  { name: "California State University, Sacramento", slug: "sac-state" },
  { name: "San Diego State University", slug: "sdsu" },
  { name: "San Jose State University", slug: "sjsu" },
  { name: "San Francisco State University", slug: "sf-state" },
  { name: "California State University, Chico", slug: "chico-state" },
  { name: "Boston University", slug: "bu" },
  { name: "University of Arizona", slug: "uarizona" },
  { name: "University of Alabama", slug: "ua" },
  { name: "University of Colorado Boulder", slug: "cu-boulder" },
  { name: "California State University, Long Beach", slug: "csulb" },
  { name: "Virginia Polytechnic Institute and State University", slug: "virginia-tech" }
];

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
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your school..." />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {SCHOOL_OPTIONS.map((school) => (
                  <SelectItem key={school.slug} value={school.slug}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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