
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  onMessageChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="message">Your message (optional)</Label>
      <Textarea
        id="message"
        placeholder="Share your story, excitement about college, or a fun fact about yourself..."
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        rows={4}
        className="resize-none"
      />
    </div>
  );
};
