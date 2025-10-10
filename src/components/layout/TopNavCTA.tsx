import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import froshIcon from "@/assets/frosh-logo-new.png";

export const TopNavCTA = () => {
  return (
    <Link to="/waitlist">
      <Button 
        variant="outline" 
        className="bg-card/50 border-border/40 hover:bg-card/70 text-foreground hover:text-foreground select-none flex items-center gap-2 px-4 py-2 h-auto"
      >
        <img 
          src={froshIcon} 
          alt="Frosh" 
          className="h-5 w-auto select-none"
        />
        <span className="font-medium">📱 App Coming <span className="text-[#015cd2]">Feb 15</span></span>
      </Button>
    </Link>
  );
};