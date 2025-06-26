import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditProfileDialogProps {
  user: any;
  onSave: (updatedUser: any) => void;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const EditProfileDialog = ({ user, onSave, className, isOpen, onClose }: EditProfileDialogProps) => {
  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState(user?.age || "");
  const [major, setMajor] = useState(user?.major || "");
  const [dorm, setDorm] = useState(user?.dorm || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [interests, setInterests] = useState(user?.interests || []);
  const [lookingFor, setLookingFor] = useState(user?.lookingFor || []);
  const [instagram, setInstagram] = useState(user?.instagram || "");
  const [snapchat, setSnapchat] = useState(user?.snapchat || "");

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: name,
      age: age,
      major: major,
      dorm: dorm,
      bio: bio,
      interests: interests,
      lookingFor: lookingFor,
      instagram: instagram,
      snapchat: snapchat,
    };
    onSave(updatedUser);
    if (onClose) {
      onClose();
    }
  };

  const interestOptions = [
    "Programming", "Sports", "Music", "Art", "Photography", "Reading",
    "Gaming", "Hiking", "Cooking", "Travel", "Dancing", "Fitness",
    "Movies", "Anime", "Fashion", "Volunteering", "Business", "Science"
  ];

  const lookingForOptions = [
    "Friends", "Study Buddy", "Roommate", "Dating", "Networking", "Activity Partner"
  ];

  const addInterest = (interest) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const removeInterest = (interest) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const addLookingFor = (item) => {
    if (!lookingFor.includes(item)) {
      setLookingFor([...lookingFor, item]);
    }
  };

  const removeLookingFor = (item) => {
    setLookingFor(lookingFor.filter(i => i !== item));
  };

  // If isOpen is provided, use controlled mode
  if (isOpen !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">
                Age
              </Label>
              <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="major" className="text-right">
                Major
              </Label>
              <Input id="major" value={major} onChange={(e) => setMajor(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dorm" className="text-right">
                Dorm
              </Label>
              <Input id="dorm" value={dorm} onChange={(e) => setDorm(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="bio" className="text-right mt-2">
                Bio
              </Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Interests
              </Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <Badge
                    key={interest}
                    variant={interests.includes(interest) ? "default" : "outline"}
                    onClick={() => interests.includes(interest) ? removeInterest(interest) : addInterest(interest)}
                    className="cursor-pointer"
                  >
                    {interest}
                    {interests.includes(interest) && <X className="ml-1 w-3 h-3" />}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Looking For
              </Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {lookingForOptions.map((item) => (
                  <Badge
                    key={item}
                    variant={lookingFor.includes(item) ? "default" : "outline"}
                    onClick={() => lookingFor.includes(item) ? removeLookingFor(item) : addLookingFor(item)}
                    className="cursor-pointer"
                  >
                    {item}
                    {lookingFor.includes(item) && <X className="ml-1 w-3 h-3" />}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instagram" className="text-right">
                Instagram
              </Label>
              <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="snapchat" className="text-right">
                Snapchat
              </Label>
              <Input id="snapchat" value={snapchat} onChange={(e) => setSnapchat(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Default trigger mode
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn("", className)}>
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Age
            </Label>
            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="major" className="text-right">
              Major
            </Label>
            <Input id="major" value={major} onChange={(e) => setMajor(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dorm" className="text-right">
              Dorm
            </Label>
            <Input id="dorm" value={dorm} onChange={(e) => setDorm(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="bio" className="text-right mt-2">
              Bio
            </Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Interests
            </Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <Badge
                  key={interest}
                  variant={interests.includes(interest) ? "default" : "outline"}
                  onClick={() => interests.includes(interest) ? removeInterest(interest) : addInterest(interest)}
                  className="cursor-pointer"
                >
                  {interest}
                  {interests.includes(interest) && <X className="ml-1 w-3 h-3" />}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Looking For
            </Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {lookingForOptions.map((item) => (
                <Badge
                  key={item}
                  variant={lookingFor.includes(item) ? "default" : "outline"}
                  onClick={() => lookingFor.includes(item) ? removeLookingFor(item) : addLookingFor(item)}
                  className="cursor-pointer"
                >
                  {item}
                  {lookingFor.includes(item) && <X className="ml-1 w-3 h-3" />}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="instagram" className="text-right">
              Instagram
            </Label>
            <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="snapchat" className="text-right">
              Snapchat
            </Label>
            <Input id="snapchat" value={snapchat} onChange={(e) => setSnapchat(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
