import { Clock, FileText, HelpCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const problems = [
  { key: "time", icon: Clock },
  { key: "content", icon: FileText },
  { key: "quizzes", icon: HelpCircle },
];

export function ProblemSolution() {
  const { t } = useTranslation();

  return (
    <section className="bg-[var(--landing-bg)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--landing-text)] sm:text-4xl">
            {t("landing.problem.title")}
          </h2>
        </motion.div>

        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.key}
              className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-card)] p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--landing-bg-alt)]">
                  <problem.icon className="h-6 w-6 text-[var(--landing-text-muted)]" />
                </div>
                <span className="text-3xl font-bold text-[var(--landing-border)]">
                  0{index + 1}
                </span>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-[var(--landing-text)]">
                {t(`landing.problem.points.${problem.key}.title`)}
              </h3>

              <p className="text-sm leading-relaxed text-[var(--landing-text-muted)]">
                {t(`landing.problem.points.${problem.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--landing-accent)]/30 bg-[var(--landing-accent-light)] px-4 py-2 text-sm text-[var(--landing-accent)]">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">{t("landing.problem.solution.badge")}</span>
          </div>

          <h3 className="mb-4 text-2xl font-bold tracking-tight text-[var(--landing-text)] sm:text-3xl">
            {t("landing.problem.solution.title")}
          </h3>

          <p className="text-lg leading-relaxed text-[var(--landing-text-muted)]">
            {t("landing.problem.solution.description")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
