import { Clock, FileText, HelpCircle, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

const problems = [
  { key: "time", icon: Clock },
  { key: "content", icon: FileText },
  { key: "quizzes", icon: HelpCircle },
];

export function ProblemSolution() {
  const { t } = useTranslation();

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-2xl font-semibold text-muted-foreground md:text-3xl">
          {t("landing.problem.title")}
        </h2>

        <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3">
          {problems.map((problem) => (
            <div key={problem.key} className="rounded-xl border bg-background p-6">
              <problem.icon className="mb-4 h-8 w-8 text-muted-foreground/70" />
              <h3 className="font-medium">
                {t(`landing.problem.points.${problem.key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`landing.problem.points.${problem.key}.description`)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center md:mt-16">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {t("landing.problem.solution.badge")}
          </Badge>
          <h3 className="text-2xl font-semibold md:text-3xl">
            {t("landing.problem.solution.title")}
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t("landing.problem.solution.description")}
          </p>
        </div>
      </div>
    </section>
  );
}
