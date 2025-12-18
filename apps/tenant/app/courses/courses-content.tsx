"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MagnifyingGlass, X, BookOpen } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseGrid } from "@/components/campus/course-grid";
import { useCampusCourses } from "@/services/campus/queries";
import type { CampusCourse, CampusCategory } from "@/services/campus/service";

type CoursesContentProps = {
  initialCourses: CampusCourse[];
  categories: CampusCategory[];
};

const LEVELS = [
  { value: "beginner", label: "Principiante" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
];

export function CoursesContent({ initialCourses, categories }: CoursesContentProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const hasFilters = !!(search || selectedCategory || selectedLevel);

  const { data: filteredCoursesData, isLoading: isFiltering } = useCampusCourses(
    {
      search: search || undefined,
      category: selectedCategory || undefined,
      level: selectedLevel || undefined,
    },
    { enabled: hasFilters }
  );

  const courses = hasFilters ? (filteredCoursesData?.courses ?? []) : initialCourses;
  const coursesLoading = hasFilters && isFiltering;

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedLevel(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("campus.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("campus.allCategories")}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {LEVELS.map((level) => (
          <Button
            key={level.value}
            variant={selectedLevel === level.value ? "secondary" : "ghost"}
            size="sm"
            onClick={() =>
              setSelectedLevel(selectedLevel === level.value ? null : level.value)
            }
          >
            {level.label}
          </Button>
        ))}

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-2 text-muted-foreground"
          >
            <X className="mr-1 size-3" />
            {t("campus.clearFilters")}
          </Button>
        )}
      </div>

      {coursesLoading ? (
        <CourseGridSkeleton />
      ) : courses.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onClearFilters={clearFilters} />
      ) : (
        <CourseGrid courses={courses} />
      )}
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <BookOpen className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">
        {hasFilters ? t("campus.emptyFiltered.title") : t("campus.empty.title")}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {hasFilters ? t("campus.emptyFiltered.description") : t("campus.empty.description")}
      </p>
      {hasFilters && (
        <Button variant="outline" onClick={onClearFilters} className="mt-4">
          <X className="mr-2 size-4" />
          {t("campus.clearFilters")}
        </Button>
      )}
    </div>
  );
}

function CourseGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border/50"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="p-5">
            <Skeleton className="mb-3 h-6 w-24" />
            <Skeleton className="mb-2 h-5 w-full" />
            <Skeleton className="mb-4 h-4 w-3/4" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
