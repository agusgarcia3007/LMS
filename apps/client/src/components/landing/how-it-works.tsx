import { Upload, Cpu, Rocket } from "lucide-react";
import { useTranslation } from "react-i18next";

const steps = [
  { icon: Upload, key: "upload", number: "01" },
  { icon: Cpu, key: "process", number: "02" },
  { icon: Rocket, key: "publish", number: "03" },
];

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-[1060px] px-4">
        <h2 className="mb-16 text-center text-3xl font-bold sm:text-4xl md:text-5xl">
          {t("landing.howItWorks.title")}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.key} className="relative">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold">
                  {t(`landing.howItWorks.steps.${step.key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.howItWorks.steps.${step.key}.description`)}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute left-[60%] top-8 hidden h-0.5 w-[80%] bg-border md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
