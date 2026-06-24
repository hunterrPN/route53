import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "aws-blue" | "aws-orange";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default" && "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        variant === "secondary" && "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === "outline" && "text-foreground border-gray-300",
        variant === "aws-blue" && "border-transparent bg-[#0066cc]/10 text-[#0066cc] hover:bg-[#0066cc]/20",
        variant === "aws-orange" && "border-transparent bg-[#ec7211]/10 text-[#ec7211]",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
