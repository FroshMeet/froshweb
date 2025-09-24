import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import freshMeatIcon from "@/assets/fresh-meat-app-icon.png";

export const TopNavCTA = () => {
  return (
    <Link to="/app">
      <Button 
        variant="outline" 
        className="bg-card/50 border-border/40 hover:bg-card/70 text-foreground hover:text-foreground select-none flex items-center gap-2 px-4 py-2 h-auto"
      >
        <img 
          src={freshMeatIcon} 
          alt="Fresh Meat" 
          className="w-5 h-5 select-none"
        />
        <span className="font-medium">Fresh Meat 📱 App Coming Feb 15</span>
      </Button>
    </Link>
  );
};