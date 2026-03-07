import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import FroshLogo from '@/components/ui/FroshLogo';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SmartSchoolSearch } from '@/components/SmartSchoolSearch';
import { School } from '@/data/schools';
const Download = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Check if there's a referrer from a school page
    const referrer = (location.state as any)?.from;
    if (referrer) {
      navigate(referrer);
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/community');
    }
  };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedSchool) return;
    if (!email.trim()) {
      toast.error('Please enter your email to join the waitlist.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('waitlist_signups').insert({
        name: name.trim(),
        school: selectedSchool.name,
        email: email.trim() || null,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Download Frosh – Meet Your Classmates Before College"
        description="Download the Frosh app to meet classmates, find friends, and start chatting before move-in day. Coming soon to the App Store."
        canonical="/download"
        noindex={false}
      />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <FroshLogo size="sm" onClick={() => navigate('/')} />
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center py-16 md:py-24">
        <div className="max-w-lg mx-auto px-5 text-center">
          <div className="flex justify-center mb-8">
            <FroshLogo size="lg" className="!h-[130px] !w-auto" />
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Download Frosh
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Frosh is launching soon. Be the first to join your class.
          </p>

          {/* App Store Placeholder */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <button
              disabled
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-card border border-border/40 opacity-50 cursor-not-allowed"
            >
              <svg className="w-7 h-7 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground leading-tight">Download on the</div>
                <div className="text-sm font-semibold text-foreground">App Store</div>
              </div>
            </button>

            <button
              disabled
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-card border border-border/40 opacity-50 cursor-not-allowed"
            >
              <svg className="w-7 h-7 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.86L14.44 12.56 3.18.14c-.2-.23-.04-.55.27-.55H4.9l12.37 12.17c.28.27.28.72 0 1L4.9 24.93H3.45c-.31 0-.47-.32-.27-.55v-1.52z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground leading-tight">GET IT ON</div>
                <div className="text-sm font-semibold text-foreground">Google Play</div>
              </div>
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-8">Coming soon to the App Store.</p>

          {/* Waitlist form */}
          {!submitted ? (
            <form onSubmit={handleJoinWaitlist} className="flex flex-col gap-3 max-w-sm mx-auto">
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-full px-5 bg-card border-border/40"
              />
              <SmartSchoolSearch
                onSelect={(school) => setSelectedSchool(school)}
                selectedSchool={selectedSchool}
                placeholder="Search for your school…"
                className="text-left"
              />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-full px-5 bg-card border-border/40"
              />
              <Button
                type="submit"
                disabled={loading}
                className="rounded-full px-6 bg-primary hover:bg-primary/90 font-semibold whitespace-nowrap"
              >
                {loading ? 'Joining...' : 'Join the Waitlist'}
              </Button>
            </form>
          ) : (
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 max-w-sm mx-auto">
              <p className="text-primary font-semibold">You're on the list! 🎉</p>
              <p className="text-sm text-muted-foreground mt-1">We'll notify you when Frosh launches.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Download;
