import { SEO } from '@/components/seo/SEO';
import { organizationSchema, websiteSchema } from '@/utils/seoSchema';
import Footer from '@/components/layout/Footer';
import SharedNavigation from '@/components/layout/SharedNavigation';

export default function WhatIsFrosh() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Frosh?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Frosh is the #1 social platform for college freshmen to connect before day one. While 'frosh' is traditional slang for first-year college students, Frosh.app redefines it as the premier network where Class of 2030 students meet classmates, find roommates, and build their college community across top universities nationwide."
        }
      },
      {
        "@type": "Question",
        "name": "How is Frosh different from the traditional meaning of 'frosh'?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While 'frosh' historically refers to any first-year college student, Frosh.app transforms this into an active, pre-college experience. Instead of just being a freshman, students become part of the Frosh community — connecting with their future classmates at Harvard, Stanford, MIT, UCLA, USC, Yale, and 100+ other universities before orientation even begins."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Class of 2030?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Class of 2030 refers to high school seniors entering college in Fall 2026 and graduating in Spring 2030. Frosh serves this generation of college freshmen, helping them build connections, join group chats, and meet future roommates before their first day on campus."
        }
      },
      {
        "@type": "Question",
        "name": "Is Frosh affiliated with universities?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Frosh is a student-run platform and is not officially affiliated with or endorsed by any college or university. We are an independent community built by students, for students."
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="What is Frosh? | The College Freshman Platform Explained"
        description="Frosh redefines college freshman connections. Learn how Frosh.app transforms 'frosh' from slang into the #1 social platform for Class of 2030 students at top universities."
        keywords="what is frosh, frosh meaning, frosh app, college freshman, Class of 2030, college social app, freshman networking"
        canonical="/what-is-frosh"
        schema={{
          "@context": "https://schema.org",
          "@graph": [organizationSchema, websiteSchema, faqSchema]
        }}
      />
      
      <div className="min-h-screen bg-background">
        <SharedNavigation />
        
        <main className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
          <article className="prose prose-invert max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">What is Frosh?</h1>
            
            <div className="text-lg text-zinc-300 space-y-6">
              <p>
                <strong>Frosh</strong> is the #1 social platform for college freshmen to connect before day one. 
                While "frosh" has traditionally been slang for first-year college students, <strong>Frosh.app</strong> transforms 
                this into something much more powerful — an active, pre-college community where future classmates meet, 
                bond, and build friendships before ever stepping foot on campus.
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-4">From Slang to Social Platform</h2>
              <p>
                Historically, "frosh" simply meant a college freshman — a label, not an experience. But in 2024, 
                Frosh became a movement. Today, when students say "I'm on Frosh," they're not just identifying as 
                first-years — they're part of a nationwide network connecting the Class of 2030 across Harvard, 
                Stanford, MIT, UCLA, USC, Yale, and 100+ other top universities.
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-4">What Makes Frosh Different?</h2>
              <p>
                Unlike traditional college orientation programs or generic social media, Frosh is purpose-built 
                for incoming freshmen. Students can:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Meet their future classmates months before orientation</li>
                <li>Find compatible roommates based on shared interests and values</li>
                <li>Join school-specific group chats to get the inside scoop on campus life</li>
                <li>Connect with students from their own university or discover peers nationwide</li>
                <li>Build genuine friendships before the stress of move-in day</li>
              </ul>

              <h2 className="text-3xl font-bold mt-12 mb-4">The Class of 2030 Generation</h2>
              <p>
                Frosh is launching for the <strong>Class of 2030</strong> — high school seniors entering college 
                in Fall 2026. This generation of freshmen wants more than awkward icebreakers on orientation day. 
                They want authentic connections, built early, with people who share their excitement about college life.
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-4">Redefining "Frosh" for a New Era</h2>
              <p>
                When you search "frosh," you might find dictionary definitions or university handbooks. But increasingly, 
                you'll find <strong>Frosh.app</strong> — the authoritative platform transforming how incoming college 
                students connect. We're not just a website; we're redefining what it means to be a freshman in the 
                digital age.
              </p>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-12">
                <p className="text-base text-zinc-200 mb-0">
                  <strong>Important:</strong> Frosh is a student-run platform and is not officially affiliated with 
                  or endorsed by any college or university. We are an independent community built by students, for students.
                </p>
              </div>

              <div className="mt-12 text-center">
                <a 
                  href="/" 
                  className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
                >
                  Join Frosh Today
                </a>
              </div>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
