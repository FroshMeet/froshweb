
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface OnboardingStep3Props {
  formData: any;
  setFormData: (data: any) => void;
  interestOptions: string[];
  lookingForOptions: string[];
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  addLookingFor: (item: string) => void;
  removeLookingFor: (item: string) => void;
}

const OnboardingStep3 = ({ 
  formData, 
  setFormData, 
  interestOptions, 
  lookingForOptions,
  addInterest,
  removeInterest,
  addLookingFor,
  removeLookingFor
}: OnboardingStep3Props) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell others about yourself..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Interests</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.interests.map((interest) => (
            <Badge key={interest} variant="secondary" className="bg-slate-100 text-slate-700">
              {interest}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => removeInterest(interest)}
              />
            </Badge>
          ))}
        </div>
        <Select onValueChange={addInterest}>
          <SelectTrigger>
            <SelectValue placeholder="Add interests" />
          </SelectTrigger>
          <SelectContent>
            {interestOptions.map((interest) => (
              <SelectItem key={interest} value={interest}>
                {interest}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Looking for</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.lookingFor.map((item) => (
            <Badge key={item} variant="secondary" className="bg-slate-100 text-slate-700">
              {item}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => removeLookingFor(item)}
              />
            </Badge>
          ))}
        </div>
        <Select onValueChange={addLookingFor}>
          <SelectTrigger>
            <SelectValue placeholder="Select what you're looking for" />
          </SelectTrigger>
          <SelectContent>
            {lookingForOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default OnboardingStep3;
