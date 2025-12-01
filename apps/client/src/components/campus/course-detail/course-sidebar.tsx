import { Check, Clock, FileText, Infinity, Medal, MessageCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import type { Course } from "@/data/mock-courses";
import { formatDuration, formatPrice } from "@/data/mock-courses";

type CourseSidebarProps = {
  course: Course;
};

export function CourseSidebar({ course }: CourseSidebarProps) {
  const hasDiscount = course.originalPrice && course.originalPrice > course.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - course.price / course.originalPrice!) * 100)
    : 0;

  return (
    <Card className="sticky top-24 overflow-hidden border-border/50">
      <div className="relative aspect-video">
        <Image
          src={course.thumbnail}
          alt={course.title}
          layout="fullWidth"
          aspectRatio={16 / 9}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <button className="flex size-16 items-center justify-center rounded-full bg-white/90 text-primary shadow-xl transition-transform hover:scale-105">
            <Play className="size-7 fill-current" />
          </button>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-4 flex items-baseline gap-3">
          <span className="text-3xl font-bold">
            {formatPrice(course.price, course.currency)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(course.originalPrice!, course.currency)}
              </span>
              <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-sm font-medium text-destructive">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>

        <Button size="lg" className="mb-3 w-full">
          Comprar ahora
        </Button>

        <p className="mb-6 text-center text-xs text-muted-foreground">
          Garantia de devolucion de 30 dias
        </p>

        <div className="space-y-3">
          <h4 className="font-medium">Este curso incluye:</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <Play className="size-4 shrink-0 text-primary" />
              <span>{course.lessonsCount} lecciones en video</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="size-4 shrink-0 text-primary" />
              <span>{formatDuration(course.duration)} de contenido</span>
            </li>
            <li className="flex items-center gap-2.5">
              <FileText className="size-4 shrink-0 text-primary" />
              <span>Recursos descargables</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Infinity className="size-4 shrink-0 text-primary" />
              <span>Acceso de por vida</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Medal className="size-4 shrink-0 text-primary" />
              <span>Certificado de finalizacion</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MessageCircle className="size-4 shrink-0 text-primary" />
              <span>Soporte del instructor</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function CourseRequirements({ requirements }: { requirements: string[] }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Requisitos</h2>
      <ul className="space-y-2">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-start gap-2 text-muted-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{req}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CourseObjectives({ objectives }: { objectives: string[] }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Lo que aprenderas</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {objectives.map((obj, index) => (
          <div
            key={index}
            className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 p-3"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <span className="text-sm">{obj}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CourseInstructor({ course }: { course: Course }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Tu instructor</h2>
      <div className="flex gap-4 rounded-xl border border-border/50 bg-muted/30 p-4">
        <Image
          src={course.instructor.avatar}
          alt={course.instructor.name}
          layout="fixed"
          width={80}
          height={80}
          className="rounded-xl"
        />
        <div>
          <h3 className="font-semibold">{course.instructor.name}</h3>
          <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{course.instructor.bio}</p>
        </div>
      </div>
    </div>
  );
}
