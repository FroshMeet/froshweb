import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Edit, Camera, MapPin } from "lucide-react";

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
    location: user.location || "",
    photos: user.photos || [],
    isInMeet: user.isInMeet || false,
    isInDiscover: user.isInDiscover || false
  });
  const [newInterest, setNewInterest] = useState("");
  const [newLookingFor, setNewLookingFor] = useState("");

  const getSchoolColors = (college) => {
    const colors = {
      "UCLA": "from-blue-600 to-yellow-400",
      "Harvard University": "from-red-700 to-red-900",
      "Stanford University": "from-red-600 to-red-800",
      "MIT": "from-gray-700 to-gray-900",
      "UC Berkeley": "from-blue-700 to-yellow-500",
      "Arizona State University": "from-yellow-400 to-red-600"
    };
    return colors[college] || "from-blue-600 to-purple-600";
  };

  const handleSave = () => {
    const updatedUser = { 
      ...user, 
      ...formData,
      location: formData.location.trim() || null
    };
    onSave(updatedUser);
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

  const addPhoto = () => {
    const photoIds = [
      "photo-1649972904349-6e44c42644a7",
      "photo-1581091226825-a6a2a5aee158",
      "photo-1581092795360-fd1ca04f0952",
      "photo-1507003211169-0a1dd7228f2d",
      "photo-1494790108755-2616c9f42db8"
    ];
    const randomPhoto = photoIds[Math.floor(Math.random() * photoIds.length)];
    
    if (formData.photos.length < 10) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, randomPhoto]
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
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
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Profile Visibility Toggles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Profile Visibility</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isInMeet: !prev.isInMeet }))}
                className={`h-16 text-sm font-bold transition-all duration-200 ${
                  formData.isInMeet 
                    ? `bg-gradient-to-r ${getSchoolColors(user.college)} text-white shadow-lg scale-105` 
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {formData.isInMeet ? "✓ In Meet" : "Join Meet"}
              </Button>
              <Button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isInDiscover: !prev.isInDiscover }))}
                className={`h-16 text-sm font-bold transition-all duration-200 ${
                  formData.isInDiscover 
                    ? `bg-gradient-to-r ${getSchoolColors(user.college)} text-white shadow-lg scale-105` 
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {formData.isInDiscover ? "✓ In Discover" : "Join Discover"}
              </Button>
            </div>
            <p className="text-xs text-slate-600">
              Toggle to show your profile in Meet (swipe cards) and Discover (profile grid) sections
            </p>
          </div>

          {/* Photos */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Profile Photos ({formData.photos.length}/10)</Label>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={`https://images.unsplash.com/${photo}?w=150&h=150&fit=crop&crop=face`}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors duration-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            {formData.photos.length < 10 && (
              <Button type="button" onClick={addPhoto} variant="outline" size="sm" className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            )}
            <p className="text-xs text-slate-600">
              Add 3-10 photos to post your profile in Meet and Discover
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-3">
            <Label htmlFor="bio" className="text-base font-semibold">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell others about yourself..."
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Major */}
          <div className="space-y-3">
            <Label htmlFor="major" className="text-base font-semibold">Major</Label>
            <Input
              id="major"
              value={formData.major}
              onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
              placeholder="Your major"
            />
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label htmlFor="location" className="text-base font-semibold">Location (Optional)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Sacramento, CA"
                className="pl-10"
              />
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Interests</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.interests.map((interest) => (
                <Badge key={interest} variant="outline" className="flex items-center gap-1 px-3 py-1">
                  {interest}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500 transition-colors duration-200"
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
          <div className="space-y-3">
            <Label className="text-base font-semibold">Looking For</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.lookingFor.map((item) => (
                <Badge key={item} className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1">
                  {item}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500 transition-colors duration-200"
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
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800">Social Media</h3>
            
            {/* Instagram */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="instagram" className="text-base font-semibold">Instagram</Label>
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="snapchat" className="text-base font-semibold">Snapchat</Label>
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

            {/* Phone Number - Always Private */}
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-base font-semibold">Phone Number (Private)</Label>
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
              <p className="text-xs text-slate-600">
                Your phone number is always kept private and never shown to other users
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <Button onClick={handleSave} className="flex-1 bg-slate-900 hover:bg-slate-800 font-semibold py-3">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1 font-semibold py-3">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
