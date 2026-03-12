export interface PostFormData {
  schoolSlug: string;
  firstName: string;
  lastName: string;
  username: string;
  classYear: string;
  photos: File[];
  photoPreviews: string[];
  bio: string;
  songTitle: string;
  songArtist: string;
  interests: string[];
}

export interface StepProps {
  data: PostFormData;
  onChange: (updates: Partial<PostFormData>) => void;
}
