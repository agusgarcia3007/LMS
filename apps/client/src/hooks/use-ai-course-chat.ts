import { useCallback, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getTenantFromHost, getResolvedSlug } from "@/lib/tenant";
import { ensureValidToken } from "@/lib/http";
import { QUERY_KEYS as COURSES_QUERY_KEYS } from "@/services/courses/service";
import { i18n } from "@/i18n";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export type CoursePreviewModule = {
  id?: string;
  title: string;
  description?: string;
  items: Array<{
    type: "video" | "document" | "quiz";
    id: string;
    title: string;
  }>;
};

export type CoursePreview = {
  title: string;
  shortDescription: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  objectives: string[];
  requirements: string[];
  features: string[];
  modules: CoursePreviewModule[];
};

export type ToolInvocation = {
  id: string;
  toolName: string;
  args: Record<string, unknown>;
  state: "pending" | "completed" | "error";
  result?: unknown;
  timestamp: number;
};

type ChatStatus = "idle" | "streaming" | "error";

export function useAICourseChat() {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesRef = useRef<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [coursePreview, setCoursePreview] = useState<CoursePreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toolInvocations, setToolInvocations] = useState<ToolInvocation[]>([]);
  const [courseCreated, setCourseCreated] = useState<{ courseId: string; title: string } | null>(null);

  messagesRef.current = messages;

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setStatus("streaming");
    setError(null);
    setToolInvocations([]);

    const allMessages = [...messagesRef.current, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const token = await ensureValidToken();
    const { slug } = getTenantFromHost();
    const tenantSlug = slug || getResolvedSlug();

    if (!token) {
      setStatus("error");
      setError("No authentication token found");
      toast.error(i18n.t("common.errors.unauthorized"));
      return;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    if (tenantSlug) {
      headers["X-Tenant-Slug"] = tenantSlug;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai/courses/chat`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ messages: allMessages }),
        }
      );

      if (response.status === 401) {
        setStatus("error");
        setError("Session expired");
        toast.error(i18n.t("common.errors.sessionExpired"));
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let currentMessageId: string | null = null;
      let currentMessageContent = "";
      let hasSeenToolCalls = false;

      const createNewAssistantMessage = () => {
        const newMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        };
        currentMessageId = newMessage.id;
        currentMessageContent = "";
        setMessages((prev) => [...prev, newMessage]);
        return newMessage.id;
      };

      const updateCurrentMessage = (content: string) => {
        if (!currentMessageId) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === currentMessageId ? { ...m, content } : m
          )
        );
      };

      const processSSELine = (line: string) => {
        if (!line.startsWith("data: ")) return;

        const data = line.slice(6);
        if (data === "[DONE]") return;

        try {
          const event = JSON.parse(data);

          switch (event.type) {
            case "text-delta":
              if (hasSeenToolCalls && !currentMessageId) {
                createNewAssistantMessage();
              } else if (!currentMessageId) {
                createNewAssistantMessage();
              }
              currentMessageContent += event.delta;
              updateCurrentMessage(currentMessageContent);
              break;

            case "tool-input-available":
              hasSeenToolCalls = true;
              currentMessageId = null;
              currentMessageContent = "";
              setToolInvocations((prev) => [
                ...prev,
                {
                  id: event.toolCallId,
                  toolName: event.toolName,
                  args: event.input || {},
                  state: "pending",
                  timestamp: Date.now(),
                },
              ]);
              break;

            case "tool-output-available":
              setToolInvocations((prev) =>
                prev.map((t) =>
                  t.id === event.toolCallId
                    ? { ...t, state: "completed", result: event.output }
                    : t
                )
              );

              if (
                event.toolName === "generateCoursePreview" &&
                event.output?.type === "course_preview"
              ) {
                const { type: _, ...preview } = event.output;
                setCoursePreview(preview as CoursePreview);
              }

              if (
                event.toolName === "createCourse" &&
                event.output?.type === "course_created"
              ) {
                setCourseCreated({
                  courseId: event.output.courseId,
                  title: event.output.title,
                });
                setCoursePreview(null);
                queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEYS.COURSES });
                toast.success(i18n.t("courses.aiCreator.created"));
              }
              break;
          }
        } catch {
          // Ignore parse errors
        }
      };

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (buffer.trim()) {
            processSSELine(buffer);
          }
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          processSSELine(line);
        }
      }

      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");

      setMessages((prev) => {
        return prev.filter((m) => m.role !== "assistant" || m.content.trim() !== "");
      });
    }
  }, [queryClient]);

  const reset = useCallback(() => {
    setMessages([]);
    setStatus("idle");
    setCoursePreview(null);
    setCourseCreated(null);
    setError(null);
    setToolInvocations([]);
  }, []);

  const clearPreview = useCallback(() => {
    setCoursePreview(null);
  }, []);

  return {
    messages,
    status,
    isStreaming: status === "streaming",
    coursePreview,
    courseCreated,
    error,
    toolInvocations,
    sendMessage,
    reset,
    clearPreview,
  };
}
