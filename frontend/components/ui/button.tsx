import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "aws-orange";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          // Variants
          variant === "default" && "bg-[#0073bb] hover:bg-[#005a92] text-white",
          variant === "destructive" && "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
          variant === "outline" && "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-sm",
          variant === "secondary" && "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
          variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
          variant === "link" && "text-primary underline-offset-4 hover:underline",
          variant === "aws-orange" && "bg-[#ec7211] hover:bg-[#d65f0f] text-white font-semibold",
          // Sizes
          size === "default" && "h-9 px-4 py-2",
          size === "sm" && "h-8 rounded px-3 text-xs",
          size === "lg" && "h-10 rounded px-8",
          size === "icon" && "h-9 w-9",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
