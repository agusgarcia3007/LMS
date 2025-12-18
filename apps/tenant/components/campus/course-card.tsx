import Link from "next/link";
import Image from "next/image";
import { Star, Users, BookOpen } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CampusCourse } from "@/services/campus/service";

type CourseCardProps = {
  course: CampusCourse;
  className?: string;
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

export function CourseCard({ course, className }: CourseCardProps) {
  const hasDiscount = course.originalPrice && course.originalPrice > course.price;
  const isFree = course.price === 0;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-border hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <BookOpen className="size-12 text-muted-foreground" />
          </div>
        )}
        {course.level && (
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 bg-background/80 backdrop-blur-sm"
          >
            {LEVEL_LABELS[course.level] || course.level}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          {course.categories.length > 0 && (
            <p className="mb-1 text-xs font-medium text-primary">
              {course.categories[0].name}
            </p>
          )}
          <h3 className="mb-2 line-clamp-2 font-semibold leading-tight group-hover:text-primary">
            {course.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {course.shortDescription}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {course.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="size-4 text-yellow-500" weight="fill" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
          )}
          {course.studentsCount > 0 && (
            <div className="flex items-center gap-1">
              <Users className="size-4" />
              <span>{course.studentsCount}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <BookOpen className="size-4" />
            <span>{course.modulesCount} modulos</span>
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2 border-t border-border/50 pt-4">
          {isFree ? (
            <span className="text-lg font-bold text-primary">Gratis</span>
          ) : (
            <>
              <span className="text-lg font-bold">
                {course.currency} {course.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {course.currency} {course.originalPrice?.toLocaleString()}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
