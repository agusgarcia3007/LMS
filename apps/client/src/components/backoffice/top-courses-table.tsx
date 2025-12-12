import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { TopCourse } from "@/services/dashboard";

type TopCoursesTableProps = {
  courses: TopCourse[] | undefined;
  isLoading: boolean;
};

export function TopCoursesTable({ courses, isLoading }: TopCoursesTableProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">
          {t("backoffice.dashboard.topCourses")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : !courses || courses.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {t("backoffice.dashboard.noCoursesYet")}
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm font-medium text-muted-foreground w-5">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{course.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {course.tenantName ?? t("common.noOrganization")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" size="sm">
                    {course.enrollments} {t("backoffice.dashboard.enrolled")}
                  </Badge>
                  <Badge
                    variant={course.completionRate >= 50 ? "success" : "warning"}
                    appearance="light"
                    size="sm"
                  >
                    {course.completionRate}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
