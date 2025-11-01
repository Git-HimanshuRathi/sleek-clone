import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeClasses = {
  sm: {
    icon: "h-4 w-4",
    text: "text-sm",
    gap: "gap-1.5",
  },
  md: {
    icon: "h-6 w-6",
    text: "text-lg",
    gap: "gap-2",
  },
  lg: {
    icon: "h-8 w-8",
    text: "text-xl",
    gap: "gap-2.5",
  },
};

export const Logo = ({ className, size = "md", showText = true }: LogoProps) => {
  const sizes = sizeClasses[size];

  return (
    <div className={cn("flex items-center", sizes.gap, className)}>
      {/* Icon: White circle with diagonal lines */}
      <div className={cn("relative", sizes.icon)}>
        {/* White circle background */}
        <div className="absolute inset-0 rounded-full bg-foreground"></div>
        {/* Three diagonal lines */}
        <svg
          className="absolute inset-0 rounded-full overflow-visible"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Three parallel diagonal lines from top-left to bottom-right */}
          <line
            x1="4"
            y1="4"
            x2="20"
            y2="20"
            stroke="hsl(var(--background))"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
            stroke="hsl(var(--background))"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="8"
            y1="8"
            x2="16"
            y2="16"
            stroke="hsl(var(--background))"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Text: "Linear" with L capitalized */}
      {showText && (
        <span className={cn("font-semibold text-foreground", sizes.text)}>
          Linear
        </span>
      )}
    </div>
  );
};

