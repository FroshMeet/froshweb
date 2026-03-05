import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Instagram, Users, ExternalLink } from 'lucide-react';

export default function ProfileSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const school = searchParams.get('school');
  const profileId = searchParams.get('profileId');
  
  const schoolInstagram = `@${school?.toLowerCase()}2030class`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <CardTitle className="text-2xl">Profile Created Successfully!</CardTitle>
          <CardDescription>
            Your profile is now live on your school page
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Your profile is now visible at:</p>
            <Button 
              variant="link" 
              onClick={() => navigate(`/${school?.toLowerCase()}`)}
              className="text-primary"
            >
              froshmeet.com/{school?.toLowerCase()}
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>

          <div className="border-t pt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-2">Want even more visibility?</h3>
              <p className="text-muted-foreground text-sm">
                Get your profile posted to your school's official Instagram page!
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-4 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <Instagram className="h-6 w-6 text-pink-500" />
                <div>
                  <p className="font-medium">Post to {schoolInstagram}</p>
                  <p className="text-sm text-muted-foreground">Reach thousands of students</p>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate(`/${school?.toLowerCase()}/post`)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                📲 Post to {schoolInstagram} for $5
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => navigate('/')} 
              className="flex-1"
            >
              Go Home
            </Button>
            <Button 
              onClick={() => navigate(`/${school?.toLowerCase()}`)}
              className="flex-1"
            >
              View My Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}