import { Button } from "@/components/ui/button";
import { Heart, Users, MessageSquare, User, Grid } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, setActiveTab }: BottomNavigationProps) => {
  return (
    <nav className="bg-card/95 backdrop-blur-xl border-t border-border/50 card-shadow z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Button 
            variant={activeTab === "discover" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setActiveTab("discover")} 
            className={`flex flex-col items-center justify-center h-12 w-16 rounded-2xl transition-all duration-200 ${
              activeTab === "discover" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Grid className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Discover</span>
          </Button>
          
          <Button 
            variant={activeTab === "chats" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setActiveTab("chats")} 
            className={`flex flex-col items-center justify-center h-12 w-16 rounded-2xl transition-all duration-200 ${
              activeTab === "chats" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <MessageSquare className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Chats</span>
          </Button>
          
          <Button 
            variant={activeTab === "meet" ? "default" : "ghost"} 
            size="lg" 
            onClick={() => setActiveTab("meet")} 
            className={`flex flex-col items-center justify-center h-14 w-16 rounded-2xl transition-all duration-200 ${
              activeTab === "meet" 
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-110" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Heart className="h-6 w-6 mb-1" />
            <span className="text-xs font-bold">Meet</span>
          </Button>
          
          <Button 
            variant={activeTab === "community" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setActiveTab("community")} 
            className={`flex flex-col items-center justify-center h-12 w-16 rounded-2xl transition-all duration-200 ${
              activeTab === "community" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Feed</span>
          </Button>
          
          <Button 
            variant={activeTab === "profile" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setActiveTab("profile")} 
            className={`flex flex-col items-center justify-center h-12 w-16 rounded-2xl transition-all duration-200 ${
              activeTab === "profile" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;