import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/pricing";

export function Pricing() {
  const { t } = useTranslation();

  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-balance text-3xl font-bold sm:text-4xl md:text-5xl">
            {t("landing.pricing.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("landing.pricing.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className={`relative rounded-lg border p-8 ${
                plan.featured
                  ? "scale-105 border-primary bg-primary/5 shadow-lg"
                  : "border-border bg-card"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                  {t("landing.pricing.popular")}
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-xl font-bold">
                    {t(`landing.pricing.tiers.${plan.key}.name`)}
                  </h3>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-muted-foreground">
                    /{t("landing.pricing.month")}
                  </span>
                </div>
                <Button
                  className="w-full"
                  variant={plan.featured ? "primary" : "secondary"}
                  asChild
                >
                  <Link to="/signup">{t("landing.pricing.cta")}</Link>
                </Button>
                <div className="space-y-3 border-t border-border pt-6">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-sm">
                        {t(`landing.pricing.features.${feature}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
