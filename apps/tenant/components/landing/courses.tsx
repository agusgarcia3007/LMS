import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Course } from "@/lib/types";

type CoursesProps = {
  courses: Course[];
};

function formatPrice(price: string | null, currency: string | null): string {
  if (!price || price === "0") return "Free";

  const amount = parseFloat(price);
  const currencyCode = currency?.toUpperCase() || "USD";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getLevelBadgeColor(level: Course["level"]): string {
  switch (level) {
    case "beginner":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "intermediate":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "advanced":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="size-12 text-muted-foreground/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}

        {course.level && (
          <span
            className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getLevelBadgeColor(course.level)}`}
          >
            {course.level}
          </span>
        )}

        {course.originalPrice &&
          parseFloat(course.originalPrice) > parseFloat(course.price || "0") && (
            <span className="absolute top-3 right-3 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
              Sale
            </span>
          )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          {course.categories.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {course.categories.slice(0, 2).map((cat) => (
                <span
                  key={cat.slug}
                  className="text-xs text-muted-foreground"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h3 className="font-semibold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {course.shortDescription && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {course.shortDescription}
            </p>
          )}
        </div>

        {course.instructor && (
          <div className="mt-4 flex items-center gap-2">
            {course.instructor.avatar ? (
              <div className="relative size-7 overflow-hidden rounded-full ring-1 ring-border/50">
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name || "Instructor"}
                  fill
                  className="object-cover"
                  sizes="28px"
                />
              </div>
            ) : (
              <div className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {course.instructor.name?.[0] || "?"}
              </div>
            )}
            <span className="text-sm text-muted-foreground truncate">
              {course.instructor.name}
            </span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              {course.modulesCount} modules
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            {course.originalPrice &&
              parseFloat(course.originalPrice) > parseFloat(course.price || "0") && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(course.originalPrice, course.currency)}
                </span>
              )}
            <span className="font-semibold text-lg">
              {formatPrice(course.price, course.currency)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function Courses({ courses }: CoursesProps) {
  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Featured Courses
            </h2>
            <p className="mt-2 text-muted-foreground text-lg">
              Start your learning journey today
            </p>
          </div>
          <Link href="/courses">
            <Button variant="outline" size="lg">
              View All Courses
              <svg
                className="ml-2 size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
