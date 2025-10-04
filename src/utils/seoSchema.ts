// Schema.org structured data generators for SEO

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Frosh",
  "alternateName": "Frosh App",
  "url": "https://frosh.app",
  "logo": "https://frosh.app/lovable-uploads/fresh_meat_app_icon.png",
  "description": "The trusted platform for college freshmen to connect, network, and build lasting friendships before stepping foot on campus.",
  "foundingDate": "2024",
  "founders": [
    {
      "@type": "Person",
      "name": "Kian"
    }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "",
    "contactType": "customer support",
    "email": "support@frosh.app",
    "areaServed": "US",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://www.instagram.com/getfrosh/",
    "https://www.tiktok.com/@getfrosh",
    "https://www.youtube.com/@getfrosh"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Frosh",
  "url": "https://frosh.app",
  "description": "College freshman social networking app for Class of 2030. Meet classmates, find roommates, and build your college community.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://frosh.app/community?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const mobileAppSchema = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "name": "Frosh",
  "applicationCategory": "SocialNetworkingApplication",
  "operatingSystem": "iOS, Android",
  "description": "Connect with your college classmates before day one. The ultimate social app for college freshmen.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250"
  }
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
