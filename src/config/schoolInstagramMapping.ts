// School to Instagram username mapping
// This file can be easily updated to add new schools or change Instagram handles
export const SCHOOL_INSTAGRAM_MAPPING: Record<string, string> = {
  // UC System
  'uc-santa-cruz': 'ucsc2030class',
  'uc-berkeley': 'ucberkeley.2030',
  'ucla': 'ucla2030.official',
  'uc-san-diego': 'ucsandiego2030class',
  'uc-irvine': 'ucirvineclassof2030',
  'uc-davis': 'uc.davis2030',
  'uc-santa-barbara': 'ucsb2030_',
  'uc-merced': 'ucmerced2030',
  'uc-riverside': 'ucriverside2030meet',
  
  // Ivy League
  'harvard': 'harvard2030class',
  'upenn': 'upenn.2030',
  'princeton': 'princeton2030class',
  'yale': 'yale.2030',
  'columbia': 'columbiaclassof2030',
  'brown': 'brownuniversity2030',
  'dartmouth': 'dartmouth2030',
  'cornell': 'cornell2030meet',
  
  // Private Universities
  'usc': 'usc2030meet',
  'nyu': 'nyu.2030',
  'stanford': 'stanford2030class',
  'mit': 'mit2030class',
  'caltech': 'caltech2030',
  'uchicago': 'uchicago2030',
  'duke': 'dukeclassof2030',
  'northwestern': 'northwestern2030',
  'vanderbilt': 'vanderbilt2030',
  'georgetown': 'georgetown2030meet',
  'rice': 'rice2030meet',
  'university-of-miami': 'miaimiuniversity2030',
  'carnegie-mellon': 'cmu2030meet',
  'boston-university': 'bu2030meet',
  'northeastern': 'northeastern2030meet',
  'university-of-florida': 'uf2030meet',
  
  // State Universities
  'florida-state': 'fsu2030students',
  'asu': 'asu.2030official',
  'university-of-texas': 'utaustin.2030',
  'michigan': 'umich2030.class',
  'unc': 'unc2030class_',
  'university-of-virginia': 'uva2030meet',
  'university-of-washington': 'uwash2030',
  'purdue': 'purdue2030meet',
  'georgia': 'uga2030meet',
  'indiana': 'iubloomington2030',
  'penn-state': 'pennstate2030meet',
  'michigan-state': 'msu2030meet',
  'ohio-state': 'osu2030meet_',
  'university-of-arizona': 'uarizona2030meet',
  'texas-aandm': 'tamu2030meet',
  'virginia-tech': 'vt2030meet',
  'minnesota': 'umn2030meet',
  'university-of-oregon': 'uoregon2030meet',
  'alabama': 'ualabama2030',
  'ucf': 'ucf2030meet',
  'university-of-central-florida': 'ucf2030meet',
  'university-of-colorado-boulder': 'cuboulder2030meet',
  'wisconsin': 'uwm2030meet',
  'uiuc': 'uiuc2030class',
  'iowa-state': 'iowastate2030meet',
  
  // Cal State System
  'sac-state': 'sacstate2030meet',
  'san-francisco-state': 'sfsu2030meet',
  'csulb': 'csulb2030meet',
  'cal-poly-pomona': 'calpolypomona2030',
  'san-diego-state': 'sdsu2030meet_',
  'sjsu': 'sjsu2030meet',
  'chico-state': 'chicostate2030meet',
  'cal-poly-slo': 'calpolyslo2030meet',
  
  // Special cases with alternative handles
  'yale-alt': 'yaleclassof2030',
  'duke-alt': 'duke2030class'
};

// Helper function to get Instagram username for a school
export const getInstagramUsername = (schoolSlug: string): string | null => {
  return SCHOOL_INSTAGRAM_MAPPING[schoolSlug] || null;
};

// Helper function to get all supported schools
export const getSupportedSchools = (): string[] => {
  return Object.keys(SCHOOL_INSTAGRAM_MAPPING);
};

// Helper function to check if a school is supported
export const isSchoolSupported = (schoolSlug: string): boolean => {
  return schoolSlug in SCHOOL_INSTAGRAM_MAPPING;
};