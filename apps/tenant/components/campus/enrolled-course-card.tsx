"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { BookOpen, CheckCircle, Clock } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Enrollment } from "@/services/enrollments/service";

type EnrolledCourseCardProps = {
  enrollment: Enrollment;
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
  const { t } = useTranslation();
  const { course, progress, status, enrolledAt } = enrollment;

  const isCompleted = status === "completed";
  const enrolledDate = new Date(enrolledAt).toLocaleDateString();

  return (
    <Link
      href={`/my-courses/${course.slug}`}
      className="group block"
    >
      <article className="overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-video overflow-hidden">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <BookOpen className="size-12 text-muted-foreground" />
            </div>
          )}
          {isCompleted && (
            <div className="absolute right-3 top-3">
              <Badge className="gap-1 bg-green-600 text-white hover:bg-green-600">
                <CheckCircle className="size-3" weight="fill" />
                {t("enrollments.completed")}
              </Badge>
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {LEVEL_LABELS[course.level] || course.level}
            </Badge>
          </div>
        </div>

        <div className="p-5">
          {course.instructor && (
            <div className="mb-3 flex items-center gap-2">
              {course.instructor.avatar ? (
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  width={24}
                  height={24}
                  className="size-6 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-6 items-center justify-center rounded-full bg-muted">
                  <span className="text-[10px] font-medium">
                    {getInitials(course.instructor.name)}
                  </span>
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                {course.instructor.name}
              </span>
            </div>
          )}

          <h3 className="mb-2 line-clamp-2 font-semibold leading-tight transition-colors group-hover:text-primary">
            {course.title}
          </h3>

          <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="size-3.5" />
              <span>
                {course.modulesCount} {t("campus.course.modules", { count: course.modulesCount })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-3.5" />
              <span>{enrolledDate}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t("enrollments.progress")}
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </article>
    </Link>
  );
}
