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
    
    // Other major universities with mismatches
    'uop': 'pacific',  // University of the Pacific
    'psu': 'pennstate', // Penn State
    'umiami': 'miami',  // University of Miami
    
    // Additional mappings found during audit
    'uf': 'ufl',       // University of Florida
    
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
