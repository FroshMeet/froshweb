
import React from "react";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { SCHOOL_DATABASE } from "@/config/schoolDatabase";

interface SchoolSelectorProps {
  selectedSchool: string;
  onSchoolChange: (school: string) => void;
}

export const SchoolSelector: React.FC<SchoolSelectorProps> = ({
  selectedSchool,
  onSchoolChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="school">Select your school</Label>
      <SearchableSelect
        options={SCHOOL_DATABASE}
        value={selectedSchool}
        onValueChange={onSchoolChange}
        placeholder="Search and select your school..."
      />
    </div>
  );
};
