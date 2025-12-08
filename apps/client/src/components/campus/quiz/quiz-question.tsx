import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Question } from "@/services/quizzes";
import { cn } from "@/lib/utils";

type QuizQuestionProps = {
  question: Question;
  index: number;
  selectedOptionIds: string[];
  onSelectOption: (optionId: string) => void;
  submitted: boolean;
  isCorrect: boolean | null;
};

const TYPE_HINTS: Record<string, string> = {
  multiple_choice: "quizzes.hints.selectOne",
  multiple_select: "quizzes.hints.selectMultiple",
  true_false: "quizzes.hints.selectOne",
};

export function QuizQuestion({
  question,
  index,
  selectedOptionIds,
  onSelectOption,
  submitted,
  isCorrect,
}: QuizQuestionProps) {
  const { t } = useTranslation();

  return (
    <Card
      className={cn(
        submitted &&
          (isCorrect
            ? "border-green-500/50 bg-green-500/5"
            : "border-red-500/50 bg-red-500/5")
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{index}</Badge>
            {submitted && (
              <Badge variant={isCorrect ? "default" : "destructive"}>
                {isCorrect ? (
                  <Check className="mr-1 size-3" />
                ) : (
                  <X className="mr-1 size-3" />
                )}
                {isCorrect ? t("quizzes.player.correct") : t("quizzes.player.incorrect")}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {t(TYPE_HINTS[question.type])}
          </span>
        </div>
        <CardTitle className="text-base font-medium pt-2">
          {question.questionText}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {question.options.map((option) => {
            const isSelected = selectedOptionIds.includes(option.id);
            const showAsCorrect = submitted && option.isCorrect;
            const showAsWrong = submitted && isSelected && !option.isCorrect;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => !submitted && onSelectOption(option.id)}
                disabled={submitted}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                  !submitted && "hover:bg-muted/50 cursor-pointer",
                  !submitted && isSelected && "border-primary bg-primary/5",
                  submitted && "cursor-default",
                  showAsCorrect && "border-green-500 bg-green-500/10",
                  showAsWrong && "border-red-500 bg-red-500/10"
                )}
              >
                <div
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center border-2",
                    question.type === "multiple_select" ? "rounded-sm" : "rounded-full",
                    !submitted && !isSelected && "border-muted-foreground/40",
                    !submitted && isSelected && "border-primary bg-primary text-primary-foreground",
                    showAsCorrect && "border-green-500 bg-green-500 text-white",
                    showAsWrong && "border-red-500 bg-red-500 text-white"
                  )}
                >
                  {(isSelected || showAsCorrect) && (
                    <Check className="size-3" />
                  )}
                </div>
                <span className="flex-1 text-sm">{option.optionText}</span>
                {submitted && option.isCorrect && !isSelected && (
                  <Badge variant="outline" className="shrink-0 text-green-600">
                    {t("quizzes.player.correctAnswer")}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {submitted && question.explanation && (
          <div className="mt-4 rounded-lg bg-muted/50 p-3">
            <p className="text-sm font-medium">{t("quizzes.player.explanation")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
