
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, User } from "lucide-react";

interface PostProfileButtonProps {
  user: any;
  onPost: () => void;
}

const PostProfileButton = ({ user, onPost }: PostProfileButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePost = () => {
    onPost();
    setIsOpen(false);
  };

  const canPost = user?.photos && user.photos.length >= 3 && user.photos.length <= 10;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Upload className="h-4 w-4 mr-2" />
          Post Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post Your Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            {user?.photos?.[0] ? (
              <img
                src={`https://images.unsplash.com/${user.photos[0]}?w=200&h=200&fit=crop&crop=face`}
                alt="Profile preview"
                className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <User className="h-8 w-8 text-slate-400" />
              </div>
            )}
            <h3 className="text-lg font-semibold">{user?.name}</h3>
            <p className="text-sm text-muted-foreground">{user?.major}</p>
          </div>

          {canPost ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Your profile will be visible in the Meet and Discover sections for other students to find and connect with you.
              </p>
              <div className="flex gap-2">
                <Button onClick={handlePost} className="flex-1">
                  Post Profile
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                You need 3-10 photos to post your profile. Go to Edit Profile to add more photos.
              </p>
              <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostProfileButton;
