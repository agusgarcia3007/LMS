"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Star, Users, BookOpen, Clock, GlobeHemisphereWest } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CampusCourseDetail, BackgroundPattern } from "@/services/campus/service";

const PATTERN_CLASSES: Record<BackgroundPattern, string> = {
  none: "",
  grid: "text-primary/15 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_70%,transparent_110%)]",
  dots: "text-primary/20 bg-[radial-gradient(currentColor_1.5px,transparent_1.5px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_70%,transparent_110%)]",
  waves: "text-primary/15 bg-[radial-gradient(ellipse_100%_100%_at_100%_50%,transparent_20%,currentColor_21%,currentColor_22%,transparent_23%),radial-gradient(ellipse_100%_100%_at_0%_50%,transparent_20%,currentColor_21%,currentColor_22%,transparent_23%)] bg-[size:32px_16px] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,#000_70%,transparent_110%)]",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

type CourseHeaderProps = {
  course: CampusCourseDetail;
  pattern?: BackgroundPattern;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function CourseHeader({ course, pattern = "grid" }: CourseHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/4 to-background" />
      <div className={cn("absolute inset-0", PATTERN_CLASSES[pattern])} />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {course.categories.map((category) => (
              <Badge key={category.slug} variant="secondary">
                {category.name}
              </Badge>
            ))}
            {course.level && (
              <Badge variant="outline">
                {LEVEL_LABELS[course.level] || course.level}
              </Badge>
            )}
            {course.rating > 4.5 && (
              <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
                {t("campus.course.bestseller")}
              </Badge>
            )}
          </div>

          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            {course.title}
          </h1>

          <p className="mb-6 text-lg text-muted-foreground">
            {course.shortDescription}
          </p>

          {course.rating > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-yellow-500">
                  {course.rating.toFixed(1)}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "size-4",
                        star <= Math.round(course.rating)
                          ? "text-yellow-500"
                          : "text-muted-foreground/30"
                      )}
                      weight="fill"
                    />
                  ))}
                </div>
                {course.reviewsCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({course.reviewsCount} {t("campus.course.reviews", { count: course.reviewsCount })})
                  </span>
                )}
              </div>
              {course.studentsCount > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="size-4" />
                  <span>
                    {course.studentsCount.toLocaleString()} {t("campus.course.students", { count: course.studentsCount })}
                  </span>
                </div>
              )}
            </div>
          )}

          {course.instructor && (
            <div className="mb-6 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {t("campus.course.createdBy")}
              </span>
              {course.instructor.avatar ? (
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  width={32}
                  height={32}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                  <span className="text-xs font-medium">
                    {getInitials(course.instructor.name)}
                  </span>
                </div>
              )}
              <span className="font-medium text-primary underline-offset-2 hover:underline">
                {course.instructor.name}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="size-4" />
              <span>{t("campus.course.lastUpdated")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GlobeHemisphereWest className="size-4" />
              <span>{course.language || "Espanol"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="size-4" />
              <span>
                {course.modulesCount} {t("campus.course.modules", { count: course.modulesCount })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
