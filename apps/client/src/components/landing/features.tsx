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
    <section id="features" className="py-20">
      <div className="mx-auto max-w-[1060px] px-4">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-balance text-3xl font-bold sm:text-4xl md:text-5xl">
            {t("landing.features.title")}
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            {t("landing.features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                {t(`landing.features.${feature.key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`landing.features.${feature.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
