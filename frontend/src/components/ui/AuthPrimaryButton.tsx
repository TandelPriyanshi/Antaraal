import React from "react";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

interface AuthPrimaryButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  loadingText?: string;
}

const AuthPrimaryButton: React.FC<AuthPrimaryButtonProps> = ({
  loading = false,
  loadingText = "Loading...",
  className = "",
  disabled,
  children,
  ...rest
}) => {
  const baseClasses =
    "w-full bg-gradient-hero text-primary-foreground hover:shadow-elevated transition-all h-10 sm:h-11 text-sm sm:text-base";

  return (
    <Button
      {...rest}
      className={`${baseClasses}${className ? ` ${className}` : ""}`}
      disabled={loading || disabled}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default AuthPrimaryButton;
