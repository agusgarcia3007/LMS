import { useEffect, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { useGetCourses } from "@/services/courses";
import type { Course } from "@/services/courses/service";
import { cn } from "@/lib/utils";

interface CourseMentionPopoverProps {
  open: boolean;
  searchQuery: string;
  selectedIndex: number;
  onSelect: (course: Course) => void;
  onClose: () => void;
  onCoursesChange?: (courses: Course[]) => void;
  excludeIds?: string[];
  anchorRef: RefObject<HTMLTextAreaElement>;
}

export function CourseMentionPopover({
  open,
  searchQuery,
  selectedIndex,
  onSelect,
  onClose,
  onCoursesChange,
  excludeIds = [],
  anchorRef,
}: CourseMentionPopoverProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetCourses(
    {
      search: searchQuery || undefined,
      limit: 10,
    },
    { enabled: open }
  );

  const courses = (data?.courses ?? []).filter((c) => !excludeIds.includes(c.id));

  useEffect(() => {
    onCoursesChange?.(courses);
  }, [courses, onCoursesChange]);

  return (
    <Popover open={open} onOpenChange={(o) => !o && onClose()}>
      <PopoverAnchor virtualRef={anchorRef} />
      <PopoverContent
        className="w-80 p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        side="top"
        align="start"
        sideOffset={8}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            ) : courses.length === 0 ? (
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
                {courses.map((course, index) => (
                  <div
                    key={course.id}
                    onClick={() => onSelect(course)}
                    className={cn(
                      "relative flex cursor-pointer gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden",
                      index === selectedIndex && "bg-accent"
                    )}
                  >
                    <BookOpen className="size-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 truncate">
                      <span className="font-medium">{course.title}</span>
                    </div>
                    <Badge variant="secondary" size="xs" className="shrink-0">
                      {course.modulesCount} {t("courses.preview.modules")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
