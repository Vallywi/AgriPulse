import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  iconSize?: string;
}

/**
 * AgriPulse logo component — a stylized plant/agriculture mark with optional wordmark.
 * Uses green-themed SVG for a professional, agriculture-focused brand identity.
 */
export function Logo({ className, showText = true, iconSize = "h-7 w-7" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconSize)}
        aria-hidden="true"
      >
        {/* Circular background */}
        <circle cx="16" cy="16" r="15" fill="#16a34a" opacity="0.1" />
        {/* Main stem */}
        <path
          d="M16 28V14"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Left leaf */}
        <path
          d="M16 20C12 20 9 17 9 13C13 13 16 16 16 20Z"
          fill="#22c55e"
        />
        {/* Right leaf */}
        <path
          d="M16 14C20 14 23 11 23 7C19 7 16 10 16 14Z"
          fill="#16a34a"
        />
        {/* Small sprout at top */}
        <path
          d="M16 14C14.5 12 14.5 9.5 16 8C17.5 9.5 17.5 12 16 14Z"
          fill="#4ade80"
        />
        {/* Ground line */}
        <path
          d="M12 28H20"
          stroke="#16a34a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className="text-lg font-bold text-gray-900">
          Agri<span className="text-green-600">Pulse</span>
        </span>
      )}
    </div>
  );
}
