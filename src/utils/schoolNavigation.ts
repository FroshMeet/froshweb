import { School } from '@/data/schools';
import { APPROVED_SCHOOLS } from '@/config/approvedSchools';

/**
 * Maps school objects to their correct approved slugs for navigation
 * This ensures consistent routing across all components
 */
export const getCorrectSchoolSlug = (school: School): string => {
  // School ID to approved slug mapping for mismatched cases
  const schoolIdToSlugMap: Record<string, string> = {
    // NorCal Community Colleges - these have the biggest mismatches
    'folsom-lake-college': 'flc',
    'american-river-college': 'arc', 
    'modesto-jc': 'mjc',
    'sac-state': 'sacstate',
    'sacramento-city-college': 'scc',
    'lake-tahoe-cc': 'ltcc',
    'sierra-college': 'sierra',
    'yuba-college': 'yuba',
    
    // California CSU System mappings
    'cal-poly-pomona': 'cpp',        // Cal Poly Pomona
    'chico-state': 'csuchico',       // Chico State  
    'cal-poly-slo': 'calpolyslo',    // Cal Poly SLO
    
    // Major universities with mismatches
    'uop': 'pacific',          // University of the Pacific
    'psu': 'pennstate',        // Penn State
    'umiami': 'miami',         // University of Miami
    'uoft': 'utoronto',        // University of Toronto
    'ucincinnati': 'ucincy',   // University of Cincinnati
    'cu-boulder': 'cuboulder', // University of Colorado Boulder
    'uw-madison': 'uwmadison', // University of Wisconsin-Madison
    'iu': 'indiana',           // Indiana University Bloomington
    'ut-austin': 'utaustin',   // University of Texas at Austin
    'uw': 'uwashington',       // University of Washington
    'ole-miss': 'olemiss',     // University of Mississippi
    'boise-state': 'boisestate',  // Boise State University  
    'uark': 'uarkansas',       // University of Arkansas
    'virginia-tech': 'vt',     // Virginia Tech
    'usc-columbia': 'uscsc',   // University of South Carolina
    'uk': 'uky',               // University of Kentucky
    
    // Additional mappings found during audit
    'uf': 'ufl',               // University of Florida
    'wake-forest': 'wakeforest', // Wake Forest University
    
    // Add other mappings as needed
  };

  // First, check if there's a specific mapping for this school ID
  const mappedSlug = schoolIdToSlugMap[school.id];
  if (mappedSlug && APPROVED_SCHOOLS[mappedSlug]) {
    return mappedSlug;
  }

  // If the school ID exists directly as an approved slug, use it
  if (APPROVED_SCHOOLS[school.id]) {
    return school.id;
  }

  // For schools not in approved schools, return the original ID
  // This handles cases where the school might be added to approved schools later
  return school.id;
};

/**
 * Validates that a school navigation will work correctly
 * Useful for debugging and development
 */
export const validateSchoolNavigation = (school: School): {
  isValid: boolean;
  correctSlug: string;
  warning?: string;
} => {
  const correctSlug = getCorrectSchoolSlug(school);
  const isApproved = !!APPROVED_SCHOOLS[correctSlug];
  
  return {
    isValid: isApproved,
    correctSlug,
    warning: !isApproved 
      ? `School "${school.name}" with slug "${correctSlug}" is not in approved schools`
      : undefined
  };
};

/**
 * Gets approved school data by school object
 */
export const getApprovedSchoolData = (school: School) => {
  const correctSlug = getCorrectSchoolSlug(school);
  return APPROVED_SCHOOLS[correctSlug] || null;
};
