
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OnboardingStep2Props {
  formData: any;
  setFormData: (data: any) => void;
}

const OnboardingStep2 = ({ formData, setFormData }: OnboardingStep2Props) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="major">Major</Label>
        <Input
          id="major"
          value={formData.major}
          onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
          placeholder="Computer Science"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="classOf">Class of</Label>
        <Select value={formData.classOf} onValueChange={(value) => setFormData(prev => ({ ...prev, classOf: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2029">2029</SelectItem>
            <SelectItem value="2030">2030</SelectItem>
            <SelectItem value="2031">2031</SelectItem>
            <SelectItem value="2032">2032</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dorm">Dorm/Residence</Label>
        <Input
          id="dorm"
          value={formData.dorm}
          onChange={(e) => setFormData(prev => ({ ...prev, dorm: e.target.value }))}
          placeholder="e.g., Warren Hall, Off-campus"
        />
      </div>
    </>
  );
};

export default OnboardingStep2;
