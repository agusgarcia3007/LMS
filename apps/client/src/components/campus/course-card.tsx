import { Link } from "@tanstack/react-router";
import { Clock, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Course } from "@/data/mock-courses";
import { formatDuration, formatPrice } from "@/data/mock-courses";

type CourseCardProps = {
  course: Course;
};

const levelLabels: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const levelVariants: Record<string, "success" | "warning" | "info"> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "info",
};

export function CourseCard({ course }: CourseCardProps) {
  const hasDiscount = course.originalPrice && course.originalPrice > course.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - course.price / course.originalPrice!) * 100)
    : 0;

  return (
    <Link
      to="/courses/$courseSlug"
      params={{ courseSlug: course.slug }}
      className="group block"
    >
      <article className="overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {hasDiscount && (
            <div className="absolute right-3 top-3">
              <Badge variant="destructive" size="sm">
                -{discountPercent}%
              </Badge>
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <Badge
              variant={levelVariants[course.level]}
              appearance="light"
              size="sm"
            >
              {levelLabels[course.level]}
            </Badge>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
              <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {course.instructor.name}
            </span>
          </div>

          <h3 className="mb-2 line-clamp-2 font-semibold leading-tight transition-colors group-hover:text-primary">
            {course.title}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {course.shortDescription}
          </p>

          <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{course.rating}</span>
              <span>({course.reviewsCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="size-3.5" />
              <span>{course.studentsCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-3.5" />
              <span>{formatDuration(course.duration)}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 border-t border-border/50 pt-4">
            <span className="text-xl font-bold">
              {formatPrice(course.price, course.currency)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(course.originalPrice!, course.currency)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
