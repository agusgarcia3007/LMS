"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, XCircle, ArrowRight, Trophy } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuizContent as QuizContentType, QuizQuestion, QuizOption } from "@/services/learn/service";

type QuizContentProps = {
  content: QuizContentType;
  onComplete: () => void;
  isCompleting: boolean;
};

type QuizState = "in_progress" | "completed";
type AnswerState = Record<string, string[]>;

export function QuizContent({ content, onComplete, isCompleting }: QuizContentProps) {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [showResult, setShowResult] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>("in_progress");

  const questions = content.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentAnswers = answers[currentQuestion?.id] || [];

  const handleSelectOption = (optionId: string) => {
    if (showResult) return;

    const questionId = currentQuestion.id;
    const isMultiSelect = currentQuestion.type === "multiple_select";

    setAnswers((prev) => {
      if (isMultiSelect) {
        const current = prev[questionId] || [];
        const exists = current.includes(optionId);
        return {
          ...prev,
          [questionId]: exists
            ? current.filter((id) => id !== optionId)
            : [...current, optionId],
        };
      }
      return { ...prev, [questionId]: [optionId] };
    });
  };

  const handleCheckAnswer = () => {
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizState("completed");
      onComplete();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowResult(false);
    }
  };

  if (quizState === "completed") {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-500/10">
            <Trophy className="size-10 text-green-500" weight="fill" />
          </div>
          <h2 className="text-2xl font-semibold">{t("learn.quiz.completed")}</h2>
          <p className="mt-2 text-muted-foreground">{t("learn.quiz.completedDescription")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>{content.title}</span>
              <span>
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold">{currentQuestion.questionText}</h3>
            {currentQuestion.type === "multiple_select" && (
              <p className="mt-1 text-sm text-muted-foreground">
                {t("learn.quiz.selectMultiple")}
              </p>
            )}

            <div className="mt-6 space-y-3">
              {currentQuestion.options.map((option) => (
                <OptionButton
                  key={option.id}
                  option={option}
                  isSelected={currentAnswers.includes(option.id)}
                  showResult={showResult}
                  onClick={() => handleSelectOption(option.id)}
                />
              ))}
            </div>

            {showResult && currentQuestion.explanation && (
              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-medium">{t("learn.quiz.explanation")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background p-4">
        <div className="mx-auto flex max-w-2xl justify-end gap-3">
          {!showResult ? (
            <Button
              onClick={handleCheckAnswer}
              disabled={currentAnswers.length === 0}
            >
              {t("learn.quiz.checkAnswer")}
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="gap-2">
              {isLastQuestion ? t("learn.quiz.finish") : t("learn.quiz.next")}
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

type OptionButtonProps = {
  option: QuizOption;
  isSelected: boolean;
  showResult: boolean;
  onClick: () => void;
};

function OptionButton({ option, isSelected, showResult, onClick }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={showResult}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors",
        isSelected && !showResult && "border-primary bg-primary/5",
        !isSelected && !showResult && "border-border hover:border-primary/50 hover:bg-accent/50",
        showResult && isSelected && "border-primary bg-primary/10",
        showResult && !isSelected && "border-border opacity-60"
      )}
    >
      <div
        className={cn(
          "flex size-6 flex-shrink-0 items-center justify-center rounded-full border-2",
          isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
        )}
      >
        {isSelected && <CheckCircle className="size-4" weight="fill" />}
      </div>
      <span className="flex-1">{option.optionText}</span>
    </button>
  );
}
