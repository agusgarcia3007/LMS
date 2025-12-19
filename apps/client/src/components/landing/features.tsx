import {
  Bot,
  CreditCard,
  FileVideo,
  Globe,
  GraduationCap,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const features = [
  { key: "videoAnalysis", icon: FileVideo },
  { key: "quizGeneration", icon: HelpCircle },
  { key: "aiAgent", icon: Bot },
  { key: "whiteLabel", icon: Globe },
  { key: "certificates", icon: GraduationCap },
  { key: "payments", icon: CreditCard },
] as const;

export function LandingFeatures() {
  const { t } = useTranslation();

  return (
    <section id="features" className="bg-[var(--landing-bg)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--landing-text)] sm:text-4xl">
            {t("landing.features.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--landing-text-muted)]">
            {t("landing.features.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              className="group rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] p-6 transition-shadow hover:shadow-lg hover:shadow-black/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--landing-accent-light)]">
                <feature.icon className="h-6 w-6 text-[var(--landing-accent)]" />
              </div>

              <h3 className="mb-2 text-lg font-semibold text-[var(--landing-text)]">
                {t(`landing.features.${feature.key}.title`)}
              </h3>

              <p className="text-sm leading-relaxed text-[var(--landing-text-muted)]">
                {t(`landing.features.${feature.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
