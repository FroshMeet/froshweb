
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send } from "lucide-react";

interface IcebreakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  targetName?: string;
  isGuest?: boolean;
  onGuestAction?: () => void;
}

const IcebreakerModal = ({ 
  isOpen, 
  onClose, 
  onSendMessage, 
  targetName, 
  isGuest = false, 
  onGuestAction 
}: IcebreakerModalProps) => {
  const [customMessage, setCustomMessage] = useState("");
  
  // Default icebreakers - in a real app, these would come from settings
  const defaultIcebreakers = [
    "Hey! 👋",
    "Hi there!",
    "Where are you from?",
    "What dorm are you in?",
    "Want to study together?",
    "I saw we have similar interests!"
  ];

  // Custom icebreakers - in a real app, these would be fetched from user settings
  const customIcebreakers = JSON.parse(localStorage.getItem('customIcebreakers') || '[]');
  
  const allIcebreakers = [...defaultIcebreakers, ...customIcebreakers];

  const handleSendIcebreaker = (message: string) => {
    if (isGuest && onGuestAction) {
      onGuestAction();
      return;
    }
    onSendMessage(message);
    onClose();
  };

  const handleSendCustom = () => {
    if (customMessage.trim()) {
      handleSendIcebreaker(customMessage);
      setCustomMessage("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Message {targetName || "this person"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="recommended" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommended">Recommended Messages</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="mt-4">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allIcebreakers.map((icebreaker, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleSendIcebreaker(icebreaker)}
                  className="w-full text-left justify-start h-auto p-3"
                >
                  {icebreaker}
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="mt-4">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendCustom()}
                />
                <Button onClick={handleSendCustom}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isGuest && (
          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg text-center">
            Create an account to send messages
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IcebreakerModal;
