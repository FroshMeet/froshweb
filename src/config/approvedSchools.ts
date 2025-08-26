import { SCHOOL_DISPLAY_MAPPING } from './schoolDisplayMapping';
import { SCHOOL_INSTAGRAM_MAPPING } from './schoolInstagramMapping';
import { SCHOOL_NAME_MAPPING } from './schoolNameMapping';

// Approved school slugs with their full data
export interface ApprovedSchool {
  name: string;
  displayName: string;
  instagramUsername: string;
}

export const APPROVED_SCHOOLS: Record<string, ApprovedSchool> = {
  // Ivy League
  'harvard': {
    name: 'Harvard University',
    displayName: 'Harvard',
    instagramUsername: 'harvard2030class'
  },
  'upenn': {
    name: 'University of Pennsylvania',
    displayName: 'UPenn',
    instagramUsername: 'upenn2030class'
  },
  'princeton': {
    name: 'Princeton University',
    displayName: 'Princeton',
    instagramUsername: 'princeton2030class'
  },
  'columbia': {
    name: 'Columbia University',
    displayName: 'Columbia',
    instagramUsername: 'columbia2030meet'
  },
  'yale': {
    name: 'Yale University',
    displayName: 'Yale',
    instagramUsername: 'yale2030class'
  },
  'cornell': {
    name: 'Cornell University',
    displayName: 'Cornell',
    instagramUsername: 'cornell2030meet'
  },
  'dartmouth': {
    name: 'Dartmouth College',
    displayName: 'Dartmouth',
    instagramUsername: 'dartmouth2030'
  },
  'brown': {
    name: 'Brown University',
    displayName: 'Brown',
    instagramUsername: 'brown2030meet'
  },

  // UC System
  'ucsc': {
    name: 'University of California, Santa Cruz',
    displayName: 'UCSC',
    instagramUsername: 'ucsc2030class'
  },
  'ucberkeley': {
    name: 'University of California, Berkeley',
    displayName: 'UC Berkeley / Cal',
    instagramUsername: 'berkeley2030meet'
  },
  'ucsd': {
    name: 'University of California, San Diego',
    displayName: 'UCSD',
    instagramUsername: 'ucsd2030meet'
  },
  'uci': {
    name: 'University of California, Irvine',
    displayName: 'UCI',
    instagramUsername: 'uci2030meet'
  },
  'ucdavis': {
    name: 'University of California, Davis',
    displayName: 'UCD',
    instagramUsername: 'ucdavis2030meet'
  },
  'ucsb': {
    name: 'University of California, Santa Barbara',
    displayName: 'UCSB',
    instagramUsername: 'ucsb2030class'
  },
  'ucmerced': {
    name: 'University of California, Merced',
    displayName: 'UCM',
    instagramUsername: 'ucmerced2030'
  },
  'ucr': {
    name: 'University of California, Riverside',
    displayName: 'UCR',
    instagramUsername: 'ucr2030meet'
  },
  'ucla': {
    name: 'University of California, Los Angeles',
    displayName: 'UCLA',
    instagramUsername: 'ucla2030meet'
  },

  // California Privates & CSU System
  'stanford': {
    name: 'Stanford University',
    displayName: 'Stanford',
    instagramUsername: 'stanford2030class'
  },
  'caltech': {
    name: 'California Institute of Technology',
    displayName: 'Caltech',
    instagramUsername: 'caltech2030'
  },
  'usc': {
    name: 'University of Southern California',
    displayName: 'USC',
    instagramUsername: 'usc2030meet'
  },
  'sfsu': {
    name: 'San Francisco State University',
    displayName: 'SFSU',
    instagramUsername: 'sfsu2030class'
  },
  'csulb': {
    name: 'California State University, Long Beach',
    displayName: 'CSULB / Long Beach State',
    instagramUsername: 'csulb2030class'
  },
  'cpp': {
    name: 'California State Polytechnic University, Pomona',
    displayName: 'Cal Poly Pomona',
    instagramUsername: 'cpp2030class'
  },
  'sdsu': {
    name: 'San Diego State University',
    displayName: 'SDSU',
    instagramUsername: 'sdsu2030.fm'
  },
  'sjsu': {
    name: 'San José State University',
    displayName: 'SJSU',
    instagramUsername: 'sjsu2030meet'
  },
  'csuchico': {
    name: 'California State University, Chico',
    displayName: 'Chico State',
    instagramUsername: 'csuchico2030'
  },
  'calpolyslo': {
    name: 'California Polytechnic State University, San Luis Obispo',
    displayName: 'Cal Poly SLO',
    instagramUsername: 'calpolyslo2030meet'
  },
  'csuf': {
    name: 'California State University, Fullerton',
    displayName: 'CSUF / Fullerton',
    instagramUsername: 'csuf2030class'
  },
  'lmu': {
    name: 'Loyola Marymount University',
    displayName: 'LMU',
    instagramUsername: 'lmu2030meet'
  },

  // NorCal Colleges
  'sierra': {
    name: 'Sierra College',
    displayName: 'Sierra',
    instagramUsername: 'sierra2030class'
  },
  'flc': {
    name: 'Folsom Lake College',
    displayName: 'FLC',
    instagramUsername: 'flc2030'
  },
  'arc': {
    name: 'American River College',
    displayName: 'ARC',
    instagramUsername: 'arc2030class'
  },
  'jessup': {
    name: 'Jessup University',
    displayName: 'Jessup',
    instagramUsername: 'jessup2030'
  },
  'sacstate': {
    name: 'Sacramento State',
    displayName: 'Sac State',
    instagramUsername: 'sacstate2030'
  },
  'mjc': {
    name: 'Modesto Junior College',
    displayName: 'MJC',
    instagramUsername: 'modesto2030class'
  },
  'yuba': {
    name: 'Yuba College',
    displayName: 'Yuba',
    instagramUsername: 'yuba2030class'
  },
  'pacific': {
    name: 'University of the Pacific',
    displayName: 'UOP / Pacific',
    instagramUsername: 'uop2030class'
  },
  'scc': {
    name: 'Sacramento City College',
    displayName: 'SCC',
    instagramUsername: 'sacramento2030class'
  },
  'ltcc': {
    name: 'Lake Tahoe Community College',
    displayName: 'LTCC',
    instagramUsername: 'laketahoe2030'
  },

  // Other US & Canada Universities
  'nyu': {
    name: 'New York University',
    displayName: 'NYU',
    instagramUsername: 'nyu2030meet'
  },
  'fsu': {
    name: 'Florida State University',
    displayName: 'FSU',
    instagramUsername: 'fsu2030meet'
  },
  'mit': {
    name: 'Massachusetts Institute of Technology',
    displayName: 'MIT',
    instagramUsername: 'mit2030class'
  },
  'duke': {
    name: 'Duke University',
    displayName: 'Duke',
    instagramUsername: 'duke2030meet'
  },
  'ufl': {
    name: 'University of Florida',
    displayName: 'UF',
    instagramUsername: 'usf2030class'
  },
  'unc': {
    name: 'University of North Carolina at Chapel Hill',
    displayName: 'UNC / UNC-Chapel Hill',
    instagramUsername: 'unc2030fm'
  },
  'uva': {
    name: 'University of Virginia',
    displayName: 'UVA',
    instagramUsername: 'uva2030meet'
  },
  'northwestern': {
    name: 'Northwestern University',
    displayName: 'Northwestern',
    instagramUsername: 'northwestern2030'
  },
  'vanderbilt': {
    name: 'Vanderbilt University',
    displayName: 'Vanderbilt',
    instagramUsername: 'vanderbilt2030'
  },
  'georgetown': {
    name: 'Georgetown University',
    displayName: 'Georgetown',
    instagramUsername: 'georgetown2030meet'
  },
  'bu': {
    name: 'Boston University',
    displayName: 'BU',
    instagramUsername: 'bu2030meet'
  },
  'miami': {
    name: 'University of Miami',
    displayName: 'UMiami / The U',
    instagramUsername: 'miami2030meet'
  },
  'pennstate': {
    name: 'Pennsylvania State University',
    displayName: 'Penn State',
    instagramUsername: 'psu2030students'
  },
  'utoronto': {
    name: 'University of Toronto',
    displayName: 'UofT',
    instagramUsername: 'uoft2030class'
  },
  'uconn': {
    name: 'University of Connecticut',
    displayName: 'UConn',
    instagramUsername: 'uconn2030meet'
  },
  'northeastern': {
    name: 'Northeastern University',
    displayName: 'Northeastern / NEU',
    instagramUsername: 'northeastern2030meet'
  },
  'uga': {
    name: 'University of Georgia',
    displayName: 'UGA',
    instagramUsername: 'uga2030meet'
  },
  'ua': {
    name: 'University of Alabama',
    displayName: 'Alabama / Bama',
    instagramUsername: 'ualabama2030'
  },

  // Midwest & Rust Belt
  'uchicago': {
    name: 'University of Chicago',
    displayName: 'UChicago',
    instagramUsername: 'uchicago2030'
  },
  'umich': {
    name: 'University of Michigan',
    displayName: 'UMich / Michigan',
    instagramUsername: 'mich2030class'
  },
  'umn': {
    name: 'University of Minnesota, Twin Cities',
    displayName: 'UMN / Minnesota',
    instagramUsername: 'umn2030students'
  },
  'ucincy': {
    name: 'University of Cincinnati',
    displayName: 'UC / Cincinnati',
    instagramUsername: 'cincy2030fm'
  },
  'uiowa': {
    name: 'University of Iowa',
    displayName: 'UIowa / Iowa',
    instagramUsername: 'uiowa2030class'
  },
  'cuboulder': {
    name: 'University of Colorado Boulder',
    displayName: 'CU Boulder',
    instagramUsername: 'cuboulder2030class'
  },
  'uwmadison': {
    name: 'University of Wisconsin–Madison',
    displayName: 'UW–Madison / Wisconsin',
    instagramUsername: 'uwm2030class'
  },
  'uiuc': {
    name: 'University of Illinois Urbana-Champaign',
    displayName: 'UIUC / Illinois',
    instagramUsername: 'uiuc2030co'
  },
  'purdue': {
    name: 'Purdue University',
    displayName: 'Purdue',
    instagramUsername: 'purdue2030meet'
  },
  'msu': {
    name: 'Michigan State University',
    displayName: 'MSU',
    instagramUsername: 'msu2030meet'
  },
  'osu': {
    name: 'Ohio State University',
    displayName: 'OSU / Ohio State',
    instagramUsername: 'osu2030class'
  },
  'ou': {
    name: 'University of Oklahoma',
    displayName: 'OU',
    instagramUsername: 'ou2030meet'
  },
  'cmu': {
    name: 'Carnegie Mellon University',
    displayName: 'CMU',
    instagramUsername: 'cmu2030meet'
  },
  'indiana': {
    name: 'Indiana University Bloomington',
    displayName: 'IU / Indiana',
    instagramUsername: 'iub2030'
  },

  // South & West
  'asu': {
    name: 'Arizona State University',
    displayName: 'ASU',
    instagramUsername: 'asu2030meet'
  },
  'utaustin': {
    name: 'University of Texas at Austin',
    displayName: 'UT Austin / Texas',
    instagramUsername: 'utaustin2030meet'
  },
  'uwashington': {
    name: 'University of Washington',
    displayName: 'UW',
    instagramUsername: 'uwash2030'
  },
  'rice': {
    name: 'Rice University',
    displayName: 'Rice',
    instagramUsername: 'rice2030meet'
  },
  'uarizona': {
    name: 'University of Arizona',
    displayName: 'UArizona / Arizona',
    instagramUsername: 'uarizona2030meet'
  },
  'tamu': {
    name: 'Texas A&M University',
    displayName: 'Texas A&M / A&M',
    instagramUsername: 'tamu2030meet'
  },
  'uoregon': {
    name: 'University of Oregon',
    displayName: 'UO / Oregon',
    instagramUsername: 'oregon2030class'
  },
  'ucf': {
    name: 'University of Central Florida',
    displayName: 'UCF',
    instagramUsername: 'ucf2030students'
  },
  'olemiss': {
    name: 'University of Mississippi',
    displayName: 'Ole Miss',
    instagramUsername: 'olemiss2030meet'
  },
  'boisestate': {
    name: 'Boise State University',
    displayName: 'Boise State',
    instagramUsername: 'boisestate2030class'
  },
  'utah': {
    name: 'University of Utah',
    displayName: 'U of U / Utah',
    instagramUsername: 'utah2030class'
  },
  'utk': {
    name: 'University of Tennessee, Knoxville',
    displayName: 'UTK / Tennessee',
    instagramUsername: 'utk2030students'
  },
  'uarkansas': {
    name: 'University of Arkansas',
    displayName: 'Arkansas',
    instagramUsername: 'arkansas2030class'
  },
  'vt': {
    name: 'Virginia Polytechnic Institute and State University',
    displayName: 'Virginia Tech',
    instagramUsername: 'vt2030meet'
  },
  'lsu': {
    name: 'Louisiana State University',
    displayName: 'LSU',
    instagramUsername: 'lsu2030co'
  },
  'rutgers': {
    name: 'Rutgers University',
    displayName: 'Rutgers',
    instagramUsername: 'rutgers2030class'
  },
  'clemson': {
    name: 'Clemson University',
    displayName: 'Clemson',
    instagramUsername: 'clemson2030students'
  },
  'auburn': {
    name: 'Auburn University',
    displayName: 'Auburn',
    instagramUsername: 'auburn2030students'
  },
  'uscsc': {
    name: 'University of South Carolina',
    displayName: 'USC (East Coast) / South Carolina',
    instagramUsername: 'uofsc2030meet'
  },
  'ttu': {
    name: 'Texas Tech University',
    displayName: 'Texas Tech',
    instagramUsername: 'ttu2030students'
  },
  'uky': {
    name: 'University of Kentucky',
    displayName: 'UK',
    instagramUsername: 'ukentucky2030'
  },
  'mizzou': {
    name: 'University of Missouri',
    displayName: 'Mizzou',
    instagramUsername: 'mizzou2030students'
  },
  'unl': {
    name: 'University of Nebraska–Lincoln',
    displayName: 'UNL / Nebraska',
    instagramUsername: 'unlincoln2030'
  },
  'pitt': {
    name: 'University of Pittsburgh',
    displayName: 'Pitt',
    instagramUsername: 'pitt2030students'
  },
  'kstate': {
    name: 'Kansas State University',
    displayName: 'K-State',
    instagramUsername: 'kansas2030meet'
  },
  'jhu': {
    name: 'Johns Hopkins University',
    displayName: 'JHU / Hopkins',
    instagramUsername: 'jhu2030class'
  },
  'wakeforest': {
    name: 'Wake Forest University',
    displayName: 'Wake Forest',
    instagramUsername: 'wfu2030class'
  },
  'tufts': {
    name: 'Tufts University',
    displayName: 'Tufts',
    instagramUsername: 'tufts2030meet'
  },
  'emory': {
    name: 'Emory University',
    displayName: 'Emory',
    instagramUsername: 'emory2030class'
  }
};

// Helper function to check if a school slug is approved
export const isApprovedSchool = (slug: string): boolean => {
  return slug in APPROVED_SCHOOLS;
};

// Helper function to get approved school data
export const getApprovedSchool = (slug: string): ApprovedSchool | null => {
  return APPROVED_SCHOOLS[slug] || null;
};

// Helper function to get all approved school slugs
export const getApprovedSchoolSlugs = (): string[] => {
  return Object.keys(APPROVED_SCHOOLS);
};