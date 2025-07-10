import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const profileId = searchParams.get('profile_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!profileId) {
        toast({
          title: "Error",
          description: "No profile ID found",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase.functions
          .invoke('verify-instagram-payment', {
            body: { profileId }
          });

        if (error) throw error;

        if (data.paid) {
          setVerified(true);
          toast({
            title: "Payment successful!",
            description: "Your profile is now featured on your school's Instagram page",
          });
        } else {
          toast({
            title: "Payment pending",
            description: "Your payment is still processing",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast({
          title: "Verification failed",
          description: "Could not verify your payment. Please contact support.",
          variant: "destructive"
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [profileId, navigate, toast]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <CardTitle>Verifying Payment</CardTitle>
            <CardDescription>Please wait while we confirm your payment...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-8 w-8 mx-auto mb-4 text-green-500" />
          <CardTitle>{verified ? "Payment Successful!" : "Payment Processing"}</CardTitle>
          <CardDescription>
            {verified 
              ? "Your profile is now featured on your school's Instagram page"
              : "Your payment is still being processed"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            onClick={() => navigate('/')} 
            className="w-full"
          >
            Go to Homepage
          </Button>
          
          {verified && (
            <Button 
              variant="outline"
              onClick={() => navigate(`/${searchParams.get('school')?.toLowerCase()}/insta/posts`)}
              className="w-full"
            >
              View Your Profile
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}