import { SEO } from './SEO';
import { schoolPageSchema, breadcrumbSchema, organizationSchema, websiteSchema, mobileAppSchema } from '@/utils/seoSchema';

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
  const title = `${schoolName} Class of 2030 – Meet Freshmen on Frosh App`;
  const description = `Join Frosh to connect with the ${schoolName} Class of 2030. Meet classmates, find roommates, and join group chats before stepping on campus.`;
  
  const keywords = `${schoolName}, ${schoolName} Class of 2030, ${schoolName} freshmen, ${schoolName} roommates, ${schoolName} students, meet ${schoolName} classmates, ${schoolName} social, college freshmen, frosh app`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      websiteSchema,
      mobileAppSchema,
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
