import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DevModeProvider } from "@/components/dev-mode/DevModeProvider";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/layout/Footer";
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SchoolPage from "./pages/SchoolPage";
import SchoolInstagramPage from "./pages/SchoolInstagramPage";
import Community from "./pages/Community";
import CreateProfile from "./pages/CreateProfile";
import ProfileSetup from "./pages/ProfileSetup";
import PaymentSuccess from "./pages/PaymentSuccess";
import ProfileSuccess from "./pages/ProfileSuccess";
import PostToInstagram from "./pages/PostToInstagram";
import SchoolInstagramPosts from "./pages/SchoolInstagramPosts";
import SchoolCampusHub from "./pages/SchoolCampusHub";
import SchoolDashboard from "./pages/SchoolDashboard";
import GuestInstagramPost from "./pages/GuestInstagramPost";
import InstagramSubmission from "./pages/InstagramSubmission";
import AppLanding from "./pages/AppLanding";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import BlogTemplate from "./pages/BlogTemplate";
import WhatIsFrosh from "./pages/WhatIsFrosh";
import HiringHub from "./pages/HiringHub";
import HeadOfBrand from "./pages/HeadOfBrand";
import RepresentativesReferral from "./pages/RepresentativesReferral";
import ConfirmReferral from "./pages/ConfirmReferral";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRouter = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DevModeProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/auth" element={<SignIn />} />
                <Route path="/community" element={<Community />} />
                <Route path="/create-profile" element={<CreateProfile />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/profile-success" element={<ProfileSuccess />} />
                <Route path="/:school" element={<SchoolCampusHub />} />
                <Route path="/:school/insta" element={<SchoolInstagramPage />} />
                <Route path="/:school/insta/posts" element={<SchoolInstagramPosts />} />
                <Route path="/post-to-insta" element={<PostToInstagram />} />
                <Route path="/guest-post-to-insta" element={<GuestInstagramPost />} />
                <Route path="/:school/guest-post-to-insta" element={<GuestInstagramPost />} />
                <Route path="/instagram-submission" element={<InstagramSubmission />} />
                <Route path="/waitlist" element={<AppLanding />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/blog/:slug" element={<BlogTemplate />} />
                <Route path="/what-is-frosh" element={<WhatIsFrosh />} />
                <Route path="/hiring" element={<HiringHub />} />
                <Route path="/hiring/head-of-brand" element={<HeadOfBrand />} />
                <Route path="/hiring/representatives" element={<RepresentativesReferral />} />
                <Route path="/hiring/confirm" element={<ConfirmReferral />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
        </TooltipProvider>
      </DevModeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default AppRouter;