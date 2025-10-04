import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import SharedNavigation from "@/components/layout/SharedNavigation";
import { SEO } from "@/components/seo/SEO";

// Blog post type definition
interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  image?: string;
}

// Sample blog posts (can be moved to a separate data file)
const blogPosts: Record<string, BlogPost> = {
  "how-to-meet-classmates-harvard": {
    slug: "how-to-meet-classmates-harvard",
    title: "How to Meet Your Freshman Class at Harvard Before Orientation",
    description: "Discover the best ways to connect with Harvard Class of 2030 students before stepping foot on campus. Tips for finding roommates, joining group chats, and building friendships.",
    content: `
# How to Meet Your Freshman Class at Harvard Before Orientation

Starting college at Harvard is an exciting journey, but it can also feel overwhelming. The good news? You don't have to wait until orientation to start making connections.

## Why Connect Early?

Meeting your classmates before you arrive on campus can:
- Reduce first-day anxiety
- Help you find compatible roommates
- Build a support network early
- Make orientation week less overwhelming

## Best Ways to Connect

### 1. Use Frosh to Find Your People
Frosh is specifically designed for incoming freshmen to meet each other. You can:
- Browse verified Harvard Class of 2030 profiles
- Find potential roommates with similar interests
- Join study groups for your intended major
- Connect with students from your hometown

### 2. Join Official Harvard Groups
Look for official Harvard Class of 2030 Facebook groups and GroupMe chats. These are great for:
- Getting official updates
- Asking questions about campus life
- Finding event information

### 3. Attend Virtual Pre-Orientation Events
Harvard often hosts virtual events for admitted students. Don't skip these!

## Tips for Success

- **Be authentic**: Share your genuine interests and goals
- **Stay safe**: Only share personal contact info when you're comfortable
- **Be inclusive**: Reach out to different types of people
- **Follow up**: If you connect with someone, keep the conversation going

## Final Thoughts

Remember, everyone is in the same boat. Most freshmen are eager to make friends and connections. Don't be shy about reaching out!

Ready to start connecting with your Harvard classmates? Join Frosh today and find your college community.
    `,
    author: "Frosh Team",
    date: "2025-01-15",
    tags: ["harvard", "freshman tips", "college networking", "roommate finder"]
  },
  "best-college-roommate-finder": {
    slug: "best-college-roommate-finder",
    title: "Best Way to Find College Roommates for Class of 2030",
    description: "Complete guide to finding the perfect college roommate. Learn what to look for, questions to ask, and how to use roommate finder apps effectively.",
    content: `
# Best Way to Find College Roommates for Class of 2030

Finding the right roommate can make or break your college experience. Here's everything you need to know.

## What Makes a Good Roommate?

### Compatibility Factors
- Sleep schedule alignment
- Study habits and noise tolerance
- Cleanliness standards
- Social preferences
- Lifestyle choices

## Where to Find Roommates

### 1. Roommate Finder Apps
Use dedicated platforms like Frosh that:
- Verify student status
- Match based on compatibility
- Provide safe messaging
- Allow profile browsing

### 2. School Facebook Groups
Many schools have official roommate finder groups.

### 3. Orientation Events
Attend pre-orientation meetups to meet potential roommates in person.

## Questions to Ask Potential Roommates

Before committing, discuss:
1. What's your typical sleep schedule?
2. How clean do you like to keep your space?
3. Do you prefer to study in the room or elsewhere?
4. How often do you have guests over?
5. What are your pet peeves?
6. How do you handle conflicts?

## Red Flags to Watch For

Be cautious if someone:
- Refuses to answer important questions
- Has unrealistic expectations
- Doesn't respect boundaries
- Seems dismissive of your concerns

## Making It Work

Once you've found a roommate:
- Set clear expectations early
- Create a roommate agreement
- Communicate openly
- Give each other space
- Address issues promptly

## Using Frosh to Find Roommates

Frosh makes roommate matching easy:
- Filter by lifestyle preferences
- See compatibility scores
- Message verified students safely
- Join group chats with potential roommate groups

Ready to find your perfect college roommate? Start your search on Frosh today.
    `,
    author: "Frosh Team",
    date: "2025-01-10",
    tags: ["roommate finder", "college life", "freshman advice", "dorm life"]
  }
};

const BlogTemplate = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  
  const post = slug ? blogPosts[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <Button onClick={() => navigate('/blog')}>
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={post.title}
        description={post.description}
        keywords={post.tags.join(", ")}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.description,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "datePublished": post.date,
          "publisher": {
            "@type": "Organization",
            "name": "Frosh",
            "logo": {
              "@type": "ImageObject",
              "url": "https://frosh.app/lovable-uploads/fresh_meat_app_icon.png"
            }
          }
        }}
      />
      
      <SharedNavigation />

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/blog')} 
          className="mb-8 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Blog</span>
        </Button>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <Card className="bg-card/50 border-border/40">
          <CardContent className="p-8 md:p-12">
            <div 
              className="prose prose-lg max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
            />
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ready to Connect with Your Class?
              </h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of Class of 2030 students on Frosh
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/community')}
                className="bg-primary hover:bg-primary/90"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </article>
    </div>
  );
};

export default BlogTemplate;
