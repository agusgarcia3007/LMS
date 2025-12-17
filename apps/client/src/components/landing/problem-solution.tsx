import { Clock, FileText, HelpCircle, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const problems = [
  { key: "time", icon: Clock },
  { key: "content", icon: FileText },
  { key: "quizzes", icon: HelpCircle },
];

export function ProblemSolution() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-2xl font-semibold text-muted-foreground md:text-3xl">
          {t("landing.problem.title")}
        </h2>

        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3">
          {problems.map((problem) => (
            <Card key={problem.key} className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-5">
                <problem.icon className="mb-3 h-8 w-8 text-destructive/70" />
                <h3 className="font-medium">
                  {t(`landing.problem.points.${problem.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`landing.problem.points.${problem.key}.description`)}
                </p>
              </CardContent>
            </Card>
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
