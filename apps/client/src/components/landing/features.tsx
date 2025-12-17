import {
  Bot,
  CreditCard,
  FileVideo,
  Globe,
  GraduationCap,
  HelpCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReactNode } from "react";

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
    <section id="features" className="bg-zinc-50 py-16 md:py-24 dark:bg-transparent">
      <div className="@container mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">
            {t("landing.features.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t("landing.features.subtitle")}
          </p>
        </div>

        <Card className="mx-auto mt-12 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 md:mt-16 md:max-w-full md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-3">
          {features.slice(0, 3).map((feature) => (
            <FeatureCard
              key={feature.key}
              icon={<feature.icon className="size-6" aria-hidden />}
              title={t(`landing.features.${feature.key}.title`)}
              description={t(`landing.features.${feature.key}.description`)}
            />
          ))}
        </Card>

        <Card className="mx-auto mt-px grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 md:max-w-full md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-3">
          {features.slice(3, 6).map((feature) => (
            <FeatureCard
              key={feature.key}
              icon={<feature.icon className="size-6" aria-hidden />}
              title={t(`landing.features.${feature.key}.title`)}
              description={t(`landing.features.${feature.key}.description`)}
            />
          ))}
        </Card>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group shadow-zinc-950/5">
      <CardHeader className="pb-3">
        <CardDecorator>{icon}</CardDecorator>
        <h3 className="mt-6 font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </div>
  );
}

function CardDecorator({ children }: { children: ReactNode }) {
  return (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
      />
      <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
        {children}
      </div>
    </div>
  );
}
