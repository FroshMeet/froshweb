import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Search, ArrowRight, Menu } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import { organizationSchema, websiteSchema, mobileAppSchema } from '@/utils/seoSchema';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import froshLogo from '@/assets/frosh-logo-new.png';
import FroshLogo from '@/components/ui/FroshLogo';
import { SwipeableSchoolCarousel } from '@/components/SwipeableSchoolCarousel';

const CAROUSEL_SCHOOLS = [
  { name: 'Stanford University', slug: 'stanford', acronym: 'Stanford' },
  { name: 'University of Southern California', slug: 'usc', acronym: 'USC' },
  { name: 'University of California, Los Angeles', slug: 'ucla', acronym: 'UCLA' },
  { name: 'UC Berkeley', slug: 'ucberkeley', acronym: 'Berkeley' },
  { name: 'Arizona State University', slug: 'asu', acronym: 'ASU' },
  { name: 'New York University', slug: 'nyu', acronym: 'NYU' },
  { name: 'Princeton University', slug: 'princeton', acronym: 'Princeton' },
  { name: 'Columbia University', slug: 'columbia', acronym: 'Columbia' },
  { name: 'Massachusetts Institute of Technology', slug: 'mit', acronym: 'MIT' },
  { name: 'Duke University', slug: 'duke', acronym: 'Duke' },
  { name: 'University of Pennsylvania', slug: 'upenn', acronym: 'UPenn' },
  { name: 'University of Michigan', slug: 'umich', acronym: 'Michigan' },
  { name: 'Harvard University', slug: 'harvard', acronym: 'Harvard' },
  { name: 'Cornell University', slug: 'cornell', acronym: 'Cornell' },
  { name: 'Northwestern University', slug: 'northwestern', acronym: 'Northwestern' },
  { name: 'University of Georgia', slug: 'uga', acronym: 'Georgia' },
  { name: 'University of Texas at Austin', slug: 'utaustin', acronym: 'UT Austin' },
  { name: 'Ohio State University', slug: 'ohiostate', acronym: 'Ohio State' },
  { name: 'University of Florida', slug: 'uf', acronym: 'Florida' },
  { name: 'Vanderbilt University', slug: 'vanderbilt', acronym: 'Vanderbilt' },
  { name: 'University of North Carolina', slug: 'unc', acronym: 'UNC' },
  { name: 'University of Virginia', slug: 'uva', acronym: 'Virginia' },
  { name: 'Yale University', slug: 'yale', acronym: 'Yale' },
  { name: 'University of Wisconsin', slug: 'uwmadison', acronym: 'Wisconsin' },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-8');
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
}

const Homepage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
        title="Frosh – Meet Your Classmates Before College"
        description="Frosh is the social app for incoming college freshmen. Meet classmates, find friends, and start chatting before move-in day."
        keywords="frosh, college app, meet classmates, incoming freshmen, college social app, find roommates, Class of 2030"
        canonical="/"
        schema={{
          "@context": "https://schema.org",
          "@graph": [organizationSchema, websiteSchema, mobileAppSchema, personSchema]
        }}
      />

      {/* ─── Minimal Nav ─── */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <FroshLogo size="sm" onClick={() => navigate('/')} />

          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Features', href: '/features' },
              { label: 'Community', href: '/community' },
              { label: 'Contact', href: '/contact' },
              { label: 'About', href: '/about' },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-background border-border/30">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <nav className="flex flex-col gap-1 mt-8">
                  {[
                    { label: 'Features', href: '/features' },
                    { label: 'Community', href: '/community' },
                    { label: 'Contact', href: '/contact' },
                    { label: 'About', href: '/about' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Button
              onClick={() => navigate('/download')}
              className="rounded-full px-6 py-2.5 text-sm font-semibold bg-primary hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Frosh
            </Button>
          </div>
        </div>
      </header>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-primary/10" />
          <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full blur-[100px] bg-primary/5" />
        </div>

        <div className="max-w-6xl mx-auto px-5 pt-24 pb-32 md:pt-32 md:pb-44 grid md:grid-cols-2 gap-12 items-center min-h-[85vh]">
          <div className="animate-fade-in">
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight">
              Meet your future classmates{' '}
              <span className="text-primary">before college.</span>
            </h1>
            <p className="mt-5 text-muted-foreground text-lg md:text-xl max-w-lg leading-relaxed">
              Frosh helps incoming freshmen connect with verified students from their university before move-in day.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate('/download')}
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                Get Frosh
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="w-[280px] sm:w-[340px] lg:w-[400px] aspect-square rounded-2xl border-[3px] border-white/30 bg-card/30 backdrop-blur-sm flex items-center justify-center shadow-2xl">
              <img
                src={froshLogo}
                alt="Frosh logo"
                width="340"
                height="340"
                fetchPriority="high"
                decoding="async"
                className="w-[85%] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FREE POST CTA ═══════════════════ */}
      <section className="py-16 md:py-20 border-t border-border/20">
        <RevealSection>
          <div className="max-w-3xl mx-auto px-5 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Meet your future classmates before college starts
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-8">
              Students across 100+ universities are posting profiles and connecting early.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate('/post')}
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                Post your profile for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate('/community')}
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-base font-semibold border-border/40"
              >
                Browse schools
              </Button>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ═══════════════════ SOCIAL PROOF CAROUSEL ═══════════════════ */}
      <section className="py-16 md:py-20 border-t border-border/20">
        <RevealSection>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-10 text-center">
            Students from 100+ universities are joining Frosh
          </p>
          <SwipeableSchoolCarousel
            schools={CAROUSEL_SCHOOLS}
            onSchoolSelect={(name, slug) => navigate(`/${slug}`)}
          />
        </RevealSection>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-20 md:py-28">
        <RevealSection>
          <div className="max-w-5xl mx-auto px-5">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">
              How Frosh works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  icon: Search,
                  title: 'Meet your class',
                  desc: 'Browse verified students from your university and connect before the semester begins.',
                },
                {
                  icon: Users,
                  title: 'Find friends & roommates',
                  desc: 'See who\u2019s attending your school and start conversations early.',
                },
                {
                  icon: MessageCircle,
                  title: 'Start chatting instantly',
                  desc: 'Join group chats and meet your future friends before move-in day.',
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="text-center md:text-left space-y-4 p-6 rounded-2xl border border-border/20 bg-card/40 hover:bg-card/60 transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                    <f.icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-card/80" />
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] rounded-full blur-[140px] bg-primary/8" />
        </div>
        <RevealSection className="relative z-10">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-5">
              Start meeting your class today.
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-xl mx-auto">
              Download Frosh and connect with your classmates before move-in day.
            </p>
            <Button
              onClick={() => navigate('/download')}
              size="lg"
              className="rounded-full px-10 py-6 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
            >
              Get Frosh
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </RevealSection>
      </section>
    </div>
  );
};

export default Homepage;
