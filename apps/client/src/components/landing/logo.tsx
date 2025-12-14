import { cn } from "@/lib/utils"
import { siteData } from "@/lib/constants"

type LearnbaseLogoProps = {
  className?: string
}

export function LearnbaseLogo({ className }: LearnbaseLogoProps) {
  return (
    <img
      src="/logos/blue.png"
      alt={siteData.name}
      className={cn("size-7", className)}
    />
  )
}
