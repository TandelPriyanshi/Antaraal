import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId");
  const email = searchParams.get("email");
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.auth.verifyEmail({ userId: parseInt(userId!), otp });

      if (response.data) {
        const { redirectToSignIn, message } = response.data;

        if (redirectToSignIn) {
          toast.success(message || "Email verified successfully! Please sign in to continue.");
          // Navigate to signin page instead of dashboard
          navigate("/signin", {
            state: {
              message: "Email verified successfully! Please sign in with your credentials.",
              email: email
            }
          });
        } else {
          // Fallback to dashboard if no redirectToSignIn flag
          toast.success("Email verified successfully!");
          navigate("/dashboard/reflections");
        }
      } else {
        throw new Error(response.error || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to verify email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email not found. Please try registering again.");
      navigate("/signup");
      return;
    }

    setIsResending(true);
    try {
      const response = await api.auth.resendOTP({ email });

      if (response.data) {
        toast.success("Verification code sent successfully!");
      } else {
        throw new Error(response.error || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to resend verification code. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        {/* Logo with animation */}
        <AnimateOnScroll direction="up" offset={30}>
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg sm:text-xl">
                  A
                </span>
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Antaraal
              </span>
            </div>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Verify your email to continue
            </p>
          </div>
        </AnimateOnScroll>

        {/* Card with animation */}
        <AnimateOnScroll direction="up" offset={40} delay={150}>
          <Card className="shadow-elevated border-0 p-4 sm:p-6">
            <CardHeader className="space-y-1 pb-3 sm:pb-4">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-center">
                Email Verification
              </CardTitle>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit verification code to
                </p>
                <p className="font-medium text-foreground">{email}</p>
              </div>
            </CardHeader>

            <form onSubmit={handleVerify}>
              <CardContent className="space-y-4 px-0">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm sm:text-base">
                    Verification Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    required
                    maxLength={6}
                    className="text-center text-lg font-mono tracking-widest transition-all focus:shadow-soft h-12 sm:h-13 text-sm sm:text-base"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-hero text-primary-foreground hover:shadow-elevated transition-all h-10 sm:h-11 text-sm sm:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Didn't receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-sm"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Resend Code
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </AnimateOnScroll>

        {/* Footer with animation */}
        <AnimateOnScroll direction="up" offset={20} delay={300}>
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() => navigate("/signup")}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Sign Up
            </button>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
};

export default VerifyEmail;
