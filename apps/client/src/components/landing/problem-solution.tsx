import { Clock, FileText, HelpCircle, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const problems = [
  { key: "time", icon: Clock },
  { key: "content", icon: FileText },
  { key: "quizzes", icon: HelpCircle },
];

export function ProblemSolution() {
  const { t } = useTranslation();

  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-[1060px] px-4">
        <h2 className="mb-16 text-balance text-center text-3xl font-bold sm:text-4xl md:text-5xl">
          {t("landing.problem.title")}
        </h2>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <div key={problem.key} className="rounded-lg border border-border bg-card p-6">
              <problem.icon className="mb-4 h-8 w-8 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                {t(`landing.problem.points.${problem.key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`landing.problem.points.${problem.key}.description`)}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-[700px] space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t("landing.problem.solution.badge")}
            </span>
          </div>
          <h3 className="text-balance text-2xl font-bold sm:text-3xl md:text-4xl">
            {t("landing.problem.solution.title")}
          </h3>
          <p className="text-pretty text-lg text-muted-foreground">
            {t("landing.problem.solution.description")}
          </p>
        </div>
      </div>
    </section>
  );
}
