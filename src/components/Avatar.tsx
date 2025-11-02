import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export const Avatar = ({ name, size = "md", className }: AvatarProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    xs: "w-5 h-5 text-[10px]",
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };

  return (
    <div
      className={cn(
        "rounded bg-primary/20 text-primary flex items-center justify-center font-semibold",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
};
