import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Tenant } from "@/lib/types";

type HeaderProps = {
  tenant: Tenant;
};

export function Header({ tenant }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          {tenant.logo && (
            <div className="relative size-9 overflow-hidden rounded-lg ring-1 ring-border/50 transition-all group-hover:ring-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10">
              <Image
                src={tenant.logo}
                alt={tenant.name}
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
          )}
          {(tenant.showHeaderName !== false || !tenant.logo) && (
            <span className="font-semibold text-lg tracking-tight">
              {tenant.name}
            </span>
          )}
        </a>

        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Courses
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            About
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Contact
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign In
          </Button>
          <Button size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
