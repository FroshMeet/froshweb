
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface OnboardingStep1Props {
  formData: any;
  setFormData: (data: any) => void;
  colleges?: string[];
}

const OnboardingStep1 = ({ formData, setFormData, colleges }: OnboardingStep1Props) => {
  const [collegeSearch, setCollegeSearch] = useState("");

  // Default college list if none provided
  const defaultColleges = [
    "Arizona State University",
    "Boston University",
    "Brown University",
    "Cal Poly Pomona",
    "California Polytechnic State University, San Luis Obispo",
    "Carnegie Mellon University",
    "Chico State (California State University, Chico)",
    "Columbia University",
    "Cornell University",
    "Dartmouth College",
    "Duke University",
    "Florida State University",
    "Georgetown University",
    "Harvard University",
    "Indiana University Bloomington",
    "Massachusetts Institute of Technology (MIT)",
    "Michigan State University",
    "Northeastern University",
    "Northwestern University",
    "Ohio State University",
    "Penn State University (The Pennsylvania State University)",
    "Princeton University",
    "Purdue University",
    "Rice University",
    "Sacramento State University (Sac State)",
    "San Francisco State University (SF State)",
    "San Diego State University (SDSU)",
    "San Jose State University (SJSU)",
    "Stanford University",
    "Texas A&M University",
    "University of Alabama",
    "University of Arizona",
    "University of California, Berkeley",
    "University of California, Davis",
    "University of California, Irvine",
    "University of California, Los Angeles",
    "University of California, Merced",
    "University of California, Riverside",
    "University of California, San Diego",
    "University of California, Santa Barbara",
    "University of California, Santa Cruz",
    "University of Central Florida (UCF)",
    "University of Chicago",
    "University of Colorado Boulder",
    "University of Florida",
    "University of Georgia",
    "University of Illinois Urbana-Champaign",
    "University of Miami",
    "University of Michigan",
    "University of Minnesota",
    "University of North Carolina at Chapel Hill (UNC Chapel Hill)",
    "University of Oregon",
    "University of Pennsylvania (UPenn)",
    "University of Southern California (USC)",
    "University of Texas at Austin",
    "University of Virginia",
    "University of Washington",
    "University of Wisconsin–Madison",
    "Vanderbilt University",
    "Virginia Tech",
    "Yale University"
  ];

  const collegeList = colleges || defaultColleges;

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    
    if (phoneNumber.length <= 3) {
      return `(${phoneNumber}`;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phoneNumber: formatted }));
  };

  const filteredColleges = collegeList.filter(college =>
    college.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter your full name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={formData.age}
          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
          placeholder="18"
          min="16"
          max="25"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="college">College/University</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, college: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select your college" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-white z-50">
            <div className="sticky top-0 bg-white p-2 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search colleges..."
                  value={collegeSearch}
                  onChange={(e) => setCollegeSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <ScrollArea className="h-[250px]">
              {filteredColleges.map((college) => (
                <SelectItem key={college} value={college}>
                  {college}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handlePhoneChange}
          placeholder="(555) 123-4567"
        />
      </div>
    </>
  );
};

export default OnboardingStep1;
