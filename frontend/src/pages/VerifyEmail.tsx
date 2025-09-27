import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    if (pastedData.length === 6) {
      setOtp(pastedData.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.auth.verifyEmail({ userId: parseInt(userId!), otp: otpCode });

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

    if (countdown > 0) return;

    setIsResending(true);
    try {
      const response = await api.auth.resendOTP({ email });

      if (response.data) {
        toast.success("Verification code sent successfully!");
        setCountdown(60); // Start 60 second countdown
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
              Verify your email address
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
              <p className="text-center text-sm sm:text-base text-muted-foreground">
                We've sent a 6-digit code to<br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </CardHeader>
            <form onSubmit={handleVerify}>
              <CardContent className="space-y-2 sm:space-y-3 px-0">
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base text-center block">
                    Enter verification code
                  </Label>
                  <div className="flex justify-center space-x-2 sm:space-x-3">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="transition-all focus:shadow-soft h-10 sm:h-11 w-12 text-sm sm:text-base text-center"
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>
              </CardContent>
              <CardFooter className="px-0 pt-2 pb-4">
                <div className="w-full space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero text-primary-foreground hover:shadow-elevated transition-all h-10 sm:h-11 text-sm sm:text-base"
                    disabled={isLoading || otp.join("").length !== 6}
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

                  <div className="text-center space-y-2">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isResending || countdown > 0}
                      className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                          Sending...
                        </>
                      ) : countdown > 0 ? (
                        `Resend in ${countdown}s`
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-3 w-3" />
                          Resend Code
                        </>
                      )}
                    </button>

                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Didn't receive the code?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        Try different email
                      </button>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        </AnimateOnScroll>

        {/* Footer with animation */}
        <AnimateOnScroll direction="up" offset={20} delay={300}>
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center text-xs sm:text-sm text-primary hover:bg-primary/10 py-2 px-3 rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Home
            </button>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
};

export default VerifyEmail;
