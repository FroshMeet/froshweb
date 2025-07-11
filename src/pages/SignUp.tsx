
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    school: '',
    classYear: '',
    createProfile: false,
    addInstagramPost: false
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: formData.name,
            school: formData.school,
            class_year: formData.classYear
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });

      // Handle optional profile creation and Instagram posting
      if (formData.createProfile || formData.addInstagramPost) {
        // Navigate to profile creation or Instagram posting based on selections
        if (formData.addInstagramPost) {
          navigate(`/${formData.school.toLowerCase()}/post-to-insta`);
        } else {
          navigate('/create-profile');
        }
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-card/95 backdrop-blur-xl border-border/50 card-shadow">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              Join FroshMeet
            </CardTitle>
            <CardDescription>
              Create your account to connect with fellow students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <Input
                  id="school"
                  type="text"
                  placeholder="Enter your school name"
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="classYear">Class Year</Label>
                <Input
                  id="classYear"
                  type="text"
                  placeholder="e.g., 2028"
                  value={formData.classYear}
                  onChange={(e) => setFormData({...formData, classYear: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">Optional add-ons:</p>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="createProfile"
                    checked={formData.createProfile}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, createProfile: checked as boolean})
                    }
                  />
                  <Label htmlFor="createProfile" className="text-sm">
                    Create a free website profile
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="addInstagramPost"
                    checked={formData.addInstagramPost}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, addInstagramPost: checked as boolean})
                    }
                  />
                  <Label htmlFor="addInstagramPost" className="text-sm">
                    Add Instagram posting ($5)
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
