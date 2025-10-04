import { SEO } from './SEO';
import { schoolPageSchema, breadcrumbSchema } from '@/utils/seoSchema';

interface SchoolPageSEOProps {
  schoolName: string;
  schoolSlug: string;
  studentCount?: number;
}

export const SchoolPageSEO = ({ 
  schoolName, 
  schoolSlug,
  studentCount = 0
}: SchoolPageSEOProps) => {
  const title = `${schoolName} Class of 2030 | Frosh`;
  const description = `Connect with ${schoolName} Class of 2030 freshmen on Frosh. Meet classmates, find roommates, join group chats, and build your college community before day one.${studentCount > 0 ? ` Join ${studentCount}+ students.` : ''}`;
  
  const keywords = `${schoolName}, ${schoolName} Class of 2030, ${schoolName} freshmen, ${schoolName} roommates, ${schoolName} students, meet ${schoolName} classmates, ${schoolName} social, college freshmen, frosh app`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      schoolPageSchema(schoolName, schoolSlug),
      breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Community', url: '/community' },
        { name: schoolName, url: `/${schoolSlug}` }
      ])
    ]
  };

  return (
    <SEO
      title={title}
      description={description}
      keywords={keywords}
      canonical={`/${schoolSlug}`}
      schema={schema}
    />
  );
};
