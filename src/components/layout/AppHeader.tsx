import { Badge } from "@/components/ui/badge";
import { getSchoolLogo } from "@/utils/schoolLogos";

interface AppHeaderProps {
  displayUser: any;
  isGuest: boolean;
}

const AppHeader = ({ displayUser, isGuest }: AppHeaderProps) => {
  return (
    <header className="bg-card/95 backdrop-blur-xl border-b border-border/50 flex-shrink-0 z-40 card-shadow">
      <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-r ${getSchoolLogo(displayUser.college)} rounded-2xl shadow-lg flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">
              {displayUser.college.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">
              Frosh
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              {displayUser.college}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-semibold px-3 py-1.5 text-xs rounded-full">
          {isGuest ? "Guest" : `Class of ${displayUser.classOf}`}
        </Badge>
      </div>
    </header>
  );
};

export default AppHeader;