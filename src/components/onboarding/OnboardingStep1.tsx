
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OnboardingStep1Props {
  formData: any;
  setFormData: (data: any) => void;
  colleges: string[];
}

const OnboardingStep1 = ({ formData, setFormData, colleges }: OnboardingStep1Props) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter your full name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={formData.age}
          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
          placeholder="18"
          min="16"
          max="25"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="college">College/University</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, college: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select your college" />
          </SelectTrigger>
          <SelectContent>
            {colleges.map((college) => (
              <SelectItem key={college} value={college}>
                {college}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default OnboardingStep1;
