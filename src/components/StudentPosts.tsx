import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink, UserPlus, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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

// Minimal preview card — cover image only
const PostPreviewCard: React.FC<{
  post: StudentPost;
  onClick: () => void;
}> = ({ post, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer group rounded-2xl overflow-hidden border border-border/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
  >
    <div className="relative aspect-[3/4]">
      <img
        src={post.image_urls[0]}
        alt={post.name || post.username}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {/* Subtle name overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pt-12">
        <p className="text-white font-semibold text-sm truncate">
          {post.name || `@${post.username}`}
        </p>
      </div>
    </div>
  </div>
);

// Expanded modal view
const PostDetailModal: React.FC<{
  post: StudentPost | null;
  open: boolean;
  onClose: () => void;
  instagramHandle?: string;
}> = ({ post, open, onClose, instagramHandle }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    setCurrentImage(0);
  }, [post?.id]);

  if (!post) return null;

  const prevImage = () => setCurrentImage(i => (i > 0 ? i - 1 : post.image_urls.length - 1));
  const nextImage = () => setCurrentImage(i => (i < post.image_urls.length - 1 ? i + 1 : 0));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 bg-card border-border/30 overflow-hidden gap-0">
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} h-full max-h-[90vh]`}>
          {/* Left — Image gallery */}
          <div className={`relative bg-black ${isMobile ? 'w-full aspect-[3/4] max-h-[50vh]' : 'w-3/5 min-h-[500px]'} flex-shrink-0`}>
            <img
              src={post.image_urls[currentImage]}
              alt={`${post.name || post.username} photo ${currentImage + 1}`}
              className="w-full h-full object-contain"
            />
            {post.image_urls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                {/* Dots */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                  {post.image_urls.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? 'bg-white scale-110' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right — Info */}
          <div className={`${isMobile ? 'w-full' : 'w-2/5'} p-6 overflow-y-auto space-y-5`}>
            {post.name && (
              <h2 className="text-2xl font-bold text-foreground">{post.name}</h2>
            )}
            <p className="text-sm text-muted-foreground font-medium">{post.class_year}</p>

            {post.bio && (
              <p className="text-muted-foreground text-sm leading-relaxed">{post.bio}</p>
            )}

            <a
              href={`https://instagram.com/${post.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
            >
              <Instagram className="h-4 w-4" />
              @{post.username}
            </a>

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
                <Button disabled className="w-full rounded-xl opacity-50" variant="outline" size="sm">
                  Post coming soon
                </Button>
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StudentPosts: React.FC<StudentPostsProps> = ({ schoolSlug, schoolName, instagramHandle }) => {
  const [posts, setPosts] = useState<StudentPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<StudentPost | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
        const fetchedPosts = (data || []) as unknown as StudentPost[];
        setPosts(fetchedPosts);

        // Deep-link: open a specific post if ?post= is present
        const postId = searchParams.get('post');
        if (postId && fetchedPosts.length > 0) {
          const target = fetchedPosts.find(p => p.id === postId);
          if (target) {
            setSelectedPost(target);
            // Clean URL after opening
            searchParams.delete('post');
            setSearchParams(searchParams, { replace: true });
          }
        }
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
    if (posts.length === 1) return 'grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto';
    if (posts.length === 2) return 'grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto';
    if (posts.length <= 4) return 'grid grid-cols-2 md:grid-cols-3 gap-4';
    return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
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
          <div className={getGridClass()}>
            {posts.map(post => (
              <PostPreviewCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        )}
      </div>

      <PostDetailModal
        post={selectedPost}
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        instagramHandle={instagramHandle}
      />
    </section>
  );
};

export default StudentPosts;
