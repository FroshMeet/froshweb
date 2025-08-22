
import React from "react";
import { Label } from "@/components/ui/label";
import { SmartSchoolSearch } from "@/components/SmartSchoolSearch";
import { School, schools } from "@/data/schools";

interface SchoolSelectorProps {
  selectedSchool: string;
  onSchoolChange: (school: string) => void;
}

export const SchoolSelector: React.FC<SchoolSelectorProps> = ({
  selectedSchool,
  onSchoolChange,
}) => {
  const selectedSchoolObj = schools.find(s => s.id === selectedSchool) || null;

  const handleSchoolSelect = (school: School) => {
    onSchoolChange(school.id);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="school">Search for your school</Label>
      <SmartSchoolSearch
        onSelect={handleSchoolSelect}
        placeholder="Search schools, cities, or acronyms..."
        selectedSchool={selectedSchoolObj}
        showHelperText
      />
    </div>
  );
};
