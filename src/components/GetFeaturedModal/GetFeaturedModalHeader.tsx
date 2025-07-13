
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Instagram } from "lucide-react";

export const GetFeaturedModalHeader: React.FC = () => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
          <Instagram className="h-4 w-4 text-white" />
        </div>
        Get Featured on Instagram
      </DialogTitle>
      <DialogDescription>
        Share your story or photo to be featured on your school's FroshMeet Instagram account!
      </DialogDescription>
    </DialogHeader>
  );
};
