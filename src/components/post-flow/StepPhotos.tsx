import React from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { StepProps } from './types';

const StepPhotos: React.FC<StepProps> = ({ data, onChange }) => {
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = data.photos.length + files.length;
    if (total > 4) {
      toast.error('Maximum 4 photos allowed');
      return;
    }
    const newPhotos = [...data.photos, ...files];
    const newPreviews = [...data.photoPreviews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newPreviews.push(ev.target?.result as string);
        onChange({ photos: newPhotos, photoPreviews: [...newPreviews] });
      };
      reader.readAsDataURL(file);
    });
    onChange({ photos: newPhotos });
  };

  const removePhoto = (index: number) => {
    onChange({
      photos: data.photos.filter((_, i) => i !== index),
      photoPreviews: data.photoPreviews.filter((_, i) => i !== index),
    });
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newPhotos = [...data.photos];
    const newPreviews = [...data.photoPreviews];
    const [movedPhoto] = newPhotos.splice(dragIndex, 1);
    const [movedPreview] = newPreviews.splice(dragIndex, 1);
    newPhotos.splice(index, 0, movedPhoto);
    newPreviews.splice(index, 0, movedPreview);
    onChange({ photos: newPhotos, photoPreviews: newPreviews });
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  const slots = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">Add your best photos</h2>
        <p className="text-muted-foreground mt-2 text-sm">Upload 1–4 photos. Drag to reorder.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {slots.map((index) => {
          const preview = data.photoPreviews[index];
          if (preview) {
            return (
              <div
                key={index}
                className={`relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-grab border-2 border-border ${
                  dragIndex === index ? 'opacity-50 scale-95' : ''
                } transition-all`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-white drop-shadow-lg" />
                </div>
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Cover
                  </span>
                )}
              </div>
            );
          }
          return (
            <label
              key={index}
              className="aspect-[3/4] rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-card flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:bg-card/80"
            >
              <Plus className="w-8 h-8 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground font-medium">Add Photo</span>
              <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            </label>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground text-center">
        {data.photos.length}/4 photos
        {data.photos.length < 1 && ' — add at least 1'}
      </p>
    </div>
  );
};

export default StepPhotos;
