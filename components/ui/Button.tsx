import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "success"
    | "warning"
    | "danger";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  glow?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  fullWidth = false,
  rounded = "lg",
  glow = false,
  ...props
}: ButtonProps) {
  const baseClasses =
    "font-blockb font-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blockb-dark disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center active:scale-95 relative overflow-hidden";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blockb-gold via-amber-500 to-blockb-gold text-blockb-dark hover:from-amber-500 hover:to-blockb-gold active:scale-95 focus:ring-blockb-gold shadow-xl shadow-blockb-gold/30 font-bold",
    secondary:
      "bg-blockb-darker text-blockb-gold-light border border-blockb-gold/30 hover:bg-blockb-dark hover:border-blockb-gold/50 active:scale-95 focus:ring-blockb-gold/50 shadow-lg shadow-blockb-gold/10",
    outline:
      "border-2 border-blockb-gold text-blockb-gold hover:bg-blockb-gold hover:text-blockb-dark active:scale-95 focus:ring-blockb-gold bg-transparent",
    ghost:
      "text-blockb-gold hover:bg-blockb-gold/10 active:bg-blockb-gold/20 active:scale-95 focus:ring-blockb-gold/50",
    success:
      "bg-green-600 text-blockb-cream hover:bg-green-700 active:bg-green-800 focus:ring-green-500",
    warning:
      "bg-blockb-gold-500 text-blockb-dark hover:bg-blockb-gold-600 active:bg-blockb-gold-700 focus:ring-blockb-gold-500 shadow-gold",
    danger:
      "bg-red-600 text-blockb-cream hover:bg-red-700 active:bg-red-800 focus:ring-red-500",
    gold: "bg-blockb-gold text-blockb-dark hover:bg-blockb-gold-600 active:bg-blockb-gold-700 focus:ring-blockb-gold-500 shadow-gold blockb-text-glow",
  };

  const sizeClasses = {
    xs: "px-2 py-1 text-xs h-6",
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
    xl: "px-8 py-4 text-lg h-14",
  };

  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const glowClass = glow ? "blockb-glow animate-glow" : "";

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        fullWidth ? "w-full" : "",
        loading ? "cursor-not-allowed" : "",
        glowClass,
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shine effect overlay */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] hover:translate-x-[100%]"></div>

      <div className="relative z-10 flex items-center justify-center">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span>Chargement...</span>
          </>
        ) : (
          children
        )}
      </div>
    </button>
  );
}
