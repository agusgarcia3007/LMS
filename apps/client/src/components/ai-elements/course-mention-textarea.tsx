import { useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Loader2, X } from "lucide-react";
import { useGetCourses } from "@/services/courses";
import type { Course } from "@/services/courses/service";
import { cn } from "@/lib/utils";

export type SelectedCourse = {
  id: string;
  title: string;
  level: Course["level"];
  modulesCount: number;
};

interface CourseMentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  selectedCourses: SelectedCourse[];
  onSelectedCoursesChange: (courses: SelectedCourse[]) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  maxMentions?: number;
}

export function CourseMentionTextarea({
  value,
  onChange,
  selectedCourses,
  onSelectedCoursesChange,
  disabled = false,
  placeholder,
  className,
  maxMentions = 3,
}: CourseMentionTextareaProps) {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const triggerIndexRef = useRef<number>(-1);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedCourseIds = useMemo(
    () => selectedCourses.map((c) => c.id),
    [selectedCourses]
  );

  const { data, isLoading } = useGetCourses(
    { search: searchQuery || undefined, limit: 10 },
    { enabled: isPopoverOpen }
  );

  const filteredCourses = useMemo(
    () => (data?.courses ?? []).filter((c) => !selectedCourseIds.includes(c.id)),
    [data?.courses, selectedCourseIds]
  );

  function detectMention(text: string) {
    const cursorPos = text.length;
    const textBeforeCursor = text.slice(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf("@");

    if (atIndex !== -1) {
      const charBefore = atIndex > 0 ? text[atIndex - 1] : " ";
      const isStartOfWord = charBefore === " " || charBefore === "\n" || atIndex === 0;

      if (isStartOfWord) {
        const query = textBeforeCursor.slice(atIndex + 1);
        if (!query.includes(" ") && !query.includes("\n")) {
          if (selectedCourses.length >= maxMentions) {
            closePopover();
            return;
          }
          triggerIndexRef.current = atIndex;
          setSearchQuery(query);
          setIsPopoverOpen(true);
          setSelectedIndex(0);
          return;
        }
      }
    }

    closePopover();
  }

  function closePopover() {
    setIsPopoverOpen(false);
    setSearchQuery("");
    setSelectedIndex(0);
  }

  function cleanInput(text: string): string {
    if (triggerIndexRef.current === -1) return text;
    const before = text.slice(0, triggerIndexRef.current);
    const after = text.slice(triggerIndexRef.current);
    const cleaned = after.replace(/^@\S*\s?/, "");
    triggerIndexRef.current = -1;
    return before + cleaned;
  }

  function handleSelect(course: Course) {
    if (selectedCourseIds.includes(course.id)) {
      closePopover();
      return;
    }

    const newCourse: SelectedCourse = {
      id: course.id,
      title: course.title,
      level: course.level,
      modulesCount: course.modulesCount,
    };

    onSelectedCoursesChange([...selectedCourses, newCourse]);
    onChange(cleanInput(value));
    closePopover();
    textareaRef.current?.focus();
  }

  function handleRemoveCourse(courseId: string) {
    onSelectedCoursesChange(selectedCourses.filter((c) => c.id !== courseId));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    onChange(newValue);
    detectMention(newValue);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!isPopoverOpen || filteredCourses.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCourses.length);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCourses.length) % filteredCourses.length);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const course = filteredCourses[selectedIndex];
      if (course) handleSelect(course);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      closePopover();
      return;
    }
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {selectedCourses.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-border">
          {selectedCourses.map((course) => (
            <span
              key={course.id}
              className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-xs font-medium text-primary"
            >
              <BookOpen className="size-3" />
              <span className="max-w-[150px] truncate">{course.title}</span>
              <button
                type="button"
                onClick={() => handleRemoveCourse(course.id)}
                disabled={disabled}
                className="opacity-60 hover:opacity-100 disabled:pointer-events-none"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        {isPopoverOpen && (
          <div className="absolute bottom-full left-0 mb-2 z-50 w-80 rounded-md border border-border bg-popover text-popover-foreground shadow-md">
            <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="py-6 text-center text-sm">
                  {searchQuery
                    ? t("courses.aiCreator.mention.noCourses")
                    : t("courses.aiCreator.mention.typeToSearch")}
                </div>
              ) : (
                <div className="overflow-hidden p-1.5 text-foreground">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {t("courses.aiCreator.mention.courses")}
                  </div>
                  {filteredCourses.map((course, index) => (
                    <div
                      key={course.id}
                      onClick={() => handleSelect(course)}
                      className={cn(
                        "relative flex cursor-pointer gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden",
                        index === selectedIndex && "bg-accent"
                      )}
                    >
                      <BookOpen className="size-4 shrink-0 text-muted-foreground" />
                      <div className="flex-1 truncate">
                        <span className="font-medium">{course.title}</span>
                      </div>
                      <span className="shrink-0 rounded-sm bg-secondary px-1.5 py-0.5 text-[0.625rem] text-secondary-foreground">
                        {course.modulesCount} {t("courses.preview.modules")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="flex min-h-10 w-full resize-none bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          rows={1}
        />
      </div>
    </div>
  );
}
