import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signUp(formData.email, formData.password, formData.name);
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Success handled in auth context
      navigate('/profile-setup');
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/aae3dcfc-f3d8-4318-9704-4e40ab0380fd.png"
              alt="FroshMeet Logo" 
              className="h-12 w-auto"
            />
            <span className="text-xl font-bold text-foreground">FroshMeet</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border/40 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-primary animate-pulse">
                Join FroshMeet
              </h1>
              <p className="text-muted-foreground">
                Create your account and start connecting with your college community
              </p>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                  className="h-12 bg-background/50 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/40 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your college email"
                  required
                  className="h-12 bg-background/50 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/40 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
                  required
                  className="h-12 bg-background/50 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/40 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  required
                  className="h-12 bg-background/50 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/40 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              {/* Continue as Guest */}
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/community')}
                className="w-full h-12 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
              >
                Continue as Guest
              </Button>
            </form>
            
            <div className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Button 
                variant="ghost" 
                onClick={() => navigate('/signin')} 
                className="text-primary hover:text-primary/80 p-0 h-auto font-medium underline underline-offset-4"
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center p-6 text-xs text-muted-foreground">
        FroshMeet is a student-run platform and is not officially affiliated with or endorsed by any college or university.
        <br />
        By creating an account, you agree to our Terms and Privacy Policy.
      </footer>
    </div>
  );
}