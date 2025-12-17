import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LandingHero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-4xl px-6 py-20 md:py-28">
        <div className="text-center">
          <Badge variant="secondary" className="mb-5">
            {t("landing.hero.badge")}
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("landing.hero.title")}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            {t("landing.hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                {t("landing.hero.cta")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#pricing">
              <Button size="lg" variant="outline">
                {t("landing.hero.ctaSecondary")}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
