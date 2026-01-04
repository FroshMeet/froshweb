/**
 * Centralized school profile image resolver
 * Maps school slugs to their canonical PFP images stored in Supabase Storage
 */

const STORAGE_BASE = 'https://zdicoswxpkpdnmxnhrrn.supabase.co/storage/v1/object/public/school%20logos';

// Schools with images stored locally in public folder (not yet in Supabase bucket)
const LOCAL_IMAGES: Record<string, string> = {
  'unl': '/school-logos/UNL_PFP.png',
};

/**
 * Mapping of school slug (from schools.ts id) to exact filename in Supabase bucket
 * Based on 99 images uploaded to "school logos" bucket
 */
const SCHOOL_IMAGE_MAP: Record<string, string> = {
  // Ivy League
  'harvard': 'HARVARD_PFP.png',
  
  // === CAROUSEL SLUG ALIASES ===
  // These match the slugs used in Homepage.tsx SCHOOL_DATABASE
  'utaustin': 'UTAUSTIN_PFP.png',
  'pennstate': 'PSU_PFP.png',
  'uwmadison': 'UWM_PFP.png',
  'uwashington': 'UWASHINGTON_PFP.png',
  'ufl': 'UF_PFP.png',
  'miami': 'MIAMI_PFP.png',
  'wakeforest': 'WFU_PFP.png',
  'uscsc': 'UOFSC_PFP.png',
  'uky': 'UKENTUCKY_PFP.png',
  'cuboulder': 'CUBOULDER_PFP.png',
  'ucincy': 'CINCY_PFP.png',
  'uarkansas': 'ARKANSAS_PFP.png',
  'boisestate': 'BSU_PFP.png',
  'calpolyslo': 'SLO_PFP.png',
  'cpp': 'CPP_PFP.png',
  'csuchico': 'CHICO_PFP.png',
  'sacstate': 'CSUS_PFP.png',
  'sierra': 'SIERRA_PFP-2.png',
  'pacific': 'PACIFIC_PFP.png',
  'scc': 'SCC_PFP.png',
  'arc': 'ARC_PFP.png',
  'flc': 'FLC_PFP.png',
  'mjc': 'MJU_PFP.png',
  'ltcc': 'TAHOE_PFP.png',
  'yuba': 'YUBA_PFP.png',
  'upenn': 'UPENN_PFP.png',
  'princeton': 'PRINCETON_PFP.png',
  'columbia': 'COLUMBIA_PFP.png',
  'yale': 'YALE_PFP.png',
  'cornell': 'CORNELL_PFP.png',
  'dartmouth': 'DARTMOUTH_PFP.png',
  'brown': 'BROWN_PFP.png',

  // UC System
  'ucsc': 'UCSC_PFP.png',
  'ucberkeley': 'BERKELEY_PFP.png',
  'ucsd': 'UCSD_PFP.png',
  'uci': 'UCI_PFP.png',
  'ucdavis': 'DAVIS_PFP.png',
  'ucsb': 'UCSB_PFP.png',
  'ucmerced': 'UCM_PFP.png',
  'ucr': 'UCR_PFP.png',
  'ucla': 'UCLA_PFP-2.png',

  // California Privates & CSU
  'stanford': 'STANFORD_PFP.png',
  'caltech': 'CALTECH_PFP.png',
  'usc': 'USC_PFP.png',
  'sfsu': 'SFSU_PFP.png',
  'csulb': 'CSULB_PFP.png',
  'cal-poly-pomona': 'CPP_PFP.png',
  'sdsu': 'SDSU_PFP.png',
  'sjsu': 'SJSU_PFP.png',
  'chico-state': 'CHICO_PFP.png',
  'cal-poly-slo': 'SLO_PFP.png',
  'csuf': 'CSUF_PFP.png',
  'lmu': 'LMU_PFP.png',

  // NorCal Colleges
  'sierra-college': 'SIERRA_PFP-2.png',
  'folsom-lake-college': 'FLC_PFP.png',
  'american-river-college': 'ARC_PFP.png',
  'jessup': 'JESSUP_PFP.png',
  'sac-state': 'CSUS_PFP.png',
  'modesto-jc': 'MJU_PFP.png', // Note: bucket has typo MJU instead of MJC
  'yuba-college': 'YUBA_PFP.png',
  'uop': 'PACIFIC_PFP.png',
  'sacramento-city-college': 'SCC_PFP.png',
  'lake-tahoe-cc': 'TAHOE_PFP.png',

  // Major U.S. Universities
  'nyu': 'NYU_PFP.png',
  'fsu': 'FSU_PFP.png',
  'mit': 'MIT_PFP.png',
  'duke': 'DUKE_PFP.png',
  'uf': 'UF_PFP.png',
  'unc': 'UNC_PFP.png',
  'uva': 'UVA_PFP.png',
  'northwestern': 'NU_PFP.png',
  'vanderbilt': 'VANDY_PFP.png',
  'georgetown': 'GEORGETOWN_PFP.png',
  'bu': 'BU_PFP.png',
  'umiami': 'MIAMI_PFP.png',
  'psu': 'PSU_PFP.png',
  'uoft': 'UOFT_PFP.png',
  'uconn': 'UCONN_PFP.png',
  'northeastern': 'NEU_PFP.png',
  'uga': 'UGA_PFP.png',
  'ua': 'ALABAMA_PFP.png',

  // Big Ten & Midwest
  'uchicago': 'UCHICAGO_PFP.png',
  'umich': 'UMICHIGAN_PFP.png',
  'umn': 'UMN_PFP.png',
  'ucincinnati': 'CINCY_PFP.png',
  'uiowa': 'UIOWA_PFP.png',
  'cu-boulder': 'CUBOULDER_PFP.png',
  'uw-madison': 'UWM_PFP.png',
  'uiuc': 'UIUC_PFP.png',
  'purdue': 'PURDUE_PFP.png',
  'msu': 'MSU_PFP.png',
  'osu': 'OSU_PFP.png',
  'ou': 'OU_PFP.png',
  'cmu': 'CMU_PFP.png',
  'iu': 'IUB_PFP.png',

  // South & West
  'asu': 'ASU_PFP.png',
  'ut-austin': 'UTAUSTIN_PFP.png',
  'uw': 'UWASHINGTON_PFP.png',
  'rice': 'RICE_PFP.png',
  'uarizona': 'UARIZONA_PFP.png',
  'tamu': 'TAMU_PFP.png',
  'uoregon': 'UOREGON_PFP.png',
  'ucf': 'UCF_PFP.png',
  'ole-miss': 'OLE_PFP.png',
  'boise-state': 'BSU_PFP.png',
  'utah': 'UTAH_PFP.png',
  'utk': 'UTK_PFP.png',
  'uark': 'ARKANSAS_PFP.png',
  'virginia-tech': 'VT_PFP.png',
  'lsu': 'LSU_PFP.png',
  'rutgers': 'RUTGERS_PFP.png',
  'clemson': 'CLEMENSON_PFP.png', // Note: bucket has typo CLEMENSON instead of CLEMSON
  'auburn': 'AUBURN_PFP.png',
  'usc-columbia': 'UOFSC_PFP.png',
  'ttu': 'TEXASTECH_PFP.png',
  'uk': 'UKENTUCKY_PFP.png',
  'mizzou': 'MIZZOU_PFP.png',
  // 'unl': missing - University of Nebraska–Lincoln has no image
  'pitt': 'PITT_PFP.png',
  'kstate': 'KSU_PFP.png',
  'jhu': 'JHU_PFP.png',
  'wake-forest': 'WFU_PFP.png',
  'tufts': 'TUFTS_PFP.png',
  'emory': 'EMORY_PFP.png',
};

/**
 * Get the full URL for a school's profile image
 * @param slug - The school slug (id from schools.ts)
 * @returns The full Supabase Storage URL or local path, or null if no image exists
 */
export function getSchoolImageUrl(slug: string): string | null {
  // Check local images first
  if (LOCAL_IMAGES[slug]) {
    return LOCAL_IMAGES[slug];
  }
  const filename = SCHOOL_IMAGE_MAP[slug];
  if (!filename) return null;
  return `${STORAGE_BASE}/${encodeURIComponent(filename)}`;
}

/**
 * Check if a school has a profile image
 * @param slug - The school slug (id from schools.ts)
 * @returns true if the school has an image in the bucket or locally
 */
export function hasSchoolImage(slug: string): boolean {
  return slug in SCHOOL_IMAGE_MAP || slug in LOCAL_IMAGES;
}

/**
 * Get list of schools without images (for debugging/logging)
 */
export function getSchoolsWithoutImages(allSlugs: string[]): string[] {
  return allSlugs.filter(slug => !hasSchoolImage(slug));
}
