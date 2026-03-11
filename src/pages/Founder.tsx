import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Linkedin, Youtube, Globe, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import FroshLogo from '@/components/ui/FroshLogo';

const Founder = () => {
  const navigate = useNavigate();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Kian Habibi",
    "url": "https://frosh.app/founder",
    "jobTitle": "Founder",
    "worksFor": {
      "@type": "Organization",
      "name": "Frosh",
      "url": "https://frosh.app"
    },
    "sameAs": [
      "https://linkedin.com/in/kianhabibi",
      "https://www.youtube.com/@kian-habibi",
      "https://kianhabibi.com"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Kian Habibi – Founder of Frosh | frosh.app"
        description="Kian Habibi is the founder of Frosh, a platform helping incoming college students meet classmates before arriving on campus."
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

      <main className="max-w-2xl mx-auto px-5 py-16 md:py-24">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        {/* Photo */}
        <div className="flex justify-center mb-10">
          <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden border border-border/30">
            <img
              src="/kian-habibi-founder-frosh.jpg"
              alt="Kian Habibi, founder of Frosh"
              width="384"
              height="384"
              className="w-full h-full object-cover object-[center_20%]"
              loading="eager"
            />
          </div>
        </div>

        {/* Name & Title */}
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Kian Habibi
        </h1>
        <h2 className="text-xl md:text-2xl text-muted-foreground font-medium mb-10">
          Founder of <Link to="/" className="text-primary hover:underline">Frosh</Link>
        </h2>

        {/* Why I Built Frosh */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">Why I Built Frosh</h2>
          <div className="space-y-4 text-foreground/90 text-base leading-relaxed">
            <p>
              I'm Kian Habibi, the founder of <Link to="/" className="text-primary hover:underline">Frosh</Link>.
            </p>
            <p>
              I built Frosh because I kept noticing the same pattern: incoming college students were
              excited about starting school but didn't really know anyone yet.
            </p>
            <p>
              Most platforms weren't optimally designed for the period between getting accepted
              and actually arriving on campus.
            </p>
            <p>
              <Link to="/about" className="text-primary hover:underline">Frosh</Link> is meant to
              make that transition easier by helping students meet classmates early, find roommates,
              and start building their community before the first day of school.
            </p>
          </div>
        </section>

        {/* About Me */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">About Me</h2>
          <div className="space-y-4 text-foreground/90 text-base leading-relaxed">
            <p>
              I was born in Tehran, Iran and I'm a business major at UC Santa Cruz. I spend most of my time working on Frosh, spending time with friends, or working out at the gym.
            </p>
          </div>
        </section>

        {/* Around the Web */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-6">Around the Web</h2>
          <div className="space-y-4">
            <a
              href="https://linkedin.com/in/kianhabibi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </a>
            <a
              href="https://www.youtube.com/@kian-habibi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Youtube className="w-5 h-5" />
              YouTube
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </a>
            <a
              href="https://kianhabibi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Globe className="w-5 h-5" />
              kianhabibi.com
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </a>
          </div>
        </section>

        {/* Internal links */}
        <section className="border-t border-border/30 pt-8">
          <div className="flex flex-wrap gap-4 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About Frosh
            </Link>
            <Link to="/post" className="text-muted-foreground hover:text-primary transition-colors">
              Create a post
            </Link>
            <Link to="/download" className="text-muted-foreground hover:text-primary transition-colors">
              Download Frosh
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Founder;
