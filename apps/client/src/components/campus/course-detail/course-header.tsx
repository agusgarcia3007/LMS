import { Clock, FileText, Globe, Layers, Star, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";
import type { CampusCourseDetail } from "@/services/campus/service";

type CourseHeaderProps = {
  course: CampusCourseDetail;
};

export function CourseHeader({ course }: CourseHeaderProps) {
  const { t } = useTranslation();

  const languageNames: Record<string, string> = {
    es: "Espanol",
    en: "English",
    pt: "Portugues",
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/4 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.primary/.06)_1px,transparent_0)] [background-size:20px_20px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {course.categoryName && (
              <Badge className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/15">
                {course.categoryName}
              </Badge>
            )}
            <Badge variant="outline" className="border-border">
              {t(`campus.course.levels.${course.level}`)}
            </Badge>
            {course.rating > 0 && (
              <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Star className="mr-1 size-3 fill-current" />
                {t("campus.course.bestseller")}
              </Badge>
            )}
          </div>

          <h1 className="mb-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {course.title}
          </h1>

          <p className="mb-6 text-base text-muted-foreground sm:text-lg">
            {course.shortDescription}
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {course.rating > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-amber-500">{course.rating.toFixed(1)}</span>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${i < Math.floor(course.rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                    />
                  ))}
                </div>
                <span className="text-primary underline">
                  {t("campus.course.reviews", { count: course.reviewsCount })}
                </span>
              </div>
            )}
            {course.studentsCount > 0 && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="size-4" />
                <span>{t("campus.course.students", { count: course.studentsCount })}</span>
              </div>
            )}
          </div>

          {course.instructor && (
            <div className="mb-6 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{t("campus.course.createdBy")}</span>
              <div className="flex items-center gap-2">
                <Avatar className="size-8 border-2 border-primary/20">
                  <AvatarImage src={course.instructor.avatar ?? undefined} alt={course.instructor.name} />
                  <AvatarFallback className="text-xs">
                    {getInitials(course.instructor.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-primary underline">
                  {course.instructor.name}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="size-4" />
              <span>{t("campus.course.lastUpdated")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="size-4" />
              <span>{languageNames[course.language] ?? course.language}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="size-4" />
              <span>{t("campus.course.modules", { count: course.modulesCount })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="size-4" />
              <span>{t("campus.course.lessons", { count: course.lessonsCount })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
