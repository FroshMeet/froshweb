
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  photo: File | null;
  onPhotoUpload: (photo: File | null) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photo,
  onPhotoUpload,
}) => {
  const { toast } = useToast();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select a photo under 5MB",
          variant: "destructive",
        });
        return;
      }
      onPhotoUpload(file);
    }
  };

  const removePhoto = () => {
    onPhotoUpload(null);
  };

  return (
    <div className="space-y-2">
      <Label>Upload a photo (optional)</Label>
      {photo ? (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">{photo.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(photo.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removePhoto}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="border-dashed border-2 p-6">
          <div className="text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Click to upload a photo
            </p>
            <p className="text-xs text-muted-foreground">
              Max 5MB • JPG, PNG, GIF
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="mt-3"
            />
          </div>
        </Card>
      )}
    </div>
  );
};
