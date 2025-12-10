import { cn } from "@/lib/utils"
import { siteData } from "@/lib/constants"

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="/logos/blue.png"
        alt={siteData.name}
        className="h-7 w-auto"
      />
      <span className="text-lg font-semibold">{siteData.name}</span>
    </div>
  )
}

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <img
      src="/logos/blue.png"
      alt={siteData.name}
      className={cn("size-5", className)}
    />
  )
}
