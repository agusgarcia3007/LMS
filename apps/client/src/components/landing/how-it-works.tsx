import { Upload, Cpu, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const steps = [
  { icon: Upload, key: "upload", number: "01" },
  { icon: Cpu, key: "process", number: "02" },
  { icon: Rocket, key: "publish", number: "03" },
];

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="bg-[var(--landing-bg-alt)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--landing-text)] sm:text-4xl">
            {t("landing.howItWorks.title")}
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-[var(--landing-border)] md:block" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.key}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
              >
                <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--landing-accent)] shadow-lg shadow-[var(--landing-accent)]/20">
                  <step.icon className="h-7 w-7 text-white" />
                </div>

                <span className="mb-2 text-sm font-semibold text-[var(--landing-accent)]">
                  Step {step.number}
                </span>

                <h3 className="mb-2 text-xl font-semibold text-[var(--landing-text)]">
                  {t(`landing.howItWorks.steps.${step.key}.title`)}
                </h3>

                <p className="max-w-xs text-sm leading-relaxed text-[var(--landing-text-muted)]">
                  {t(`landing.howItWorks.steps.${step.key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
