import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink, UserPlus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface StudentPost {
  id: string;
  name: string | null;
  username: string;
  bio: string | null;
  class_year: string;
  image_urls: string[];
  instagram_post_link: string | null;
  created_at: string;
}

interface StudentPostsProps {
  schoolSlug: string;
  schoolName: string;
  instagramHandle?: string;
}

const StudentPostCard: React.FC<{
  post: StudentPost;
  instagramHandle?: string;
}> = ({ post, instagramHandle }) => {
  const isMobile = useIsMobile();

  return (
    <Card className="bg-card/50 border-border/30 rounded-2xl overflow-hidden hover:border-border/60 transition-all duration-200">
      {/* Photo Gallery */}
      <div className="space-y-1.5 p-1.5">
        {isMobile ? (
          // Mobile: stacked vertical
          post.image_urls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`${post.name || post.username} photo ${i + 1}`}
              className="w-full rounded-xl object-cover"
              loading="lazy"
            />
          ))
        ) : (
          // Desktop: hero + grid
          <>
            {post.image_urls[0] && (
              <img
                src={post.image_urls[0]}
                alt={`${post.name || post.username} photo 1`}
                className="w-full aspect-[4/3] rounded-xl object-cover"
                loading="lazy"
              />
            )}
            {post.image_urls.length > 1 && (
              <div className="grid grid-cols-3 gap-1.5">
                {post.image_urls.slice(1).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`${post.name || post.username} photo ${i + 2}`}
                    className="w-full aspect-square rounded-lg object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CardContent className="px-5 pb-5 pt-4 space-y-3">
        {/* Name */}
        {post.name && (
          <h3 className="text-lg font-bold text-foreground">{post.name}</h3>
        )}

        {/* Bio */}
        {post.bio && (
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            {post.bio}
          </p>
        )}

        {/* Instagram handle */}
        <a
          href={`https://instagram.com/${post.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm font-semibold transition-colors mt-1"
        >
          <Instagram className="h-4 w-4" />
          @{post.username}
        </a>

        {/* Post link button */}
        {instagramHandle && (
          post.instagram_post_link ? (
            <Button
              onClick={() => window.open(post.instagram_post_link!, '_blank')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              size="sm"
            >
              <Instagram className="h-4 w-4 mr-2" />
              See post on @{instagramHandle}
              <ExternalLink className="h-3 w-3 ml-1.5 opacity-60" />
            </Button>
          ) : (
            <Button
              disabled
              className="w-full rounded-xl opacity-50"
              variant="outline"
              size="sm"
            >
              Post coming soon
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
};

const StudentPosts: React.FC<StudentPostsProps> = ({ schoolSlug, schoolName, instagramHandle }) => {
  const [posts, setPosts] = useState<StudentPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('school_slug', schoolSlug)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts((data || []) as unknown as StudentPost[]);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [schoolSlug]);

  const getGridClass = () => {
    if (posts.length === 0) return '';
    if (posts.length === 1) return 'max-w-md mx-auto';
    if (posts.length === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto';
    if (posts.length <= 4) return 'grid grid-cols-1 md:grid-cols-2 gap-6';
    if (posts.length <= 8) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  };

  return (
    <section id="student-posts" className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Student Posts</h2>
          <p className="text-muted-foreground">Meet students from the incoming Class of 2030</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          // Case 1 — Empty state
          <Card className="bg-card/50 border-border/30 rounded-2xl max-w-md mx-auto">
            <CardContent className="py-14 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <p className="text-foreground font-semibold text-lg mb-2">No students have posted yet</p>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                Be one of the first students from the Class of 2030 to introduce yourself.
              </p>
              <Button
                onClick={() => navigate('/post')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Post your profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Case 2 & 3 — Posts grid
          <div className={getGridClass()}>
            {posts.map(post => (
              <StudentPostCard
                key={post.id}
                post={post}
                instagramHandle={instagramHandle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentPosts;
