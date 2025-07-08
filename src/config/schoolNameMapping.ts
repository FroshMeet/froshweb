// School slug to full official name mapping
export const SCHOOL_NAME_MAPPING: Record<string, string> = {
  // UC System
  'uc-santa-cruz': 'University of California, Santa Cruz',
  'uc-berkeley': 'University of California, Berkeley',
  'ucla': 'University of California, Los Angeles',
  'uc-san-diego': 'University of California, San Diego',
  'uc-irvine': 'University of California, Irvine',
  'uc-davis': 'University of California, Davis',
  'uc-santa-barbara': 'University of California, Santa Barbara',
  'uc-merced': 'University of California, Merced',
  'uc-riverside': 'University of California, Riverside',
  
  // Ivy League
  'harvard': 'Harvard University',
  'upenn': 'University of Pennsylvania',
  'princeton': 'Princeton University',
  'yale': 'Yale University',
  'columbia': 'Columbia University',
  'brown': 'Brown University',
  'dartmouth': 'Dartmouth College',
  'cornell': 'Cornell University',
  
  // Private Universities
  'usc': 'University of Southern California',
  'nyu': 'New York University',
  'stanford': 'Stanford University',
  'mit': 'Massachusetts Institute of Technology',
  'caltech': 'California Institute of Technology',
  'uchicago': 'University of Chicago',
  'duke': 'Duke University',
  'northwestern': 'Northwestern University',
  'vanderbilt': 'Vanderbilt University',
  'georgetown': 'Georgetown University',
  'rice': 'Rice University',
  'university-of-miami': 'University of Miami',
  'carnegie-mellon': 'Carnegie Mellon University',
  'boston-university': 'Boston University',
  'northeastern': 'Northeastern University',
  'university-of-florida': 'University of Florida',
  
  // State Universities
  'florida-state': 'Florida State University',
  'asu': 'Arizona State University',
  'university-of-texas': 'University of Texas at Austin',
  'michigan': 'University of Michigan',
  'unc': 'University of North Carolina at Chapel Hill',
  'university-of-virginia': 'University of Virginia',
  'university-of-washington': 'University of Washington',
  'purdue': 'Purdue University',
  'georgia': 'University of Georgia',
  'indiana': 'Indiana University Bloomington',
  'penn-state': 'Pennsylvania State University',
  'michigan-state': 'Michigan State University',
  'ohio-state': 'Ohio State University',
  'university-of-arizona': 'University of Arizona',
  'texas-aandm': 'Texas A&M University',
  'virginia-tech': 'Virginia Polytechnic Institute and State University',
  'minnesota': 'University of Minnesota',
  'university-of-oregon': 'University of Oregon',
  'alabama': 'University of Alabama',
  'ucf': 'University of Central Florida',
  'university-of-central-florida': 'University of Central Florida',
  'university-of-colorado-boulder': 'University of Colorado Boulder',
  'wisconsin': 'University of Wisconsin–Madison',
  'uiuc': 'University of Illinois Urbana-Champaign',
  'iowa-state': 'Iowa State University',
  
  // Cal State System
  'sac-state': 'California State University, Sacramento',
  'san-francisco-state': 'San Francisco State University',
  'csulb': 'California State University, Long Beach',
  'cal-poly-pomona': 'California State Polytechnic University, Pomona',
  'san-diego-state': 'San Diego State University',
  'sjsu': 'San Jose State University',
  'chico-state': 'California State University, Chico',
  'cal-poly-slo': 'California Polytechnic State University, San Luis Obispo',
};

// Helper function to get full school name from slug
export const getSchoolName = (schoolSlug: string): string => {
  return SCHOOL_NAME_MAPPING[schoolSlug] || schoolSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
};

// Helper function to check if a school mapping exists
export const hasSchoolMapping = (schoolSlug: string): boolean => {
  return schoolSlug in SCHOOL_NAME_MAPPING;
};