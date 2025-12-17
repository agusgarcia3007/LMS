import {
  Bot,
  CreditCard,
  FileVideo,
  Globe,
  GraduationCap,
  HelpCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const features = [
  { key: "videoAnalysis", icon: FileVideo },
  { key: "quizGeneration", icon: HelpCircle },
  { key: "aiAgent", icon: Bot },
  { key: "whiteLabel", icon: Globe },
  { key: "certificates", icon: GraduationCap },
  { key: "payments", icon: CreditCard },
];

export function LandingFeatures() {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("landing.features.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t("landing.features.subtitle")}
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.key} className="group">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <feature.icon className="size-6" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold">
                {t(`landing.features.${feature.key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`landing.features.${feature.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
