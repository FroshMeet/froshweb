// Schema.org structured data generators for SEO

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Frosh",
  "alternateName": ["Frosh App", "Frosh College Platform"],
  "url": "https://frosh.app",
  "logo": "https://frosh.app/lovable-uploads/fresh_meat_app_icon.png",
  "description": "Frosh is the #1 college app for freshmen. Connect with your Class of 2030 classmates before day one at top universities nationwide.",
  "slogan": "Meet Your Class of 2030 Before Day One",
  "foundingDate": "2024",
  "founders": [
    {
      "@type": "Person",
      "name": "Kian"
    }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@frosh.app",
    "areaServed": "US",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://twitter.com/getfrosh",
    "https://www.instagram.com/getfrosh/",
    "https://www.tiktok.com/@getfrosh",
    "https://www.youtube.com/@getfrosh"
  ],
  "brand": {
    "@type": "Brand",
    "name": "Frosh"
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Frosh",
  "alternateName": "Frosh App",
  "url": "https://frosh.app",
  "description": "Frosh is the #1 college app for freshmen. Connect with your Class of 2030 classmates before day one — meet students, find roommates, and build your college community.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://frosh.app/community?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "keywords": "frosh, college app, freshman social network, Class of 2030, meet classmates, find roommates"
};

export const mobileAppSchema = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "name": "Frosh",
  "alternateName": "Frosh App",
  "applicationCategory": "SocialNetworkingApplication",
  "operatingSystem": "iOS, Android",
  "description": "Frosh is the #1 social app for college freshmen. Meet your Class of 2030 classmates, find roommates, and connect before day one at top universities.",
  "about": {
    "@type": "Thing",
    "name": "College Freshman Social Networking"
  },
  "audience": {
    "@type": "EducationalAudience",
    "educationalRole": "College Freshman",
    "audienceType": "Class of 2030"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250",
    "bestRating": "5"
  },
  "keywords": "frosh, college app, freshman social network, Class of 2030"
};

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const schoolPageSchema = (schoolName: string, schoolSlug: string) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": `${schoolName} - Frosh`,
  "description": `Connect with ${schoolName} Class of 2030. Meet freshmen, find roommates, and build your college community before day one.`,
  "url": `https://frosh.app/${schoolSlug}`,
  "isPartOf": {
    "@type": "WebSite",
    "name": "Frosh",
    "url": "https://frosh.app"
  },
  "about": {
    "@type": "CollegeOrUniversity",
    "name": schoolName
  }
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `https://frosh.app${item.url}`
  }))
});
