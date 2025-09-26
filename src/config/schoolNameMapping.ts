// School slug to full official name mapping
export const SCHOOL_NAME_MAPPING: Record<string, string> = {
  // From Community.tsx SCHOOLS array - using exact slugs
  'asu': 'Arizona State University',
  'bu': 'Boston University',
  'brown-university': 'Brown University',
  'cal-poly-pomona': 'California State Polytechnic University, Pomona',
  'caltech': 'California Institute of Technology',
  'cal-poly-slo': 'California Polytechnic State University, San Luis Obispo',
  'csulb': 'California State University, Long Beach',
  'cmu': 'Carnegie Mellon University',
  'chico-state': 'California State University, Chico',
  'columbia-university': 'Columbia University',
  'cornell-university': 'Cornell University',
  'dartmouth-college': 'Dartmouth College',
  'duke-university': 'Duke University',
  'fsu': 'Florida State University',
  'georgetown-university': 'Georgetown University',
  'harvard-university': 'Harvard University',
  'iu': 'Indiana University Bloomington',
  'mit': 'Massachusetts Institute of Technology',
  'msu': 'Michigan State University',
  'nyu': 'New York University',
  'northeastern-university': 'Northeastern University',
  'northwestern-university': 'Northwestern University',
  'osu': 'Ohio State University',
  'psu': 'Pennsylvania State University',
  'princeton-university': 'Princeton University',
  'purdue-university': 'Purdue University',
  'rice-university': 'Rice University',
  'sac-state': 'California State University, Sacramento',
  'sf-state': 'San Francisco State University',
  'sdsu': 'San Diego State University',
  'sjsu': 'San Jose State University',
  'stanford-university': 'Stanford University',
  'texas-aandm': 'Texas A&M University',
  'university-of-alabama': 'University of Alabama',
  'university-of-arizona': 'University of Arizona',
  'uc-berkeley': 'University of California, Berkeley',
  'ucberkeley': 'University of California, Berkeley', // Alternative slug
  'uc-davis': 'University of California, Davis',
  'ucdavis': 'University of California, Davis', // Alternative slug
  'uc-irvine': 'University of California, Irvine',
  'uci': 'University of California, Irvine', // Alternative slug
  'ucla': 'University of California, Los Angeles',
  'uc-merced': 'University of California, Merced',
  'ucmerced': 'University of California, Merced', // Alternative slug
  'uc-riverside': 'University of California, Riverside',
  'ucr': 'University of California, Riverside', // Alternative slug
  'uc-san-diego': 'University of California, San Diego',
  'ucsd': 'University of California, San Diego', // Alternative slug
  'uc-santa-barbara': 'University of California, Santa Barbara',
  'ucsb': 'University of California, Santa Barbara', // Alternative slug
  'uc-santa-cruz': 'University of California, Santa Cruz',
  'ucsc': 'University of California, Santa Cruz', // Alternative slug
  'ucf': 'University of Central Florida',
  'uchicago': 'University of Chicago',
  'cu-boulder': 'University of Colorado Boulder',
  'uf': 'University of Florida',
  'uga': 'University of Georgia',
  'uiuc': 'University of Illinois Urbana-Champaign',
  'university-of-miami': 'University of Miami',
  'university-of-michigan': 'University of Michigan',
  'university-of-minnesota': 'University of Minnesota',
  'unc': 'University of North Carolina at Chapel Hill',
  'university-of-oregon': 'University of Oregon',
  'upenn': 'University of Pennsylvania',
  'usc': 'University of Southern California',
  'ut': 'University of Texas at Austin',
  'uva': 'University of Virginia',
  'uw': 'University of Washington',
  'uw-madison': 'University of Wisconsin–Madison',
  'vanderbilt-university': 'Vanderbilt University',
  'virginia-tech': 'Virginia Polytechnic Institute and State University',
  'yale-university': 'Yale University',
  
  // Legacy mappings for backward compatibility (only unique keys)
  'harvard': 'Harvard University',
  'princeton': 'Princeton University',
  'yale': 'Yale University',
  'columbia': 'Columbia University',
  'brown': 'Brown University',
  'dartmouth': 'Dartmouth College',
  'cornell': 'Cornell University',
  'stanford': 'Stanford University',
  'duke': 'Duke University',
  'northwestern': 'Northwestern University',
  'vanderbilt': 'Vanderbilt University',
  'georgetown': 'Georgetown University',
  'rice': 'Rice University',
  'carnegie-mellon': 'Carnegie Mellon University',
  'boston-university': 'Boston University',
  'northeastern': 'Northeastern University',
  'university-of-florida': 'University of Florida',
  'florida-state': 'Florida State University',
  'university-of-texas': 'University of Texas at Austin',
  'michigan': 'University of Michigan',
  'university-of-virginia': 'University of Virginia',
  'university-of-washington': 'University of Washington',
  'purdue': 'Purdue University',
  'georgia': 'University of Georgia',
  'indiana': 'Indiana University Bloomington',
  'penn-state': 'Pennsylvania State University',
  'michigan-state': 'Michigan State University',
  'ohio-state': 'Ohio State University',
  'minnesota': 'University of Minnesota',
  'alabama': 'University of Alabama',
  'university-of-central-florida': 'University of Central Florida',
  'university-of-colorado-boulder': 'University of Colorado Boulder',
  'wisconsin': 'University of Wisconsin–Madison',
  'iowa-state': 'Iowa State University',
  'san-francisco-state': 'San Francisco State University',
  'san-diego-state': 'San Diego State University'
};

// Helper function to get full school name from slug
export const getSchoolName = (schoolSlug: string): string => {
  return SCHOOL_NAME_MAPPING[schoolSlug] || schoolSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
};

// Helper function to check if a school mapping exists
export const hasSchoolMapping = (schoolSlug: string): boolean => {
  return schoolSlug in SCHOOL_NAME_MAPPING;
};