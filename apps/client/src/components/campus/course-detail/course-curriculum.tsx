import { ChevronDown, FileText, Play, HelpCircle, Lock, Eye } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { Course, CourseModule } from "@/data/mock-courses";
import { formatDuration } from "@/data/mock-courses";

type CourseCurriculumProps = {
  course: Course;
};

const lessonTypeIcons = {
  video: Play,
  text: FileText,
  quiz: HelpCircle,
};

function ModuleItem({ module, index }: { module: CourseModule; index: number }) {
  const totalLessons = module.lessons.length;

  return (
    <AccordionItem value={module.id} className="border-b border-border/50">
      <AccordionTrigger className="px-4 py-4 hover:bg-muted/50 hover:no-underline [&[data-state=open]]:bg-muted/50">
        <div className="flex flex-1 items-center gap-4 text-left">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
            {index + 1}
          </span>
          <div className="flex-1">
            <div className="font-medium">{module.title}</div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              {totalLessons} lecciones · {formatDuration(module.duration)}
            </div>
          </div>
        </div>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </AccordionTrigger>
      <AccordionContent className="pb-0">
        <ul className="divide-y divide-border/30">
          {module.lessons.map((lesson) => {
            const Icon = lessonTypeIcons[lesson.type];
            return (
              <li
                key={lesson.id}
                className="flex items-center gap-3 px-4 py-3 text-sm"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1">{lesson.title}</span>
                <div className="flex items-center gap-2">
                  {lesson.isPreview ? (
                    <Badge variant="secondary" size="xs" className="gap-1">
                      <Eye className="size-3" />
                      Vista previa
                    </Badge>
                  ) : (
                    <Lock className="size-3.5 text-muted-foreground/50" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {lesson.duration}min
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}

export function CourseCurriculum({ course }: CourseCurriculumProps) {
  const totalModules = course.modules.length;
  const totalDuration = course.modules.reduce((acc, m) => acc + m.duration, 0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Contenido del curso</h2>
        <span className="text-sm text-muted-foreground">
          {totalModules} modulos · {formatDuration(totalDuration)}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/50">
        <Accordion type="multiple" defaultValue={[course.modules[0]?.id]}>
          {course.modules.map((module, index) => (
            <ModuleItem key={module.id} module={module} index={index} />
          ))}
        </Accordion>
      </div>
    </div>
  );
}
