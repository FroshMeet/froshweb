
import { Button } from "@/components/ui/button";
import { Heart, Users, MessageSquare, User, Grid, Sparkles } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, setActiveTab }: BottomNavigationProps) => {
  const navItems = [
    { id: "discover", icon: Grid, label: "Discover" },
    { id: "meet", icon: Heart, label: "Meet" },
    { id: "instagram", icon: Sparkles, label: "Featured" },
    { id: "chats", icon: MessageSquare, label: "Chats" },
    { id: "profile", icon: User, label: "Profile" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-2xl z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <Button 
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setActiveTab(item.id)} 
              className={`flex flex-col items-center justify-center h-14 w-16 rounded-2xl transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-glow scale-110" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
              }`}
            >
              <item.icon className={`h-5 w-5 mb-1 ${activeTab === item.id ? 'animate-bounce-subtle' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
