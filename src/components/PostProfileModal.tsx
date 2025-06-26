
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface PostProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (photos: string[], inMeet: boolean, inDiscover: boolean) => void;
  currentPhotos?: string[];
}

const PostProfileModal = ({ isOpen, onClose, onPost, currentPhotos = [] }: PostProfileModalProps) => {
  const [photos, setPhotos] = useState<string[]>(currentPhotos);
  const [inMeet, setInMeet] = useState(false);
  const [inDiscover, setInDiscover] = useState(false);

  // Mock photo IDs for demonstration
  const mockPhotoIds = [
    "photo-1581091226825-a6a2a5aee158",
    "photo-1581092795360-fd1ca04f0952",
    "photo-1649972904349-6e44c42644a7",
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1494790108755-2616c9ff4de1",
    "photo-1535713875002-d1d0cf377fde",
    "photo-1472099645785-5658abf4ff4e",
    "photo-1517841905240-472988babdf9",
    "photo-1544005313-94ddf0286df2",
    "photo-1506794778202-cad84cf45f1d"
  ];

  const addPhoto = () => {
    if (photos.length < 10) {
      const randomPhotoId = mockPhotoIds[Math.floor(Math.random() * mockPhotoIds.length)];
      setPhotos([...photos, randomPhotoId]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const movePhoto = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);
    setPhotos(newPhotos);
  };

  const handlePost = () => {
    if (photos.length >= 3) {
      onPost(photos, inMeet, inDiscover);
    }
  };

  const getUnsplashUrl = (photoId: string) => {
    return `https://images.unsplash.com/${photoId}?w=150&h=150&fit=crop&crop=face`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Post Your Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo Upload Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Add Photos (3-10 required)</h3>
            <div className="grid grid-cols-3 gap-4">
              {photos.map((photoId, index) => (
                <Card key={index} className="relative group">
                  <CardContent className="p-2">
                    <img
                      src={getUnsplashUrl(photoId)}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
                        Cover
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {photos.length < 10 && (
                <Card className="border-dashed border-2 border-slate-300 hover:border-slate-400 transition-colors cursor-pointer" onClick={addPhoto}>
                  <CardContent className="p-2 h-24 flex flex-col items-center justify-center">
                    <Upload className="h-6 w-6 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-500">Add Photo</span>
                  </CardContent>
                </Card>
              )}
            </div>
            <p className="text-sm text-slate-600 mt-2">
              First photo will be your cover photo. You have {photos.length}/10 photos.
            </p>
          </div>

          {/* Posting Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Where to post?</h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="meet-toggle"
                checked={inMeet}
                onCheckedChange={setInMeet}
              />
              <Label htmlFor="meet-toggle" className="text-base">Include in Meet</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="discover-toggle"
                checked={inDiscover}
                onCheckedChange={setInDiscover}
              />
              <Label htmlFor="discover-toggle" className="text-base">Include in Discover</Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePost}
              disabled={photos.length < 3}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Post Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostProfileModal;
