
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, HelpCircle, Megaphone, Heart, MessageSquare, Clock } from "lucide-react";

const CommunityBoard = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const mockPosts = [
    {
      id: 1,
      type: "event",
      title: "Freshman Welcome Mixer",
      content: "Join us for pizza, games, and meeting new friends! This Friday at 7PM in the Student Union.",
      author: "Student Activities",
      time: "2 hours ago",
      likes: 24,
      comments: 8,
      tags: ["social", "food", "freshman"]
    },
    {
      id: 2,
      type: "question",
      title: "Best study spots on campus?",
      content: "Looking for quiet places to study between classes. Library gets too crowded. Any recommendations?",
      author: "Maya P.",
      time: "4 hours ago",
      likes: 12,
      comments: 15,
      tags: ["study", "campus"]
    },
    {
      id: 3,
      type: "club",
      title: "Photography Club Recruiting!",
      content: "Love taking photos? Join our photography club! We do campus shoots, photo walks, and workshops. All skill levels welcome!",
      author: "Photo Club President",
      time: "1 day ago",
      likes: 18,
      comments: 6,
      tags: ["club", "photography", "creative"]
    },
    {
      id: 4,
      type: "event",
      title: "Intramural Soccer Signups",
      content: "Fall semester intramural soccer league is forming! Games on weekends, all skill levels. Sign up by Friday.",
      author: "Recreation Center",
      time: "2 days ago",
      likes: 31,
      comments: 12,
      tags: ["sports", "recreation", "team"]
    }
  ];

  const getPostIcon = (type) => {
    switch (type) {
      case "event":
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case "question":
        return <HelpCircle className="h-5 w-5 text-green-600" />;
      case "club":
        return <Megaphone className="h-5 w-5 text-purple-600" />;
      default:
        return <Users className="h-5 w-5 text-slate-600" />;
    }
  };

  const getPostColor = (type) => {
    switch (type) {
      case "event":
        return "bg-blue-50 border-blue-200";
      case "question":
        return "bg-green-50 border-green-200";
      case "club":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  const filteredPosts = selectedCategory === "all" 
    ? mockPosts 
    : mockPosts.filter(post => post.type === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Community Board</h2>
        <p className="text-slate-600">Stay connected with campus events, questions, and clubs</p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="event">Events</TabsTrigger>
          <TabsTrigger value="question">Q&A</TabsTrigger>
          <TabsTrigger value="club">Clubs</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className={`hover:shadow-lg transition-shadow duration-200 ${getPostColor(post.type)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getPostIcon(post.type)}
                  <div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-slate-600">by {post.author}</span>
                      <span className="text-xs text-slate-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-slate-700 mb-4">{post.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-red-600">
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button className="bg-slate-900 hover:bg-slate-800">
          Create New Post
        </Button>
      </div>
    </div>
  );
};

export default CommunityBoard;
