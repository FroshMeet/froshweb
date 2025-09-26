export interface School {
  id: string;              // kebab-case slug
  name: string;            // official display name
  shortName?: string;      // e.g., "UC Berkeley"
  aliases: string[];       // acronyms, nicknames, common misspellings
}

export const schools: School[] = [
  // Ivy League
  {
    id: "harvard",
    name: "Harvard University",
    shortName: "Harvard",
    aliases: ["harvard", "hu"]
  },
  {
    id: "upenn", 
    name: "University of Pennsylvania",
    shortName: "UPenn",
    aliases: ["upenn", "u penn", "penn"]
  },
  {
    id: "princeton",
    name: "Princeton University", 
    shortName: "Princeton",
    aliases: ["princeton", "pu"]
  },
  {
    id: "columbia",
    name: "Columbia University",
    shortName: "Columbia",
    aliases: ["columbia", "cu", "columbia u"]
  },
  {
    id: "yale",
    name: "Yale University",
    shortName: "Yale",
    aliases: ["yale", "yu"]
  },
  {
    id: "cornell",
    name: "Cornell University",
    shortName: "Cornell",
    aliases: ["cornell", "cu"]
  },
  {
    id: "dartmouth",
    name: "Dartmouth College",
    shortName: "Dartmouth",
    aliases: ["dartmouth"]
  },
  {
    id: "brown",
    name: "Brown University",
    shortName: "Brown",
    aliases: ["brown"]
  },

  // University of California
  {
    id: "uc-santa-cruz",
    name: "University of California, Santa Cruz",
    shortName: "UCSC",
    aliases: ["ucsc", "uc santa cruz", "santa cruz"]
  },
  {
    id: "uc-berkeley",
    name: "University of California, Berkeley",
    shortName: "UC Berkeley",
    aliases: ["ucb", "berkeley", "cal", "uc berkeley"]
  },
  {
    id: "ucsd",
    name: "University of California, San Diego", 
    shortName: "UCSD",
    aliases: ["ucsd", "uc san diego", "san diego"]
  },
  {
    id: "uci",
    name: "University of California, Irvine",
    shortName: "UCI", 
    aliases: ["uci", "uc irvine", "irvine"]
  },
  {
    id: "uc-davis",
    name: "University of California, Davis",
    shortName: "UCD",
    aliases: ["ucd", "uc davis", "davis"]
  },
  {
    id: "ucsb",
    name: "University of California, Santa Barbara",
    shortName: "UCSB",
    aliases: ["ucsb", "uc santa barbara", "santa barbara"]
  },
  {
    id: "uc-merced",
    name: "University of California, Merced",
    shortName: "UCM",
    aliases: ["ucm", "uc merced", "merced"]
  },
  {
    id: "uc-riverside",
    name: "University of California, Riverside",
    shortName: "UCR",
    aliases: ["ucr", "uc riverside", "riverside"]
  },
  {
    id: "ucla",
    name: "University of California, Los Angeles",
    shortName: "UCLA",
    aliases: ["ucla", "uc los angeles", "los angeles"]
  },

  // California Privates & CSU
  {
    id: "stanford",
    name: "Stanford University",
    shortName: "Stanford",
    aliases: ["stanford", "su"]
  },
  {
    id: "caltech",
    name: "California Institute of Technology",
    shortName: "Caltech",
    aliases: ["caltech"]
  },
  {
    id: "usc",
    name: "University of Southern California",
    shortName: "USC",
    aliases: ["usc"]
  },
  {
    id: "sfsu",
    name: "San Francisco State University",
    shortName: "SFSU",
    aliases: ["sfsu", "san francisco state"]
  },
  {
    id: "csulb",
    name: "California State University, Long Beach",
    shortName: "CSULB",
    aliases: ["csulb", "long beach state", "long beach"]
  },
  {
    id: "cal-poly-pomona",
    name: "California State Polytechnic University, Pomona",
    shortName: "Cal Poly Pomona",
    aliases: ["cal poly pomona", "cpp", "pomona"]
  },
  {
    id: "sdsu",
    name: "San Diego State University",
    shortName: "SDSU",
    aliases: ["sdsu", "san diego state"]
  },
  {
    id: "sjsu",
    name: "San José State University",
    shortName: "SJSU",
    aliases: ["sjsu", "san jose state", "san josé state"]
  },
  {
    id: "chico-state",
    name: "California State University, Chico",
    shortName: "Chico State",
    aliases: ["csu chico", "chico state", "chico"]
  },
  {
    id: "cal-poly-slo",
    name: "California Polytechnic State University, San Luis Obispo",
    shortName: "Cal Poly SLO",
    aliases: ["cal poly", "cal poly slo", "slo", "cpp-slo", "cpslo"]
  },
  {
    id: "csuf",
    name: "California State University, Fullerton",
    shortName: "Fullerton",
    aliases: ["csuf", "fullerton"]
  },
  {
    id: "lmu",
    name: "Loyola Marymount University",
    shortName: "LMU",
    aliases: ["lmu"]
  },

  // NorCal Colleges
  {
    id: "sierra-college",
    name: "Sierra College",
    shortName: "Sierra",
    aliases: ["sierra"]
  },
  {
    id: "folsom-lake-college",
    name: "Folsom Lake College",
    shortName: "FLC",
    aliases: ["flc", "folsom lake"]
  },
  {
    id: "american-river-college",
    name: "American River College",
    shortName: "ARC",
    aliases: ["arc", "american river"]
  },
  {
    id: "jessup",
    name: "Jessup University",
    shortName: "Jessup",
    aliases: ["jessup"]
  },
  {
    id: "sac-state",
    name: "Sacramento State",
    shortName: "Sac State",
    aliases: ["sac state", "csus", "cal state sacramento", "sacramento state"]
  },
  {
    id: "modesto-jc",
    name: "Modesto Junior College",
    shortName: "MJC",
    aliases: ["mjc", "modesto"]
  },
  {
    id: "yuba-college",
    name: "Yuba College",
    shortName: "Yuba",
    aliases: ["yuba"]
  },
  {
    id: "uop",
    name: "University of the Pacific",
    shortName: "UOP",
    aliases: ["uop", "pacific"]
  },
  {
    id: "sacramento-city-college",
    name: "Sacramento City College",
    shortName: "SCC",
    aliases: ["scc", "sacramento city"]
  },
  {
    id: "lake-tahoe-cc",
    name: "Lake Tahoe Community College",
    shortName: "Tahoe",
    aliases: ["ltcc", "lake tahoe cc"]
  },

  // Other Major U.S. & Canadian Universities
  {
    id: "nyu",
    name: "New York University",
    shortName: "NYU",
    aliases: ["nyu"]
  },
  {
    id: "fsu",
    name: "Florida State University",
    shortName: "FSU",
    aliases: ["fsu", "florida state"]
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    shortName: "MIT",
    aliases: ["mit"]
  },
  {
    id: "duke",
    name: "Duke University",
    shortName: "Duke",
    aliases: ["duke"]
  },
  {
    id: "uf",
    name: "University of Florida",
    shortName: "UF",
    aliases: ["uf", "u florida", "florida"]
  },
  {
    id: "unc",
    name: "University of North Carolina at Chapel Hill",
    shortName: "UNC",
    aliases: ["unc", "unc-ch", "chapel hill", "unc chapel hill"]
  },
  {
    id: "uva",
    name: "University of Virginia",
    shortName: "UVA",
    aliases: ["uva"]
  },
  {
    id: "northwestern",
    name: "Northwestern University",
    shortName: "Northwestern",
    aliases: ["northwestern", "nu"]
  },
  {
    id: "vanderbilt",
    name: "Vanderbilt University",
    shortName: "Vanderbilt",
    aliases: ["vanderbilt", "vandy"]
  },
  {
    id: "georgetown",
    name: "Georgetown University",
    shortName: "Georgetown",
    aliases: ["georgetown", "gtown"]
  },
  {
    id: "bu",
    name: "Boston University",
    shortName: "BU",
    aliases: ["bu"]
  },
  {
    id: "umiami",
    name: "University of Miami",
    shortName: "UMiami / The U",
    aliases: ["umiami", "u miami", "miami"]
  },
  {
    id: "psu",
    name: "Pennsylvania State University",
    shortName: "Penn State",
    aliases: ["psu", "penn state"]
  },
  {
    id: "uoft",
    name: "University of Toronto",
    shortName: "UofT",
    aliases: ["uoft", "u of t", "toronto"]
  },
  {
    id: "uconn",
    name: "University of Connecticut",
    shortName: "UConn",
    aliases: ["uconn"]
  },
  {
    id: "northeastern",
    name: "Northeastern University",
    shortName: "Northeastern / NEU",
    aliases: ["northeastern", "neu"]
  },
  {
    id: "uga",
    name: "University of Georgia",
    shortName: "UGA",
    aliases: ["uga", "georgia"]
  },
  {
    id: "ua",
    name: "University of Alabama",
    shortName: "Alabama / Bama",
    aliases: ["ua", "alabama", "bama"]
  },

  // Big Ten & Midwest
  {
    id: "uchicago",
    name: "University of Chicago",
    shortName: "UChicago",
    aliases: ["uchicago", "u chicago"]
  },
  {
    id: "umich",
    name: "University of Michigan",
    shortName: "UMich / Michigan",
    aliases: ["umich", "u michigan", "michigan"]
  },
  {
    id: "umn",
    name: "University of Minnesota, Twin Cities",
    shortName: "UMN / Minnesota",
    aliases: ["umn", "umn twin cities", "minnesota", "u of m"]
  },
  {
    id: "ucincinnati",
    name: "University of Cincinnati",
    shortName: "UC / Cincinnati",
    aliases: ["ucincinnati", "cincinnati", "uc"]
  },
  {
    id: "uiowa",
    name: "University of Iowa",
    shortName: "UIowa / Iowa",
    aliases: ["uiowa", "u of iowa", "iowa"]
  },
  {
    id: "cu-boulder",
    name: "University of Colorado Boulder",
    shortName: "CU Boulder",
    aliases: ["cu boulder", "boulder", "colorado boulder"]
  },
  {
    id: "uw-madison",
    name: "University of Wisconsin–Madison",
    shortName: "UW–Madison / Wisconsin",
    aliases: ["uw-madison", "uw madison", "wisconsin", "madison"]
  },
  {
    id: "uiuc",
    name: "University of Illinois Urbana-Champaign",
    shortName: "UIUC / Illinois",
    aliases: ["uiuc", "illinois", "u of i", "urbana-champaign"]
  },
  {
    id: "purdue",
    name: "Purdue University",
    shortName: "Purdue",
    aliases: ["purdue"]
  },
  {
    id: "msu",
    name: "Michigan State University",
    shortName: "MSU",
    aliases: ["msu", "michigan state"]
  },
  {
    id: "osu",
    name: "Ohio State University",
    shortName: "OSU / Ohio State",
    aliases: ["osu", "ohio state"]
  },
  {
    id: "ou",
    name: "University of Oklahoma",
    shortName: "OU",
    aliases: ["ou", "oklahoma"]
  },
  {
    id: "cmu",
    name: "Carnegie Mellon University",
    shortName: "CMU",
    aliases: ["cmu"]
  },
  {
    id: "iu",
    name: "Indiana University Bloomington",
    shortName: "IU / Indiana",
    aliases: ["iu", "iub", "indiana university", "indiana bloomington"]
  },

  // South & West
  {
    id: "asu",
    name: "Arizona State University",
    shortName: "ASU",
    aliases: ["asu", "arizona state"]
  },
  {
    id: "ut-austin",
    name: "University of Texas at Austin",
    shortName: "UT Austin / Texas",
    aliases: ["ut austin", "utexas", "ut", "texas"]
  },
  {
    id: "uw",
    name: "University of Washington",
    shortName: "UW",
    aliases: ["uw", "u washington", "washington"]
  },
  {
    id: "rice",
    name: "Rice University",
    shortName: "Rice",
    aliases: ["rice"]
  },
  {
    id: "uarizona",
    name: "University of Arizona",
    shortName: "UArizona / Arizona",
    aliases: ["ua", "u arizona", "arizona"]
  },
  {
    id: "tamu",
    name: "Texas A&M University",
    shortName: "Texas A&M / A&M",
    aliases: ["tamu", "texas a&m", "a&m", "aggies"]
  },
  {
    id: "uoregon",
    name: "University of Oregon",
    shortName: "UO / Oregon",
    aliases: ["uoregon", "oregon", "uo"]
  },
  {
    id: "ucf",
    name: "University of Central Florida",
    shortName: "UCF",
    aliases: ["ucf"]
  },
  {
    id: "ole-miss",
    name: "University of Mississippi",
    shortName: "Ole Miss",
    aliases: ["ole miss", "mississippi"]
  },
  {
    id: "boise-state",
    name: "Boise State University",
    shortName: "Boise State",
    aliases: ["boise state", "bsu"]
  },
  {
    id: "utah",
    name: "University of Utah",
    shortName: "Utah",
    aliases: ["u of u", "utah"]
  },
  {
    id: "utk",
    name: "University of Tennessee, Knoxville",
    shortName: "UTK / Tennessee",
    aliases: ["utk", "tennessee", "ut knoxville"]
  },
  {
    id: "uark",
    name: "University of Arkansas",
    shortName: "Arkansas",
    aliases: ["uark", "arkansas"]
  },
  {
    id: "virginia-tech",
    name: "Virginia Polytechnic Institute and State University",
    shortName: "Virginia Tech",
    aliases: ["virginia tech", "vt"]
  },
  {
    id: "lsu",
    name: "Louisiana State University",
    shortName: "LSU",
    aliases: ["lsu"]
  },
  {
    id: "rutgers",
    name: "Rutgers University",
    shortName: "Rutgers",
    aliases: ["rutgers"]
  },
  {
    id: "clemson",
    name: "Clemson University",
    shortName: "Clemson",
    aliases: ["clemson"]
  },
  {
    id: "auburn",
    name: "Auburn University",
    shortName: "Auburn",
    aliases: ["auburn"]
  },
  {
    id: "usc-columbia",
    name: "University of South Carolina",
    shortName: "UofSC",
    aliases: ["usc columbia", "south carolina", "uofsc"]
  },
  {
    id: "ttu",
    name: "Texas Tech University",
    shortName: "Texas Tech",
    aliases: ["ttu", "texas tech"]
  },
  {
    id: "uk",
    name: "University of Kentucky",
    shortName: "UK",
    aliases: ["uk", "kentucky"]
  },
  {
    id: "mizzou",
    name: "University of Missouri",
    shortName: "Mizzou",
    aliases: ["mizzou", "missouri", "umizzou"]
  },
  {
    id: "unl",
    name: "University of Nebraska–Lincoln",
    shortName: "UNL / Nebraska",
    aliases: ["unl", "nebraska"]
  },
  {
    id: "pitt",
    name: "University of Pittsburgh",
    shortName: "Pitt",
    aliases: ["pitt", "upitt"]
  },
  {
    id: "kstate",
    name: "Kansas State University",
    shortName: "K-State",
    aliases: ["k-state", "kstate"]
  },
  {
    id: "jhu",
    name: "Johns Hopkins University",
    shortName: "Hopkins",
    aliases: ["jhu", "johns hopkins"]
  },
  {
    id: "wake-forest",
    name: "Wake Forest University",
    shortName: "Wake Forest",
    aliases: ["wake forest", "wfu"]
  },
  {
    id: "tufts",
    name: "Tufts University",
    shortName: "Tufts",
    aliases: ["tufts"]
  },
  {
    id: "emory",
    name: "Emory University",
    shortName: "Emory",
    aliases: ["emory", "eu"]
  }
];

// UC campuses in priority order for "uc" search
export const UC_CAMPUSES = [
  "uc-berkeley",
  "ucla", 
  "ucsd",
  "ucsb",
  "uci",
  "uc-davis",
  "uc-santa-cruz",
  "uc-riverside", 
  "uc-merced"
];