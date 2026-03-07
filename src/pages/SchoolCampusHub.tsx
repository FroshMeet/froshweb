import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Building2,
  GraduationCap,
  MessageCircle,
  Smartphone,
  UserPlus,
} from "lucide-react";
import { schools } from "@/data/schools";
import { getSchoolByApprovedSlug, getApprovedSchoolData, getCorrectSchoolSlug } from "@/utils/schoolNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { getSchoolLogo } from "@/utils/schoolLogos";
import { getSchoolImageUrl, hasSchoolImage } from "@/utils/schoolImages";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APPROVED_SCHOOLS } from "@/config/approvedSchools";
import { SchoolPageSEO } from "@/components/seo/SchoolPageSEO";
import StudentPosts from "@/components/StudentPosts";

const SCHOOL_METADATA: Record<string, { location?: string; type?: string; size?: string }> = {
  'harvard': { location: 'Cambridge, MA', type: 'Private', size: '~7,000 undergrads' },
  'stanford': { location: 'Stanford, CA', type: 'Private', size: '~8,000 undergrads' },
  'mit': { location: 'Cambridge, MA', type: 'Private', size: '~4,500 undergrads' },
  'ucla': { location: 'Los Angeles, CA', type: 'Public', size: '~32,000 undergrads' },
  'ucberkeley': { location: 'Berkeley, CA', type: 'Public', size: '~31,000 undergrads' },
  'usc': { location: 'Los Angeles, CA', type: 'Private', size: '~21,000 undergrads' },
  'nyu': { location: 'New York, NY', type: 'Private', size: '~28,000 undergrads' },
  'columbia': { location: 'New York, NY', type: 'Private', size: '~8,000 undergrads' },
  'yale': { location: 'New Haven, CT', type: 'Private', size: '~6,500 undergrads' },
  'princeton': { location: 'Princeton, NJ', type: 'Private', size: '~5,500 undergrads' },
  'upenn': { location: 'Philadelphia, PA', type: 'Private', size: '~10,000 undergrads' },
  'duke': { location: 'Durham, NC', type: 'Private', size: '~6,700 undergrads' },
  'northwestern': { location: 'Evanston, IL', type: 'Private', size: '~8,500 undergrads' },
  'umich': { location: 'Ann Arbor, MI', type: 'Public', size: '~32,000 undergrads' },
};

export default function SchoolCampusHub() {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const schoolData = getSchoolByApprovedSlug(school as string);
  const approvedSchool = schoolData ? getApprovedSchoolData(schoolData) : null;
  const schoolName = (schoolData ? (schoolData.shortName || schoolData.name) : '') ||
                    approvedSchool?.displayName ||
                    school || '';
  const instagramHandle = approvedSchool?.instagramUsername;
  const schoolLogo = getSchoolLogo(schoolName || school || '');
  const schoolMeta = SCHOOL_METADATA[school || ''];

  const handleGetFeatured = () => navigate(`/${school}/post`);

  const handleSchoolSwitch = (schoolSlug: string) => {
    if (schoolSlug && schoolSlug !== school) {
      navigate(`/${schoolSlug}`);
    }
  };

  const handleSendSMSLink = () => {
    if (!phoneNumber) return;
    toast({ title: "SMS Sent! 📱", description: "Check your phone for the FroshMeet app link." });
    setShowPhoneModal(false);
    setPhoneNumber("");
  };

  if (!approvedSchool && school) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-foreground mb-4">School Not Found</h1>
          <p className="text-muted-foreground mb-6">"{school}" is not available on Frosh yet.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-background">
        <SchoolPageSEO schoolName={schoolName} schoolSlug={school || ''} />
        <SchoolPageSEO schoolName={schoolName} schoolSlug={school || ''} />
        <h1 className="sr-only">Meet the {schoolName} Class of 2030</h1>

        {/* Top Navigation */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate('/community')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Schools
            </Button>
            <Select value={school || ""} onValueChange={handleSchoolSwitch}>
              <SelectTrigger className="w-[180px] bg-muted/30 border-border/40">
                <SelectValue placeholder="Switch school..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/40 max-h-[300px]">
                {schools.map((schoolOption) => {
                  const approvedSchoolData = APPROVED_SCHOOLS[schoolOption.id];
                  if (!approvedSchoolData) return null;
                  return (
                    <SelectItem key={schoolOption.id} value={schoolOption.id}>
                      {schoolOption.shortName || schoolOption.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-16 md:py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="mb-6 flex justify-center">
              {schoolData && hasSchoolImage(schoolData.id) ? (
                <img
                  src={getSchoolImageUrl(schoolData.id)!}
                  alt={`${schoolName} profile`}
                  className="h-40 w-40 md:h-48 md:w-48 rounded-2xl object-cover shadow-lg border border-primary/20"
                />
              ) : (
                <div className={`h-40 w-40 md:h-48 md:w-48 bg-gradient-to-br ${schoolLogo} rounded-2xl flex items-center justify-center shadow-lg border border-primary/20`}>
                  <span className="text-5xl md:text-6xl font-bold text-foreground drop-shadow-lg">
                    {schoolName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-foreground mb-3 tracking-tight">{schoolName}</h2>
            <Badge variant="outline" className="text-primary border-primary/30 px-4 py-1.5 text-sm font-semibold mb-4">
              Class of 2030
            </Badge>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Your incoming Class of 2030 community at {schoolName}
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleGetFeatured}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 rounded-full font-semibold shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 gap-2"
              >
                <UserPlus className="h-5 w-5" />
                Post to {schoolName}
                <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-white text-primary animate-[fade-scale-in_0.5s_ease-out_0.3s_both] shadow-sm">
                  FREE
                </span>
              </Button>
              <Button
                onClick={() => navigate('/download', { state: { from: `/${school}` } })}
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-foreground hover:bg-white/10 px-8 rounded-full font-semibold hover:-translate-y-0.5 transition-all duration-200"
              >
                Download App
              </Button>
            </div>
          </div>
        </section>

        {/* Student Posts — immediately after hero */}
        <StudentPosts schoolSlug={school || ''} schoolName={schoolName} instagramHandle={instagramHandle} />

        {/* Groups & Chats */}
        <section className="py-12 px-4 bg-muted/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Groups & Chats</h2>
              <p className="text-muted-foreground">Connect with your class community.</p>
            </div>

            <Card className="bg-card/30 border-border/30 rounded-2xl">
              <CardContent className="py-10 text-center">
                <MessageCircle className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">
                  Groups & Chats for {schoolName} will be available on the Frosh mobile app.
                </p>
                <p className="text-muted-foreground text-sm mb-6">
                  Join group chats, meet classmates, and connect before arriving on campus.
                </p>
                <Button
                  onClick={() => navigate('/download')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Download the App
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About School */}
        {schoolMeta && (
          <section className="py-8 px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-card/30 border-border/30 rounded-2xl">
                <CardContent className="py-6 px-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">About {schoolName}</h3>
                  <div className="flex flex-wrap gap-6 text-sm">
                    {schoolMeta.location && (
                      <div className="flex items-center gap-2 text-foreground/80">
                        <MapPin className="h-4 w-4 text-primary/70" />
                        {schoolMeta.location}
                      </div>
                    )}
                    {schoolMeta.type && (
                      <div className="flex items-center gap-2 text-foreground/80">
                        <Building2 className="h-4 w-4 text-primary/70" />
                        {schoolMeta.type}
                      </div>
                    )}
                    {schoolMeta.size && (
                      <div className="flex items-center gap-2 text-foreground/80">
                        <GraduationCap className="h-4 w-4 text-primary/70" />
                        {schoolMeta.size}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Different School Switcher */}
        <section className="py-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <p className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-widest">Different School?</p>
            <Select onValueChange={(slug) => navigate(`/${slug}`)}>
              <SelectTrigger className="w-full rounded-full border-border/40 bg-card/50 text-foreground h-14 text-base font-medium px-6">
                <SelectValue placeholder="Switch to another school" />
              </SelectTrigger>
              <SelectContent className="max-h-64 bg-card border-border/40 rounded-2xl">
                {schools
                  .filter(s => getCorrectSchoolSlug(s) !== school)
                  .map(s => {
                    const slug = getCorrectSchoolSlug(s);
                    return (
                      <SelectItem key={slug} value={slug} className="text-foreground hover:bg-primary/10 cursor-pointer">
                        {s.shortName || s.name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Phone Modal */}
        {showPhoneModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-card border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Get the App Link</h3>
                <p className="text-muted-foreground mb-6 text-sm">Enter your phone number and we'll text you a link to download Frosh.</p>
                <div className="space-y-4">
                  <Input placeholder="(555) 123-4567" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="text-lg" />
                  <div className="flex gap-3">
                    <Button onClick={handleSendSMSLink} className="flex-1 bg-primary hover:bg-primary/90" disabled={!phoneNumber}>Send Link</Button>
                    <Button variant="outline" onClick={() => setShowPhoneModal(false)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
  );
}
