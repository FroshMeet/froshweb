
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
    "ASU - Arizona State University",
    "BU - Boston University", 
    "Brown - Brown University",
    "Cal Poly Pomona - California State Polytechnic University, Pomona",
    "Caltech - California Institute of Technology",
    "Cal Poly SLO - California Polytechnic State University, San Luis Obispo",
    "CSULB - California State University, Long Beach",
    "CMU - Carnegie Mellon University",
    "Chico State - California State University, Chico",
    "Columbia - Columbia University",
    "Cornell - Cornell University",
    "Dartmouth - Dartmouth College",
    "Duke - Duke University",
    "FSU - Florida State University",
    "Georgetown - Georgetown University",
    "Harvard - Harvard University",
    "IU Bloomington - Indiana University Bloomington",
    "MIT - Massachusetts Institute of Technology",
    "Michigan State - Michigan State University",
    "NYU - New York University",
    "Northeastern - Northeastern University",
    "Northwestern - Northwestern University",
    "Ohio State - Ohio State University",
    "Penn State - Pennsylvania State University",
    "Princeton - Princeton University",
    "Purdue - Purdue University",
    "Rice - Rice University",
    "Sac State - California State University, Sacramento",
    "SF State - San Francisco State University",
    "SDSU - San Diego State University",
    "SJSU - San Jose State University",
    "Stanford - Stanford University",
    "Texas A&M - Texas A&M University",
    "UA - University of Alabama",
    "UArizona - University of Arizona",
    "UC Berkeley - University of California, Berkeley",
    "UC Davis - University of California, Davis",
    "UC Irvine - University of California, Irvine",
    "UCLA - University of California, Los Angeles",
    "UC Merced - University of California, Merced",
    "UC Riverside - University of California, Riverside",
    "UCSD - University of California, San Diego",
    "UC Santa Barbara - University of California, Santa Barbara",
    "UC Santa Cruz - University of California, Santa Cruz",
    "UCF - University of Central Florida",
    "UChicago - University of Chicago",
    "CU Boulder - University of Colorado Boulder",
    "UF - University of Florida",
    "UGA - University of Georgia",
    "UIUC - University of Illinois Urbana-Champaign",
    "UMiami - University of Miami",
    "UMich - University of Michigan",
    "UMN - University of Minnesota",
    "UNC Chapel Hill - University of North Carolina at Chapel Hill",
    "UOregon - University of Oregon",
    "UPenn - University of Pennsylvania",
    "USC - University of Southern California",
    "UT Austin - University of Texas at Austin",
    "UVA - University of Virginia",
    "UW - University of Washington",
    "UW-Madison - University of Wisconsin–Madison",
    "Vanderbilt - Vanderbilt University",
    "Virginia Tech - Virginia Polytechnic Institute and State University",
    "Yale - Yale University"
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
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, college: value }))} value={formData.college || ""}>
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
                  onKeyDown={(e) => e.stopPropagation()}
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
