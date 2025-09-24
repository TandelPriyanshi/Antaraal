import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type BoxProps = React.ComponentPropsWithoutRef<typeof Card> & {
  variant?: "feature" | "plain";
};

/**
 * Box is a thin wrapper around Card that applies our default "feature" styling.
 * Use it anywhere you need a consistent elevated box container.
 */
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, variant = "feature", ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "group hover:shadow-elevated transition-all duration-300 border-0 h-full",
          // ensure a reasonable min height for feature tiles, can be overridden
          variant === "feature" && "bg-gradient-feature min-h-[260px]",
          className
        )}
        {...props}
      />
    );
  }
);
Box.displayName = "Box";

export default Box;
