import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TopNavCTA } from "@/components/layout/TopNavCTA";
import froshLogo from "@/assets/frosh-logo-transparent.png";

const SignIn = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
    // Success is handled in the auth context with navigation
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset functionality coming soon!",
    });
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
          <div className="flex items-center space-x-4">
            <TopNavCTA />
            <div className="flex items-center space-x-3">
              <img 
                src={froshLogo}
                alt="Frosh Logo" 
                className={isMobile ? "h-8 w-auto" : "h-12 w-auto"}
              />
              <span className="text-xl font-bold text-foreground">Frosh</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12">
        <div className="glass-card w-full max-w-md bg-border/40 shadow-2xl">
          <Card className="glass-content bg-card/80 border-none">
          <CardHeader className="text-center pb-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-primary">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Sign in to connect with your college community
              </p>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                  {error}
                </div>
              )}
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="h-12 bg-background/50 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/40 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 bg-background/50 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/40 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/20"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary/80 p-0 h-auto font-normal"
                >
                  Forgot your password?
                </Button>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
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

              {/* Sign Up Link */}
              <div className="text-center text-sm text-muted-foreground">
                New to FroshMeet?{" "}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/signup')}
                  className="text-primary hover:text-primary/80 p-0 h-auto font-medium underline underline-offset-4"
                >
                  Create an account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center p-6 text-xs text-muted-foreground">
        FroshMeet is not affiliated with or endorsed by any university.
        <br />
        By signing in, you agree to our Terms and Privacy Policy.
      </footer>
    </div>
  );
};

export default SignIn;