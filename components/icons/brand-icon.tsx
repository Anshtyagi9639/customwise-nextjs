import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/** Official Customs Wise icon set (Atlantic colourway, per brand guide: one colour set per project). */
export function BrandIcon({ src, className, size = 48 }: { src: string; className?: string; size?: number }) {
  return <Image src={src} alt="" width={size} height={size} className={cn("object-contain", className)} aria-hidden />;
}
