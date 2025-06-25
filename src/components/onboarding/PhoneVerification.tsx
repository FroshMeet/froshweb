
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Phone, MessageSquare } from "lucide-react";

interface PhoneVerificationProps {
  formData: any;
  setFormData: (data: any) => void;
}

const PhoneVerification = ({ formData, setFormData }: PhoneVerificationProps) => {
  const [codeSent, setCodeSent] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    
    if (phoneNumber.length <= 3) {
      return `(${phoneNumber}`;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phoneNumber: formatted }));
  };

  const sendCode = () => {
    // Simulate sending code
    setCodeSent(true);
  };

  const handleCodeChange = (value: string) => {
    setFormData(prev => ({ ...prev, verificationCode: value }));
  };

  return (
    <>
      <div className="text-center mb-4">
        <p className="text-sm text-slate-600">
          We need to verify your phone number to ensure you're a real student
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            placeholder="(555) 123-4567"
            disabled={codeSent}
          />
          {!codeSent && (
            <Button
              onClick={sendCode}
              variant="outline"
              className="w-full mt-2"
              disabled={!formData.phoneNumber || formData.phoneNumber.length < 14}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Verification Code
            </Button>
          )}
        </div>

        {codeSent && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Enter 6-digit code
            </Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={formData.verificationCode}
                onChange={handleCodeChange}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-xs text-slate-500 text-center">
              We sent a code to {formData.phoneNumber}
            </p>
            <Button
              onClick={sendCode}
              variant="ghost"
              className="w-full text-xs"
            >
              Resend code
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
          <Phone className="h-5 w-5 text-slate-600" />
          <div>
            <p className="font-medium">Secure verification</p>
            <p className="text-sm text-slate-600">Your number stays private</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhoneVerification;
