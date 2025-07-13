
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSchoolLogo } from "@/utils/schoolLogos";
import { Bell, Search, Menu } from "lucide-react";

interface AppHeaderProps {
  displayUser: any;
  isGuest: boolean;
}

const AppHeader = ({ displayUser, isGuest }: AppHeaderProps) => {
  return (
    <header className="bg-card/95 backdrop-blur-xl border-b border-border/50 flex-shrink-0 z-40 shadow-lg">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-r ${getSchoolLogo(displayUser.college)} rounded-2xl shadow-lg flex items-center justify-center ring-2 ring-primary/20`}>
            <span className="text-white font-bold text-lg">
              {displayUser.college.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-gradient">
              FroshMeet
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              {displayUser.college}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
          </Button>
          <Badge 
            variant="secondary" 
            className="bg-primary/10 text-primary border-0 font-semibold px-3 py-2 text-xs rounded-full shadow-sm"
          >
            {isGuest ? "Guest" : `Class of ${displayUser.classOf}`}
          </Badge>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
