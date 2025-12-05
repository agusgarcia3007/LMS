import { useTranslation } from "react-i18next";
import type { Question } from "@/services/quizzes";
import { QuestionCard } from "./question-card";

type QuestionListProps = {
  questions: Question[];
  lessonId: string;
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
  onReorder: (questionIds: string[]) => void;
};

export function QuestionList({
  questions,
  lessonId,
  onEdit,
  onDelete,
}: QuestionListProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          question={question}
          index={index + 1}
          lessonId={lessonId}
          onEdit={() => onEdit(question)}
          onDelete={() => onDelete(question.id)}
        />
      ))}
    </div>
  );
}
