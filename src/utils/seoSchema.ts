// Schema.org structured data generators for SEO

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Frosh",
  "legalName": "Frosh App",
  "alternateName": ["Frosh App", "Get Frosh", "Frosh College Platform", "Frosh Social Network", "Frosh Meet", "GetFrosh", "Frosh Student App", "Frosh College App", "Frosh University Network", "Frosh College Social App"],
  "url": "https://frosh.app",
  "logo": "https://frosh.app/favicon-512.png",
  "description": "Frosh (Get Frosh) is the #1 college social app for incoming students and the Class of 2030. Connect with college freshmen, find roommates, join verified school group chats, and build your university community before Move-In Day. Where college begins before campus.",
  "slogan": "Where College Begins Before Campus",
  "foundingDate": "2024",
  "founders": [
    {
      "@type": "Person",
      "name": "Kian",
      "jobTitle": "Founder"
    }
  ],
  "knowsAbout": [
    "College Freshman Social Networking",
    "Student Matching",
    "University Communities",
    "Roommate Matching",
    "College Group Chats",
    "Student Verification",
    "Campus Connections",
    "Class of 2030",
    "College Social Platform",
    "Student Networking"
  ],
  "applicationCategory": ["Social Networking", "Education Technology", "Student Platform"],
  "keywords": "frosh, get frosh, frosh app, getfrosh, getfrosh.com, frosh.app, college social app, college freshman app, student networking platform, university social network, college chat app, student matching app, roommate finder, college community, Class of 2030, incoming students app, college connections, freshman social network, student social app",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@frosh.app",
    "areaServed": "US",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://getfrosh.com",
    "https://www.getfrosh.com",
    "https://twitter.com/getfrosh",
    "https://www.instagram.com/getfrosh/",
    "https://www.tiktok.com/@getfrosh",
    "https://www.youtube.com/@getfrosh"
  ],
  "brand": {
    "@type": "Brand",
    "name": "Frosh"
  },
  "audience": {
    "@type": "EducationalAudience",
    "educationalRole": "College Freshman",
    "audienceType": "Incoming College Students"
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Frosh",
  "alternateName": ["Frosh App", "Get Frosh", "GetFrosh", "Frosh Social Network", "Frosh College Platform"],
  "url": "https://frosh.app",
  "sameAs": ["https://getfrosh.com", "https://www.getfrosh.com"],
  "description": "Frosh (also known as Get Frosh) is the college social network where incoming students and the Class of 2030 connect before Move-In Day. Meet college freshmen, find roommates, join verified school group chats, and start your university journey early. Where college begins before campus.",
  "about": {
    "@type": "Thing",
    "name": "College Freshman Social Networking Platform"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://frosh.app/community?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "keywords": "frosh, get frosh, getfrosh, frosh app, frosh.app, getfrosh.com, frosh social network, frosh college app, college social app, college freshman app, freshman community, Class of 2030, meet classmates, find roommates, student networking, university social network, college chat app, student matching, incoming students"
};

export const mobileAppSchema = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "name": "Frosh",
  "alternateName": ["Frosh App", "Get Frosh", "GetFrosh", "Frosh College Social App", "Frosh Student Network"],
  "url": "https://frosh.app",
  "sameAs": ["https://getfrosh.com", "https://www.getfrosh.com"],
  "applicationCategory": "SocialNetworkingApplication",
  "operatingSystem": "iOS, Android",
  "description": "Frosh is the college social app that helps incoming students and the Class of 2030 meet new friends, join verified school group chats, find roommates, and connect before arriving on campus. Real connections through verified college communities.",
  "about": {
    "@type": "Thing",
    "name": "College Freshman Social Networking and Student Matching Platform"
  },
  "featureList": [
    "Connect with verified college students",
    "Find compatible roommates",
    "Join school-specific group chats",
    "Meet Class of 2030 classmates",
    "Secure student messaging",
    "University community building",
    "Student matching and discovery",
    "Campus event coordination"
  ],
  "audience": {
    "@type": "EducationalAudience",
    "educationalRole": "College Freshman",
    "audienceType": ["Class of 2030", "Incoming College Students", "University Freshmen"]
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free sign-up for verified college students"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250",
    "bestRating": "5"
  },
  "keywords": "frosh, get frosh, getfrosh, frosh app, frosh.app, getfrosh.com, frosh social network, college app, college social app, student networking app, freshman social network, college freshman app, student matching, roommate finder, Class of 2030, university social network, college chat, student community, incoming students app"
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
