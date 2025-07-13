
import { APPROVED_SCHOOLS } from './approvedSchools';

export interface SchoolOption {
  value: string;
  label: string;
  searchTerms: string[];
}

// Create school database with search terms for intelligent matching
export const SCHOOL_DATABASE: SchoolOption[] = Object.entries(APPROVED_SCHOOLS).map(([slug, school]) => ({
  value: slug,
  label: school.name,
  searchTerms: [
    school.name,
    school.displayName || school.name,
    // Add common abbreviations and variations
    ...(slug === 'ucla' ? ['UCLA', 'UC Los Angeles', 'University of California Los Angeles'] : []),
    ...(slug === 'usc' ? ['USC', 'Southern Cal', 'University of Southern California'] : []),
    ...(slug === 'uc-berkeley' ? ['UC Berkeley', 'Berkeley', 'Cal', 'University of California Berkeley'] : []),
    ...(slug === 'stanford-university' ? ['Stanford', 'Stanford University'] : []),
    ...(slug === 'harvard-university' ? ['Harvard', 'Harvard University'] : []),
    ...(slug === 'mit' ? ['MIT', 'Massachusetts Institute of Technology'] : []),
    ...(slug === 'nyu' ? ['NYU', 'New York University'] : []),
    ...(slug === 'columbia-university' ? ['Columbia', 'Columbia University'] : []),
    ...(slug === 'princeton-university' ? ['Princeton', 'Princeton University'] : []),
    ...(slug === 'yale-university' ? ['Yale', 'Yale University'] : []),
    ...(slug === 'duke-university' ? ['Duke', 'Duke University'] : []),
    ...(slug === 'brown-university' ? ['Brown', 'Brown University'] : []),
    ...(slug === 'cornell-university' ? ['Cornell', 'Cornell University'] : []),
    ...(slug === 'dartmouth-college' ? ['Dartmouth', 'Dartmouth College'] : []),
    ...(slug === 'upenn' ? ['UPenn', 'Penn', 'University of Pennsylvania'] : []),
    ...(slug === 'northwestern-university' ? ['Northwestern', 'Northwestern University'] : []),
    ...(slug === 'uchicago' ? ['UChicago', 'University of Chicago', 'Chicago'] : []),
    ...(slug === 'cmu' ? ['CMU', 'Carnegie Mellon', 'Carnegie Mellon University'] : []),
    ...(slug === 'asu' ? ['ASU', 'Arizona State', 'Arizona State University'] : []),
    ...(slug === 'bu' ? ['BU', 'Boston University'] : []),
    ...(slug === 'northeastern-university' ? ['Northeastern', 'Northeastern University'] : []),
    ...(slug === 'rice-university' ? ['Rice', 'Rice University'] : []),
    ...(slug === 'vanderbilt-university' ? ['Vanderbilt', 'Vanderbilt University'] : []),
    ...(slug === 'georgetown-university' ? ['Georgetown', 'Georgetown University'] : []),
    ...(slug === 'university-of-michigan' ? ['Michigan', 'UMich', 'University of Michigan'] : []),
    ...(slug === 'uf' ? ['UF', 'University of Florida', 'Florida'] : []),
    ...(slug === 'fsu' ? ['FSU', 'Florida State', 'Florida State University'] : []),
    ...(slug === 'ut' ? ['UT', 'University of Texas', 'Texas', 'UT Austin'] : []),
    ...(slug === 'texas-aandm' ? ['Texas A&M', 'TAMU', 'Aggies'] : []),
    // Add more common abbreviations as needed
    slug.replace(/-/g, ' '), // Add slug as searchable term
    school.name.split(' ').join(''), // Remove spaces for compact search
  ]
})).sort((a, b) => a.label.localeCompare(b.label));
