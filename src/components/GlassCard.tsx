import * as React from "react";
import { cn } from "../lib/utils";

interface GlassCardProps extends React.ComponentProps<"div"> {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
