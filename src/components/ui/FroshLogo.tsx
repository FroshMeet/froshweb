import React from "react";
import froshLogo from "@/assets/frosh-logo-new.png";
import { cn } from "@/lib/utils";

interface FroshLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  withBorder?: boolean;
}

const sizeClasses = {
  sm: "h-10 w-auto",
  md: "h-16 w-auto",
  lg: "h-20 w-auto",
  xl: "h-24 md:h-32 w-auto",
};

const FroshLogo = ({ 
  size = "md", 
  className, 
  onClick,
  withBorder = true 
}: FroshLogoProps) => {
  return (
    <img 
      src={froshLogo}
      alt="Frosh Logo" 
      width="64"
      height="64"
      className={cn(
        sizeClasses[size],
        withBorder && "border border-froshmeet-blue/50 rounded-lg",
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
    />
  );
};

export default FroshLogo;
