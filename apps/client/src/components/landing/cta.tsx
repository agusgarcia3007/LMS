import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function CTA() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden border-y border-border py-12 md:py-16">
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-4 w-full origin-top-left -rotate-45 border-b border-border/30"
            style={{
              top: `${i * 16 - 120}px`,
              left: "-100%",
              width: "300%",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-[586px] px-6 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          {t("landing.cta.title")}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {t("landing.cta.subtitle")}
        </p>
        <Button size="lg" className="mt-6 rounded-full px-12" asChild>
          <Link to="/signup">{t("landing.cta.button")}</Link>
        </Button>
      </div>
    </section>
  );
}
