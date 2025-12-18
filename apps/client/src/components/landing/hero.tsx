import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Beams from "@/components/Beams";

export function LandingHero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-24 pb-16">
      <div className="absolute inset-0 -z-10">
        <Beams beamWidth={3} beamHeight={20} beamNumber={8} lightColor="#6366f1" speed={1.5} rotation={-15} />
      </div>
      <div className="mx-auto max-w-[1060px] px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t("landing.hero.badge")}
            </span>
          </div>

          <div className="flex max-w-[800px] flex-col items-center gap-6 text-center">
            <h1 className="text-balance text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {t("landing.hero.title")}
            </h1>
            <p className="max-w-[600px] text-pretty text-lg text-muted-foreground sm:text-xl">
              {t("landing.hero.subtitle")}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" className="px-8" asChild>
              <Link to="/signup">{t("landing.hero.cta")}</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent px-8" asChild>
              <a href="#pricing">{t("landing.hero.ctaSecondary")}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
