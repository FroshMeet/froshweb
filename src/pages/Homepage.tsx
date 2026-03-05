import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Search, ArrowRight, Linkedin } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import { organizationSchema, websiteSchema, mobileAppSchema } from '@/utils/seoSchema';
import phoneMockup from '@/assets/phone-mockup-launch.png';
import FroshLogo from '@/components/ui/FroshLogo';

const UNIVERSITIES = [
  'Stanford', 'USC', 'UCLA', 'Michigan', 'Georgia', 'NYU',
  'UT Austin', 'Ohio State', 'Arizona State', 'Florida',
  'Harvard', 'MIT', 'Duke', 'UPenn', 'Cornell', 'Berkeley',
  'Northwestern', 'Vanderbilt', 'UNC', 'Virginia',
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
          <Button
            onClick={() => navigate('/download')}
            className="rounded-full px-6 py-2.5 text-sm font-semibold bg-primary hover:bg-primary/90"
          >
            Get Frosh
          </Button>
        </div>
      </header>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-primary/10" />
          <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full blur-[100px] bg-primary/5" />
        </div>

        <div className="max-w-6xl mx-auto px-5 pt-16 pb-20 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-12 items-center">
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
            <img
              src={phoneMockup}
              alt="Frosh App showing student profiles and chat"
              width="420"
              height="840"
              fetchPriority="high"
              className="w-[320px] sm:w-[380px] lg:w-[420px] object-contain drop-shadow-2xl animate-float"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════ SOCIAL PROOF ═══════════════════ */}
      <section className="py-16 md:py-20 border-t border-border/20">
        <RevealSection>
          <div className="max-w-5xl mx-auto px-5 text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-8">
              Students from 100+ universities are joining Frosh
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              {UNIVERSITIES.map((uni) => (
                <span
                  key={uni}
                  className="text-sm md:text-base font-medium text-foreground/70 hover:text-primary transition-colors"
                >
                  {uni}
                </span>
              ))}
            </div>
          </div>
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
                  desc: 'See who's attending your school and start conversations early.',
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

      {/* ═══════════════════ PHONE PREVIEW ═══════════════════ */}
      <section className="py-20 md:py-28 border-t border-border/20">
        <RevealSection>
          <div className="max-w-4xl mx-auto px-5 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              See Frosh in action
            </h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
              Student profiles, chat, and school communities — all in one app.
            </p>
            <div className="flex justify-center">
              <img
                src={phoneMockup}
                alt="Frosh app interface showing profiles, chat, and school communities"
                width="400"
                height="800"
                loading="lazy"
                className="w-[280px] sm:w-[340px] lg:w-[400px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ═══════════════════ FOUNDER ═══════════════════ */}
      <section className="py-20 md:py-28 border-t border-border/20">
        <RevealSection>
          <div className="max-w-4xl mx-auto px-5">
            <div className="grid md:grid-cols-[200px_1fr] gap-10 items-start">
              <div className="flex justify-center md:justify-start">
                <img
                  src="/kian-habibi-founder-frosh.jpg"
                  alt="Kian Habibi founder of Frosh"
                  width="180"
                  height="180"
                  loading="lazy"
                  className="w-40 h-40 md:w-44 md:h-44 rounded-2xl object-cover border border-border/30"
                />
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-3">
                  About the founder
                </p>
                <p className="text-foreground text-lg leading-relaxed">
                  Hi, I'm <strong>Kian</strong>. I built Frosh to make it easier for incoming college students
                  to meet their classmates before arriving on campus. Starting college can be overwhelming,
                  and I wanted a way for people to find friends before they even step on campus.
                </p>
                <p className="mt-4 text-muted-foreground italic">— Kian</p>
                <a
                  href="https://linkedin.com/in/kianhabibi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  Connect with Kian on LinkedIn
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
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
