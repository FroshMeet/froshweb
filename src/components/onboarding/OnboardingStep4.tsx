
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Instagram, Phone } from "lucide-react";
import { Users, MessageSquare, Heart } from "lucide-react";

interface OnboardingStep4Props {
  formData: any;
  setFormData: (data: any) => void;
}

const OnboardingStep4 = ({ formData, setFormData }: OnboardingStep4Props) => {
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length <= 3) {
      return `(${phoneNumber}`;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phoneNumber: formatted }));
  };

  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Ensure it starts with @ and add it if user removes it
    if (!value.startsWith('@') && value.length > 0) {
      value = '@' + value.replace('@', '');
    }
    setFormData(prev => ({ ...prev, instagram: value }));
  };

  return (
    <>
      <div className="text-center mb-4">
        <p className="text-sm text-slate-600">
          Add your social media (optional). Choose whether to make them public or private.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="instagram" className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram Username
          </Label>
          <Input
            id="instagram"
            value={formData.instagram}
            onChange={handleInstagramChange}
            placeholder="@username"
          />
          {formData.instagram && (
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.instagramPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, instagramPublic: checked }))}
              />
              <Label className="text-sm text-slate-600">Make public</Label>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="snapchat" className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            Snapchat Username
          </Label>
          <Input
            id="snapchat"
            value={formData.snapchat}
            onChange={(e) => {
              let value = e.target.value;
              // Ensure it starts with @ and add it if user removes it
              if (!value.startsWith('@') && value.length > 0) {
                value = '@' + value.replace('@', '');
              }
              setFormData(prev => ({ ...prev, snapchat: value }));
            }}
            placeholder="@username"
          />
          {formData.snapchat && (
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.snapchatPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, snapchatPublic: checked }))}
              />
              <Label className="text-sm text-slate-600">Make public</Label>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            placeholder="(555) 123-4567"
          />
          {formData.phoneNumber && (
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.phonePublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, phonePublic: checked }))}
              />
              <Label className="text-sm text-slate-600">Make public</Label>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-3 pt-4">
        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
          <Users className="h-5 w-5 text-slate-600" />
          <div>
            <p className="font-medium">Connect with peers</p>
            <p className="text-sm text-slate-600">Find study buddies and friends</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
          <MessageSquare className="h-5 w-5 text-slate-600" />
          <div>
            <p className="font-medium">Smart matching</p>
            <p className="text-sm text-slate-600">Based on classes, dorms & interests</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
          <Heart className="h-5 w-5 text-slate-600" />
          <div>
            <p className="font-medium">Safe & secure</p>
            <p className="text-sm text-slate-600">Privacy controls & verified students</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingStep4;
