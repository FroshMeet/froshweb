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
  // Arizona State University
  'asu': {
    name: 'Arizona State University',
    displayName: 'ASU',
    instagramUsername: 'asu.2030official'
  },
  
  // Boston University
  'bu': {
    name: 'Boston University',
    displayName: 'BU',
    instagramUsername: 'bu2030meet'
  },
  
  // Brown University
  'brown': {
    name: 'Brown University',
    displayName: 'Brown',
    instagramUsername: 'brownuniversity2030'
  },
  
  // Cal Poly Pomona
  'cal-poly-pomona': {
    name: 'California State Polytechnic University, Pomona',
    displayName: 'Cal Poly Pomona',
    instagramUsername: 'calpolypomona2030'
  },
  
  // Cal Poly SLO
  'cal-poly-slo': {
    name: 'California Polytechnic State University, San Luis Obispo',
    displayName: 'Cal Poly SLO',
    instagramUsername: 'calpolyslo2030meet'
  },
  
  // Cal State Long Beach
  'csulb': {
    name: 'California State University, Long Beach',
    displayName: 'CSULB',
    instagramUsername: 'csulb2030meet'
  },
  
  // Chico State
  'chico-state': {
    name: 'California State University, Chico',
    displayName: 'Chico State',
    instagramUsername: 'chicostate2030meet'
  },
  
  // Caltech
  'caltech': {
    name: 'California Institute of Technology',
    displayName: 'Caltech',
    instagramUsername: 'caltech2030'
  },
  
  // Carnegie Mellon
  'cmu': {
    name: 'Carnegie Mellon University',
    displayName: 'CMU',
    instagramUsername: 'cmu2030meet'
  },
  
  // Columbia
  'columbia': {
    name: 'Columbia University',
    displayName: 'Columbia',
    instagramUsername: 'columbiaclassof2030'
  },
  
  // Cornell
  'cornell': {
    name: 'Cornell University',
    displayName: 'Cornell',
    instagramUsername: 'cornell2030meet'
  },
  
  // University of Colorado Boulder
  'cu-boulder': {
    name: 'University of Colorado Boulder',
    displayName: 'CU Boulder',
    instagramUsername: 'cuboulder2030meet'
  },
  
  // Dartmouth
  'dartmouth': {
    name: 'Dartmouth College',
    displayName: 'Dartmouth',
    instagramUsername: 'dartmouth2030'
  },
  
  // Duke
  'duke': {
    name: 'Duke University',
    displayName: 'Duke',
    instagramUsername: 'duke2030meet'
  },
  
  // Florida State
  'fsu': {
    name: 'Florida State University',
    displayName: 'FSU',
    instagramUsername: 'fsu2030students'
  },
  
  // Georgetown
  'georgetown': {
    name: 'Georgetown University',
    displayName: 'Georgetown',
    instagramUsername: 'georgetown2030meet'
  },
  
  // Harvard
  'harvard': {
    name: 'Harvard University',
    displayName: 'Harvard',
    instagramUsername: 'harvard2030class'
  },
  
  // Indiana University Bloomington
  'iu-bloomington': {
    name: 'Indiana University Bloomington',
    displayName: 'IU Bloomington',
    instagramUsername: 'iubloomington2030'
  },
  
  // MIT
  'mit': {
    name: 'Massachusetts Institute of Technology',
    displayName: 'MIT',
    instagramUsername: 'mit2030class'
  },
  
  // Michigan State
  'michigan-state': {
    name: 'Michigan State University',
    displayName: 'Michigan State',
    instagramUsername: 'msu2030meet'
  },
  
  // Northeastern
  'northeastern': {
    name: 'Northeastern University',
    displayName: 'Northeastern',
    instagramUsername: 'northeastern2030meet'
  },
  
  // Northwestern
  'northwestern': {
    name: 'Northwestern University',
    displayName: 'Northwestern',
    instagramUsername: 'northwestern2030'
  },
  
  // NYU
  'nyu': {
    name: 'New York University',
    displayName: 'NYU',
    instagramUsername: 'nyu2030meet'
  },
  
  // Ohio State
  'ohio-state': {
    name: 'Ohio State University',
    displayName: 'Ohio State',
    instagramUsername: 'osu2030class'
  },
  
  // Penn State
  'penn-state': {
    name: 'Pennsylvania State University',
    displayName: 'Penn State',
    instagramUsername: 'pennstate2030meet'
  },
  
  // Princeton
  'princeton': {
    name: 'Princeton University',
    displayName: 'Princeton',
    instagramUsername: 'princeton2030class'
  },
  
  // Purdue
  'purdue': {
    name: 'Purdue University',
    displayName: 'Purdue',
    instagramUsername: 'purdue2030meet'
  },
  
  // Rice
  'rice': {
    name: 'Rice University',
    displayName: 'Rice',
    instagramUsername: 'rice2030meet'
  },
  
  // Sacramento State
  'sac-state': {
    name: 'California State University, Sacramento',
    displayName: 'Sac State',
    instagramUsername: 'sacstate2030meet'
  },
  
  // SF State
  'sf-state': {
    name: 'San Francisco State University',
    displayName: 'SF State',
    instagramUsername: 'sfsu2030meet'
  },
  
  // San Diego State
  'sdsu': {
    name: 'San Diego State University',
    displayName: 'SDSU',
    instagramUsername: 'sdsu2030meet_'
  },
  
  // San Jose State
  'sjsu': {
    name: 'San Jose State University',
    displayName: 'SJSU',
    instagramUsername: 'sjsu2030meet'
  },
  
  // Stanford
  'stanford': {
    name: 'Stanford University',
    displayName: 'Stanford',
    instagramUsername: 'stanford2030class'
  },
  
  // Texas A&M
  'texas-aandm': {
    name: 'Texas A&M University',
    displayName: 'Texas A&M',
    instagramUsername: 'tamu2030meet'
  },
  
  // University of Arizona
  'uarizona': {
    name: 'University of Arizona',
    displayName: 'UArizona',
    instagramUsername: 'uarizona2030meet'
  },
  
  // University of Alabama
  'ua': {
    name: 'University of Alabama',
    displayName: 'UA',
    instagramUsername: 'ualabama2030'
  },
  
  // UC Berkeley
  'uc-berkeley': {
    name: 'University of California, Berkeley',
    displayName: 'UC Berkeley',
    instagramUsername: 'ucberkeley.2030'
  },
  
  // UC Davis
  'uc-davis': {
    name: 'University of California, Davis',
    displayName: 'UC Davis',
    instagramUsername: 'uc.davis2030'
  },
  
  // UC Irvine
  'uc-irvine': {
    name: 'University of California, Irvine',
    displayName: 'UC Irvine',
    instagramUsername: 'ucirvineclassof2030'
  },
  
  // UCLA
  'ucla': {
    name: 'University of California, Los Angeles',
    displayName: 'UCLA',
    instagramUsername: 'ucla2030.official'
  },
  
  // UC Merced
  'uc-merced': {
    name: 'University of California, Merced',
    displayName: 'UC Merced',
    instagramUsername: 'ucmerced2030'
  },
  
  // UC Riverside
  'uc-riverside': {
    name: 'University of California, Riverside',
    displayName: 'UC Riverside',
    instagramUsername: 'ucr2030meet'
  },
  
  // UCSB
  'ucsb': {
    name: 'University of California, Santa Barbara',
    displayName: 'UCSB',
    instagramUsername: 'ucsb2030_'
  },
  
  // UC Santa Cruz
  'uc-santa-cruz': {
    name: 'University of California, Santa Cruz',
    displayName: 'UC Santa Cruz',
    instagramUsername: 'ucsc2030class'
  },
  
  // UCSD
  'ucsd': {
    name: 'University of California, San Diego',
    displayName: 'UCSD',
    instagramUsername: 'ucsandiego2030class'
  },
  
  // UCF
  'ucf': {
    name: 'University of Central Florida',
    displayName: 'UCF',
    instagramUsername: 'ucf2030meet'
  },
  
  // University of Chicago
  'uchicago': {
    name: 'University of Chicago',
    displayName: 'UChicago',
    instagramUsername: 'uchicago2030'
  },
  
  // University of Florida
  'uf': {
    name: 'University of Florida',
    displayName: 'UF',
    instagramUsername: 'usf2030class'
  },
  
  // University of Georgia
  'uga': {
    name: 'University of Georgia',
    displayName: 'UGA',
    instagramUsername: 'uga2030meet'
  },
  
  // UIUC
  'uiuc': {
    name: 'University of Illinois Urbana-Champaign',
    displayName: 'UIUC',
    instagramUsername: 'uiuc2030class'
  },
  
  // University of Michigan
  'umich': {
    name: 'University of Michigan',
    displayName: 'UMich',
    instagramUsername: 'umich2030.class'
  },
  
  // University of Minnesota
  'umn': {
    name: 'University of Minnesota',
    displayName: 'UMN',
    instagramUsername: 'umn2030meet'
  },
  
  // University of Miami
  'umiami': {
    name: 'University of Miami',
    displayName: 'UMiami',
    instagramUsername: 'umiami2030meet'
  },
  
  // UNC Chapel Hill
  'unc': {
    name: 'University of North Carolina at Chapel Hill',
    displayName: 'UNC Chapel Hill',
    instagramUsername: 'unc2030class_'
  },
  
  // University of Oregon
  'uoregon': {
    name: 'University of Oregon',
    displayName: 'UOregon',
    instagramUsername: 'uoregon2030meet'
  },
  
  // UPenn
  'upenn': {
    name: 'University of Pennsylvania',
    displayName: 'UPenn',
    instagramUsername: 'upenn.2030'
  },
  
  // USC
  'usc': {
    name: 'University of Southern California',
    displayName: 'USC',
    instagramUsername: 'usc2030meet'
  },
  
  // UT Austin
  'ut-austin': {
    name: 'University of Texas at Austin',
    displayName: 'UT Austin',
    instagramUsername: 'utaustin.2030'
  },
  
  // University of Virginia
  'uva': {
    name: 'University of Virginia',
    displayName: 'UVA',
    instagramUsername: 'uva2030meet'
  },
  
  // University of Washington
  'uw': {
    name: 'University of Washington',
    displayName: 'UW',
    instagramUsername: 'uwash2030'
  },
  
  // UW-Madison
  'uw-madison': {
    name: 'University of Wisconsin–Madison',
    displayName: 'UW-Madison',
    instagramUsername: 'uwm2030meet'
  },
  
  // Vanderbilt
  'vanderbilt': {
    name: 'Vanderbilt University',
    displayName: 'Vanderbilt',
    instagramUsername: 'vanderbilt2030'
  },
  
  // Virginia Tech
  'virginia-tech': {
    name: 'Virginia Polytechnic Institute and State University',
    displayName: 'Virginia Tech',
    instagramUsername: 'vt2030meet'
  },
  
  // Yale
  'yale': {
    name: 'Yale University',
    displayName: 'Yale',
    instagramUsername: 'yaleclassof2030'
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