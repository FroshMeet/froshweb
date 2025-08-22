export interface School {
  id: string;              // kebab-case slug
  name: string;            // official display name
  shortName?: string;      // e.g., "UC Berkeley"
  aliases: string[];       // acronyms, nicknames, common misspellings
}

export const schools: School[] = [
  // Ivy League & Elite Privates
  {
    id: "harvard",
    name: "Harvard University",
    aliases: ["harvard", "hu"]
  },
  {
    id: "upenn", 
    name: "University of Pennsylvania",
    aliases: ["upenn", "u penn", "penn"]
  },
  {
    id: "princeton",
    name: "Princeton University", 
    aliases: ["princeton", "pu"]
  },
  {
    id: "columbia",
    name: "Columbia University",
    aliases: ["columbia", "cu", "columbia u"]
  },
  {
    id: "yale",
    name: "Yale University",
    aliases: ["yale", "yu"]
  },
  {
    id: "cornell",
    name: "Cornell University",
    aliases: ["cornell", "cu"]
  },
  {
    id: "dartmouth",
    name: "Dartmouth College",
    aliases: ["dartmouth"]
  },
  {
    id: "brown",
    name: "Brown University",
    aliases: ["brown"]
  },

  // University of California System
  {
    id: "uc-santa-cruz",
    name: "University of California, Santa Cruz",
    shortName: "UC Santa Cruz",
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
    shortName: "UC San Diego",
    aliases: ["ucsd", "uc san diego", "san diego"]
  },
  {
    id: "uci",
    name: "University of California, Irvine",
    shortName: "UC Irvine", 
    aliases: ["uci", "uc irvine", "irvine"]
  },
  {
    id: "uc-davis",
    name: "University of California, Davis",
    shortName: "UC Davis",
    aliases: ["ucd", "uc davis", "davis"]
  },
  {
    id: "ucsb",
    name: "University of California, Santa Barbara",
    shortName: "UC Santa Barbara",
    aliases: ["ucsb", "uc santa barbara", "santa barbara"]
  },
  {
    id: "uc-merced",
    name: "University of California, Merced",
    shortName: "UC Merced",
    aliases: ["ucm", "uc merced", "merced"]
  },
  {
    id: "uc-riverside",
    name: "University of California, Riverside",
    shortName: "UC Riverside",
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
    aliases: ["stanford", "su"]
  },
  {
    id: "caltech",
    name: "California Institute of Technology",
    aliases: ["caltech"]
  },
  {
    id: "usc",
    name: "University of Southern California",
    aliases: ["usc"]
  },
  {
    id: "sfsu",
    name: "San Francisco State University",
    aliases: ["sfsu", "san francisco state"]
  },
  {
    id: "csulb",
    name: "California State University, Long Beach",
    aliases: ["csulb", "long beach state", "long beach"]
  },
  {
    id: "cal-poly-pomona",
    name: "California State Polytechnic University, Pomona",
    aliases: ["cal poly pomona", "cpp", "pomona"]
  },
  {
    id: "sdsu",
    name: "San Diego State University",
    aliases: ["sdsu", "san diego state"]
  },
  {
    id: "sjsu",
    name: "San José State University",
    aliases: ["sjsu", "san jose state", "san josé state"]
  },
  {
    id: "chico-state",
    name: "California State University, Chico",
    aliases: ["csu chico", "chico state", "chico"]
  },
  {
    id: "cal-poly-slo",
    name: "California Polytechnic State University, San Luis Obispo",
    aliases: ["cal poly", "cal poly slo", "slo", "cpp-slo", "cpslo"]
  },
  {
    id: "csuf",
    name: "California State University, Fullerton",
    aliases: ["csuf", "fullerton"]
  },
  {
    id: "lmu",
    name: "Loyola Marymount University",
    aliases: ["lmu"]
  },

  // California Community Colleges & Regional
  {
    id: "sierra-college",
    name: "Sierra College",
    aliases: ["sierra"]
  },
  {
    id: "folsom-lake-college",
    name: "Folsom Lake College",
    aliases: ["flc", "folsom lake"]
  },
  {
    id: "american-river-college",
    name: "American River College",
    aliases: ["arc", "american river"]
  },
  {
    id: "jessup",
    name: "Jessup University",
    aliases: ["jessup"]
  },
  {
    id: "sac-state",
    name: "Sac State",
    aliases: ["sac state", "csus", "cal state sacramento", "sacramento state"]
  },
  {
    id: "modesto-jc",
    name: "Modesto Junior College",
    aliases: ["mjc", "modesto"]
  },
  {
    id: "yuba-college",
    name: "Yuba College",
    aliases: ["yuba"]
  },
  {
    id: "uop",
    name: "University of the Pacific",
    aliases: ["uop", "pacific"]
  },
  {
    id: "sacramento-city-college",
    name: "Sacramento City College",
    aliases: ["scc", "sacramento city"]
  },
  {
    id: "lake-tahoe-cc",
    name: "Lake Tahoe Community College",
    aliases: ["ltcc", "lake tahoe cc"]
  },

  // Major National Universities
  {
    id: "nyu",
    name: "New York University",
    aliases: ["nyu"]
  },
  {
    id: "fsu",
    name: "Florida State University",
    aliases: ["fsu", "florida state"]
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    aliases: ["mit"]
  },
  {
    id: "duke",
    name: "Duke University",
    aliases: ["duke"]
  },
  {
    id: "uf",
    name: "University of Florida",
    aliases: ["uf", "u florida", "florida"]
  },
  {
    id: "unc",
    name: "University of North Carolina at Chapel Hill",
    aliases: ["unc", "unc-ch", "chapel hill", "unc chapel hill"]
  },
  {
    id: "uva",
    name: "University of Virginia",
    aliases: ["uva"]
  },
  {
    id: "northwestern",
    name: "Northwestern University",
    aliases: ["northwestern", "nu"]
  },
  {
    id: "vanderbilt",
    name: "Vanderbilt University",
    aliases: ["vanderbilt", "vandy"]
  },
  {
    id: "georgetown",
    name: "Georgetown University",
    aliases: ["georgetown", "gtown"]
  },
  {
    id: "bu",
    name: "Boston University",
    aliases: ["bu"]
  },
  {
    id: "umiami",
    name: "University of Miami",
    aliases: ["umiami", "u miami", "miami"]
  },
  {
    id: "psu",
    name: "Pennsylvania State University",
    aliases: ["psu", "penn state"]
  },
  {
    id: "uoft",
    name: "University of Toronto",
    aliases: ["uoft", "u of t", "toronto"]
  },
  {
    id: "uconn",
    name: "University of Connecticut",
    aliases: ["uconn"]
  },
  {
    id: "northeastern",
    name: "Northeastern University",
    aliases: ["northeastern", "neu"]
  },
  {
    id: "uga",
    name: "University of Georgia",
    aliases: ["uga", "georgia"]
  },
  {
    id: "ua",
    name: "University of Alabama",
    aliases: ["ua", "alabama", "bama"]
  },

  // Midwest & More
  {
    id: "uchicago",
    name: "University of Chicago",
    aliases: ["uchicago", "u chicago"]
  },
  {
    id: "umich",
    name: "University of Michigan",
    aliases: ["umich", "u michigan", "michigan"]
  },
  {
    id: "umn",
    name: "University of Minnesota, Twin Cities",
    aliases: ["umn", "umn twin cities", "minnesota", "u of m"]
  },
  {
    id: "ucincinnati",
    name: "University of Cincinnati",
    aliases: ["ucincinnati", "cincinnati", "uc"]
  },
  {
    id: "uiowa",
    name: "University of Iowa",
    aliases: ["uiowa", "u of iowa", "iowa"]
  },
  {
    id: "cu-boulder",
    name: "University of Colorado Boulder",
    aliases: ["cu boulder", "boulder", "colorado boulder"]
  },
  {
    id: "uw-madison",
    name: "University of Wisconsin–Madison",
    aliases: ["uw-madison", "uw madison", "wisconsin", "madison"]
  },
  {
    id: "uiuc",
    name: "University of Illinois Urbana-Champaign",
    aliases: ["uiuc", "illinois", "u of i", "urbana-champaign"]
  },
  {
    id: "purdue",
    name: "Purdue University",
    aliases: ["purdue"]
  },
  {
    id: "msu",
    name: "Michigan State University",
    aliases: ["msu", "michigan state"]
  },
  {
    id: "osu",
    name: "Ohio State University",
    aliases: ["osu", "ohio state"]
  },
  {
    id: "ou",
    name: "University of Oklahoma",
    aliases: ["ou", "oklahoma"]
  },
  {
    id: "cmu",
    name: "Carnegie Mellon University",
    aliases: ["cmu"]
  },
  {
    id: "iu",
    name: "Indiana University Bloomington",
    aliases: ["iu", "iub", "indiana university", "indiana bloomington"]
  },

  // West/South
  {
    id: "asu",
    name: "Arizona State University",
    aliases: ["asu", "arizona state"]
  },
  {
    id: "ut-austin",
    name: "University of Texas at Austin",
    aliases: ["ut austin", "utexas", "ut", "texas"]
  },
  {
    id: "uw",
    name: "University of Washington",
    aliases: ["uw", "u washington", "washington"]
  },
  {
    id: "rice",
    name: "Rice University",
    aliases: ["rice"]
  },
  {
    id: "uarizona",
    name: "University of Arizona",
    aliases: ["ua", "u arizona", "arizona"]
  },
  {
    id: "tamu",
    name: "Texas A&M University",
    aliases: ["tamu", "texas a&m", "a&m", "aggies"]
  },
  {
    id: "uoregon",
    name: "University of Oregon",
    aliases: ["uoregon", "oregon", "uo"]
  },
  {
    id: "ucf",
    name: "University of Central Florida",
    aliases: ["ucf"]
  },
  {
    id: "ole-miss",
    name: "University of Mississippi",
    aliases: ["ole miss", "mississippi"]
  },
  {
    id: "boise-state",
    name: "Boise State University",
    aliases: ["boise state", "bsu"]
  },
  {
    id: "utah",
    name: "University of Utah",
    aliases: ["u of u", "utah"]
  },
  {
    id: "utk",
    name: "University of Tennessee, Knoxville",
    aliases: ["utk", "tennessee", "ut knoxville"]
  },
  {
    id: "uark",
    name: "University of Arkansas",
    aliases: ["uark", "arkansas"]
  },
  {
    id: "virginia-tech",
    name: "Virginia Polytechnic Institute and State University",
    aliases: ["virginia tech", "vt"]
  },
  {
    id: "lsu",
    name: "Louisiana State University",
    aliases: ["lsu"]
  },
  {
    id: "rutgers",
    name: "Rutgers University",
    aliases: ["rutgers"]
  },
  {
    id: "clemson",
    name: "Clemson University",
    aliases: ["clemson"]
  },
  {
    id: "auburn",
    name: "Auburn University",
    aliases: ["auburn"]
  },
  {
    id: "usc-columbia",
    name: "University of South Carolina",
    aliases: ["usc columbia", "south carolina", "uofsc"]
  },
  {
    id: "ttu",
    name: "Texas Tech University",
    aliases: ["ttu", "texas tech"]
  },
  {
    id: "uk",
    name: "University of Kentucky",
    aliases: ["uk", "kentucky"]
  },
  {
    id: "mizzou",
    name: "University of Missouri",
    aliases: ["mizzou", "missouri", "umizzou"]
  },
  {
    id: "unl",
    name: "University of Nebraska–Lincoln",
    aliases: ["unl", "nebraska"]
  },
  {
    id: "pitt",
    name: "University of Pittsburgh",
    aliases: ["pitt", "upitt"]
  },
  {
    id: "kstate",
    name: "Kansas State University",
    aliases: ["k-state", "kstate"]
  },
  {
    id: "jhu",
    name: "Johns Hopkins University",
    aliases: ["jhu", "johns hopkins"]
  },
  {
    id: "wake-forest",
    name: "Wake Forest University",
    aliases: ["wake forest", "wfu"]
  },
  {
    id: "tufts",
    name: "Tufts University",
    aliases: ["tufts"]
  },
  {
    id: "emory",
    name: "Emory University",
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