import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll"; // ✅ Import animation wrapper

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, email, password, agreeToTerms } = formData;

    if (!username || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!agreeToTerms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    try {
      await register(username, email, password);
      toast.success("Account created successfully!");
      navigate("/dashboard/reflections");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        {/* Logo with animation */}
        <AnimateOnScroll direction="up" offset={30}>
          <div className="text-center mb-4 sm:mb-6">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg sm:text-xl">
                  A
                </span>
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Antaraal
              </span>
            </Link>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Start your journaling journey
            </p>
          </div>
        </AnimateOnScroll>

        {/* Card with animation */}
        <AnimateOnScroll direction="up" offset={40} delay={150}>
          <Card className="shadow-elevated border-0 p-4 sm:p-6">
            <CardHeader className="space-y-1 pb-3 sm:pb-4">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-center">
                Create Account
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-2 sm:space-y-3 px-0">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm sm:text-base">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    placeholder="johndoe"
                    required
                    className="transition-all focus:shadow-soft h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="john.doe@example.com"
                    required
                    className="transition-all focus:shadow-soft h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm sm:text-base">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Create a strong password"
                      required
                      className="pr-10 transition-all focus:shadow-soft h-10 sm:h-11 text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleChange("agreeToTerms", e.target.checked)}
                    className="mt-1 rounded border-border text-primary focus:ring-primary w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                    required
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </CardContent>
              <CardFooter className="px-0 pt-2 pb-4">
                <div className="w-full space-y-2">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero text-primary-foreground hover:shadow-elevated transition-all h-10 sm:h-11 text-sm sm:text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                  <div className="text-center text-xs sm:text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      to="/signin"
                      className="text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Sign in here
                    </Link>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        </AnimateOnScroll>

        {/* Footer with animation */}
        <AnimateOnScroll direction="up" offset={20} delay={300}>
          <div className="mt-4 sm:mt-6 text-center">
            <Link
              to="/"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
};

export default SignUp;
