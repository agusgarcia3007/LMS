import { Clock, FileText, Globe, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Course } from "@/data/mock-courses";
import { formatDuration } from "@/data/mock-courses";

type CourseHeaderProps = {
  course: Course;
};

const levelLabels: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

export function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-muted/50 to-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" appearance="light">
                {course.category.replace("-", " ")}
              </Badge>
              <Badge variant="outline">{levelLabels[course.level]}</Badge>
            </div>

            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {course.title}
            </h1>

            <p className="mb-6 text-lg text-muted-foreground">
              {course.shortDescription}
            </p>

            <div className="mb-6 flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-1.5">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{course.rating}</span>
                <span className="text-muted-foreground">
                  ({course.reviewsCount} reseñas)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="size-4" />
                <span>{course.studentsCount.toLocaleString()} estudiantes</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <FileText className="size-4" />
                <span>{course.lessonsCount} lecciones</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Globe className="size-4" />
                <span className="capitalize">{course.language === "es" ? "Español" : course.language}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{course.instructor.name}</div>
                <div className="text-sm text-muted-foreground">
                  {course.instructor.title}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
