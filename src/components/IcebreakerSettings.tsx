
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

const IcebreakerSettings = () => {
  const [customIcebreakers, setCustomIcebreakers] = useState<string[]>([]);
  const [newIcebreaker, setNewIcebreaker] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('customIcebreakers');
    if (saved) {
      setCustomIcebreakers(JSON.parse(saved));
    }
  }, []);

  const saveIcebreakers = (icebreakers: string[]) => {
    localStorage.setItem('customIcebreakers', JSON.stringify(icebreakers));
    setCustomIcebreakers(icebreakers);
  };

  const addIcebreaker = () => {
    if (newIcebreaker.trim() && !customIcebreakers.includes(newIcebreaker.trim())) {
      const updated = [...customIcebreakers, newIcebreaker.trim()];
      saveIcebreakers(updated);
      setNewIcebreaker("");
    }
  };

  const removeIcebreaker = (index: number) => {
    const updated = customIcebreakers.filter((_, i) => i !== index);
    saveIcebreakers(updated);
  };

  const defaultIcebreakers = [
    "Hey! 👋",
    "Hi there!",
    "Where are you from?",
    "What dorm are you in?",
    "Want to study together?",
    "I saw we have similar interests!"
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Icebreaker Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Default Icebreakers</h4>
            <div className="flex flex-wrap gap-2">
              {defaultIcebreakers.map((icebreaker, index) => (
                <Badge key={index} variant="outline">
                  {icebreaker}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Your Custom Icebreakers</h4>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={newIcebreaker}
                  onChange={(e) => setNewIcebreaker(e.target.value)}
                  placeholder="Add a new icebreaker..."
                  onKeyPress={(e) => e.key === 'Enter' && addIcebreaker()}
                />
                <Button onClick={addIcebreaker}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {customIcebreakers.map((icebreaker, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="text-sm">{icebreaker}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeIcebreaker(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {customIcebreakers.length === 0 && (
                <p className="text-sm text-slate-500">No custom icebreakers yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IcebreakerSettings;
