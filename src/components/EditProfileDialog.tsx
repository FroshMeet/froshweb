
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Edit } from "lucide-react";

interface EditProfileDialogProps {
  user: any;
  onSave: (updatedUser: any) => void;
}

const EditProfileDialog = ({ user, onSave }: EditProfileDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    bio: user.bio,
    major: user.major,
    interests: [...user.interests],
    lookingFor: [...user.lookingFor],
    instagram: user.instagram,
    snapchat: user.snapchat,
    phoneNumber: user.phoneNumber,
    instagramPublic: user.instagramPublic,
    snapchatPublic: user.snapchatPublic,
    phonePublic: user.phonePublic
  });
  const [newInterest, setNewInterest] = useState("");
  const [newLookingFor, setNewLookingFor] = useState("");

  const handleSave = () => {
    onSave({ ...user, ...formData });
    setIsOpen(false);
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addLookingFor = () => {
    if (newLookingFor.trim() && !formData.lookingFor.includes(newLookingFor.trim())) {
      setFormData(prev => ({
        ...prev,
        lookingFor: [...prev.lookingFor, newLookingFor.trim()]
      }));
      setNewLookingFor("");
    }
  };

  const removeLookingFor = (item: string) => {
    setFormData(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.filter(i => i !== item)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell others about yourself..."
              className="min-h-[100px]"
            />
          </div>

          {/* Major */}
          <div className="space-y-2">
            <Label htmlFor="major">Major</Label>
            <Input
              id="major"
              value={formData.major}
              onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
              placeholder="Your major"
            />
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.interests.map((interest) => (
                <Badge key={interest} variant="outline" className="flex items-center gap-1">
                  {interest}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeInterest(interest)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add new interest"
                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
              />
              <Button type="button" onClick={addInterest} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Looking For */}
          <div className="space-y-2">
            <Label>Looking For</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.lookingFor.map((item) => (
                <Badge key={item} className="flex items-center gap-1 bg-purple-100 text-purple-700">
                  {item}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeLookingFor(item)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newLookingFor}
                onChange={(e) => setNewLookingFor(e.target.value)}
                placeholder="Add what you're looking for"
                onKeyPress={(e) => e.key === 'Enter' && addLookingFor()}
              />
              <Button type="button" onClick={addLookingFor} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media</h3>
            
            {/* Instagram */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="instagram-public" className="text-sm">Public</Label>
                  <Switch
                    id="instagram-public"
                    checked={formData.instagramPublic}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, instagramPublic: checked }))
                    }
                  />
                </div>
              </div>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => {
                  let value = e.target.value;
                  if (!value.startsWith('@') && value.length > 0) {
                    value = '@' + value;
                  }
                  setFormData(prev => ({ ...prev, instagram: value }));
                }}
                placeholder="@username"
              />
            </div>

            {/* Snapchat */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="snapchat">Snapchat</Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="snapchat-public" className="text-sm">Public</Label>
                  <Switch
                    id="snapchat-public"
                    checked={formData.snapchatPublic}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, snapchatPublic: checked }))
                    }
                  />
                </div>
              </div>
              <Input
                id="snapchat"
                value={formData.snapchat}
                onChange={(e) => {
                  let value = e.target.value;
                  if (!value.startsWith('@') && value.length > 0) {
                    value = '@' + value;
                  }
                  setFormData(prev => ({ ...prev, snapchat: value }));
                }}
                placeholder="@username"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="phone-public" className="text-sm">Public</Label>
                  <Switch
                    id="phone-public"
                    checked={formData.phonePublic}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, phonePublic: checked }))
                    }
                  />
                </div>
              </div>
              <Input
                id="phone"
                value={formData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  let formatted = value;
                  if (value.length >= 6) {
                    formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                  } else if (value.length >= 3) {
                    formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                  }
                  setFormData(prev => ({ ...prev, phoneNumber: formatted }));
                }}
                placeholder="(999) 555-4555"
                maxLength={14}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
