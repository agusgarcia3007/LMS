import { useCallback, useRef, useState } from "react";
import type { Course } from "@/services/courses/service";

export type SelectedCourse = {
  id: string;
  title: string;
  level: Course["level"];
  modulesCount: number;
};

type UseCourseMintonOptions = {
  onSelect: (course: SelectedCourse) => void;
  maxMentions?: number;
  selectedCourseIds?: string[];
};

type UseCourseMintonReturn = {
  isOpen: boolean;
  searchQuery: string;
  selectedIndex: number;
  handleInputChange: (value: string) => void;
  handleSelect: (course: Course) => void;
  handleKeyDown: (e: React.KeyboardEvent, courses: Course[]) => boolean;
  close: () => void;
  getCleanedInput: (value: string) => string;
};

export function useCourseMention({
  onSelect,
  maxMentions = 3,
  selectedCourseIds = [],
}: UseCourseMintonOptions): UseCourseMintonReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const triggerIndexRef = useRef<number>(-1);

  const handleInputChange = useCallback(
    (value: string) => {
      const cursorPos = value.length;
      const textBeforeCursor = value.slice(0, cursorPos);
      const atIndex = textBeforeCursor.lastIndexOf("@");

      if (atIndex !== -1) {
        const charBefore = atIndex > 0 ? value[atIndex - 1] : " ";
        const isStartOfWord = charBefore === " " || charBefore === "\n" || atIndex === 0;

        if (isStartOfWord) {
          const query = textBeforeCursor.slice(atIndex + 1);
          if (!query.includes(" ") && !query.includes("\n")) {
            if (selectedCourseIds.length >= maxMentions) {
              setIsOpen(false);
              return;
            }
            const wasOpen = isOpen;
            setIsOpen(true);
            setSearchQuery((prev) => {
              if (prev !== query || !wasOpen) {
                setSelectedIndex(0);
              }
              return query;
            });
            triggerIndexRef.current = atIndex;
            return;
          }
        }
      }

      setIsOpen(false);
      setSearchQuery("");
      setSelectedIndex(0);
    },
    [maxMentions, selectedCourseIds.length, isOpen]
  );

  const handleSelect = useCallback(
    (course: Course) => {
      if (selectedCourseIds.includes(course.id)) {
        setIsOpen(false);
        setSearchQuery("");
        setSelectedIndex(0);
        return;
      }

      onSelect({
        id: course.id,
        title: course.title,
        level: course.level,
        modulesCount: course.modulesCount,
      });

      setIsOpen(false);
      setSearchQuery("");
      setSelectedIndex(0);
    },
    [onSelect, selectedCourseIds]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, courses: Course[]): boolean => {
      if (!isOpen || courses.length === 0) return false;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % courses.length);
        return true;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + courses.length) % courses.length);
        return true;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const course = courses[selectedIndex];
        if (course) {
          handleSelect(course);
        }
        return true;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery("");
        setSelectedIndex(0);
        return true;
      }

      return false;
    },
    [isOpen, selectedIndex, handleSelect]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setSearchQuery("");
    setSelectedIndex(0);
  }, []);

  const getCleanedInput = useCallback(
    (value: string): string => {
      if (triggerIndexRef.current === -1) return value;

      const before = value.slice(0, triggerIndexRef.current);
      const after = value.slice(triggerIndexRef.current);
      const cleaned = after.replace(/^@\S*\s?/, "");

      triggerIndexRef.current = -1;
      return before + cleaned;
    },
    []
  );

  return {
    isOpen,
    searchQuery,
    selectedIndex,
    handleInputChange,
    handleSelect,
    handleKeyDown,
    close,
    getCleanedInput,
  };
}
