
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
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
import PaymentSuccess from "./pages/PaymentSuccess";
import ProfileSuccess from "./pages/ProfileSuccess";
import PostToInstagram from "./pages/PostToInstagram";
import SchoolInstagramPosts from "./pages/SchoolInstagramPosts";
import SchoolPageNew from "./pages/SchoolPageNew";
import SchoolDashboard from "./pages/SchoolDashboard";
import GuestInstagramPost from "./pages/GuestInstagramPost";
import InstagramSubmission from "./pages/InstagramSubmission";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRouter = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
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
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/profile-success" element={<ProfileSuccess />} />
          <Route path="/:school" element={<SchoolDashboard />} />
          <Route path="/:school/insta" element={<SchoolInstagramPage />} />
          <Route path="/:school/insta/posts" element={<SchoolInstagramPosts />} />
          <Route path="/:school/post-to-insta" element={<PostToInstagram />} />
          <Route path="/guest-post-to-insta" element={<GuestInstagramPost />} />
          <Route path="/:school/guest-post-to-insta" element={<GuestInstagramPost />} />
          <Route path="/instagram-submission" element={<InstagramSubmission />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default AppRouter;
