
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Instagram } from "lucide-react";
import { Users, MessageSquare, Heart } from "lucide-react";

interface OnboardingStep4Props {
  formData: any;
  setFormData: (data: any) => void;
}

const OnboardingStep4 = ({ formData, setFormData }: OnboardingStep4Props) => {
  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('@') && value.length > 0) {
      value = '@' + value.replace('@', '');
    }
    setFormData(prev => ({ ...prev, instagram: value }));
  };

  return (
    <>
      <div className="text-center mb-4">
        <p className="text-sm text-slate-600">
          Add your social media (optional). Choose whether to make them public on your profile.
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
              <Label className="text-sm text-slate-600">Make public on profile</Label>
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
              <Label className="text-sm text-slate-600">Make public on profile</Label>
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
