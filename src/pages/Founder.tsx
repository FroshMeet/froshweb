import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Linkedin, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import FroshLogo from '@/components/ui/FroshLogo';

const Founder = () => {
  const navigate = useNavigate();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Kian Habibi",
    "jobTitle": "Founder",
    "worksFor": { "@type": "Organization", "name": "Frosh" },
    "url": "https://linkedin.com/in/kianhabibi",
    "sameAs": ["https://linkedin.com/in/kianhabibi"]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Meet the Founder – Kian Habibi | Frosh"
        description="Meet Kian Habibi, the founder of Frosh — the social app helping incoming college freshmen connect with classmates before move-in day."
        canonical="/founder"
        schema={personSchema}
      />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <FroshLogo size="sm" onClick={() => navigate('/')} />
          <Button
            onClick={() => navigate('/download')}
            className="rounded-full px-6 py-2.5 text-sm font-semibold bg-primary hover:bg-primary/90"
          >
            Get Frosh
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-8">
          Meet the founder
        </p>

        {/* Square headshot centered on face */}
        <div className="flex justify-center mb-10">
          <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden border border-border/30">
            <img
              src="/kian-habibi-founder-frosh.jpg"
              alt="Kian Habibi founder of Frosh"
              width="256"
              height="256"
              className="w-full h-full object-cover object-[center_20%]"
            />
          </div>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">
          Kian Habibi
        </h1>

        <div className="space-y-5 text-foreground text-lg leading-relaxed">
          <p>
            Hi, I'm <strong>Kian</strong>. I built Frosh to make it easier for incoming college students
            to meet their classmates before arriving on campus.
          </p>
          <p>
            Starting college can be overwhelming, and I wanted a way for people to find friends
            before they even step on campus.
          </p>
        </div>

        <p className="mt-6 text-muted-foreground italic">— Kian</p>

        <a
          href="https://linkedin.com/in/kianhabibi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-8 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <Linkedin className="w-4 h-4" />
          Connect with Kian on LinkedIn
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default Founder;
