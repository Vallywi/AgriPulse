import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  iconSize?: string;
  imageWidth?: number;
  imageHeight?: number;
}

/**
 * AgriPulse logo component — uses the brand logo image (logo-agripulse.png).
 */
export function Logo({
  className,
  showText = true,
  iconSize = "h-10 w-10",
  imageWidth = 44,
  imageHeight = 44,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo-agripulse.png"
        alt="AgriPulse"
        width={imageWidth}
        height={imageHeight}
        className={cn(iconSize, "object-contain rounded-full")}
        priority
      />
      {showText && (
        <span className="text-lg font-bold tracking-tight">
          <span className="text-green-700">Agri</span>
          <span className="text-green-900">Pulse</span>
        </span>
      )}
    </div>
  );
}
