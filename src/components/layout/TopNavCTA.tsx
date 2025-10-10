import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const TopNavCTA = () => {
  return (
    <Link to="/waitlist">
      <Button 
        variant="outline" 
        className="bg-card/50 border-border/40 hover:bg-card/70 text-foreground hover:text-foreground select-none px-4 py-2 h-auto"
      >
        <span className="font-medium">📱 App Coming <span className="text-[#015cd2]">Feb 15</span></span>
      </Button>
    </Link>
  );
};