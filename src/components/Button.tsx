import React from "react";
import { cn } from "../lib/utils";
import { motion, HTMLMotionProps } from "motion/react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-white/10 hover:bg-white/20 border border-white/20 text-white",
      secondary: "bg-transparent border border-white/10 hover:bg-white/5 text-gray-300",
      ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white",
      danger: "bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-100",
      success: "bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-100",
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg"
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "rounded-xl transition-colors font-medium flex items-center justify-center gap-2 outline-none focus-visible:ring-2 ring-white/30",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
