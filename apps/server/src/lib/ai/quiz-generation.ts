import { logger } from "@/lib/logger";
import { QUIZ_GENERATION_PROMPT } from "./prompts";

export type GeneratedQuestion = {
  type: "multiple_choice" | "multiple_select";
  questionText: string;
  explanation: string;
  options: {
    optionText: string;
    isCorrect: boolean;
  }[];
};

export function buildQuizPrompt(
  content: string,
  count: number,
  existingQuestions?: string[]
): string {
  let existingList = "None";
  if (existingQuestions && existingQuestions.length > 0) {
    existingList = existingQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n");
  }

  return QUIZ_GENERATION_PROMPT
    .replace("{{count}}", String(count))
    .replace("{{content}}", content)
    .replace("{{existing_questions}}", existingList);
}

export function parseGeneratedQuestions(response: string): GeneratedQuestion[] {
  let cleanResponse = response
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();

  const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    logger.error("Failed to parse AI response", { response: response.slice(0, 500) });
    throw new Error("Failed to parse AI response: no JSON array found");
  }

  let questions: GeneratedQuestion[];
  try {
    questions = JSON.parse(jsonMatch[0]) as GeneratedQuestion[];
  } catch (e) {
    logger.error("Failed to parse JSON", { json: jsonMatch[0].slice(0, 500) });
    throw new Error("Failed to parse AI response: invalid JSON");
  }

  const validQuestions: GeneratedQuestion[] = [];

  for (const q of questions) {
    if (!q.questionText || !q.options || !Array.isArray(q.options)) {
      logger.warn("Skipping invalid question", { question: q });
      continue;
    }

    if (q.options.length < 2 || q.options.length > 6) {
      logger.warn("Skipping question with invalid option count", {
        questionText: q.questionText,
        optionCount: q.options.length
      });
      continue;
    }

    const hasCorrectAnswer = q.options.some((o) => o.isCorrect === true);
    if (!hasCorrectAnswer) {
      logger.warn("Skipping question without correct answer", { questionText: q.questionText });
      continue;
    }

    validQuestions.push({
      type: q.type === "multiple_select" ? "multiple_select" : "multiple_choice",
      questionText: q.questionText,
      explanation: q.explanation || "",
      options: q.options.map((o) => ({
        optionText: o.optionText || "",
        isCorrect: o.isCorrect === true,
      })),
    });
  }

  if (validQuestions.length === 0) {
    logger.error("No valid questions parsed", { response: response.slice(0, 500) });
    throw new Error("Failed to parse AI response: no valid questions");
  }

  return validQuestions;
}
