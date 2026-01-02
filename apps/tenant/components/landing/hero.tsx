import { Button } from "@/components/ui/button";
import type { Tenant } from "@/lib/types";

type HeroProps = {
  tenant: Tenant;
};

function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}

function DotsPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at center, var(--foreground) 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}

function WavesPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute w-full h-full opacity-[0.03] dark:opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="waves"
            x="0"
            y="0"
            width="100"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 10 Q25 0, 50 10 T100 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#waves)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}

function BackgroundPattern({ pattern }: { pattern: Tenant["heroPattern"] }) {
  switch (pattern) {
    case "grid":
      return <GridPattern />;
    case "dots":
      return <DotsPattern />;
    case "waves":
      return <WavesPattern />;
    default:
      return null;
  }
}

export function Hero({ tenant }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-16">
      <BackgroundPattern pattern={tenant.heroPattern} />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Start learning today
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-in [animation-delay:100ms]">
            {tenant.heroTitle || tenant.name}
          </h1>

          {tenant.heroSubtitle && (
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in [animation-delay:200ms]">
              {tenant.heroSubtitle}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in [animation-delay:300ms]">
            <Button size="lg" className="min-w-[200px] h-12 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
              {tenant.heroCta || "Explore Courses"}
            </Button>
            <Button variant="outline" size="lg" className="min-w-[200px] h-12 text-base">
              Learn More
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in [animation-delay:400ms]">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">100+</div>
            <div className="text-sm text-muted-foreground mt-1">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">10k+</div>
            <div className="text-sm text-muted-foreground mt-1">Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">98%</div>
            <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
