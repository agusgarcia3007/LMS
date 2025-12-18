"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  PlayCircle,
  BookOpen,
  Folder,
  Download,
  DeviceMobile,
  Certificate,
  Check,
  ShieldCheck,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CampusCourseDetail } from "@/services/campus/service";

type CourseSidebarProps = {
  course: CampusCourseDetail;
};

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("es", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const { t } = useTranslation();
  const isFree = course.price === 0;
  const hasDiscount = course.originalPrice && course.originalPrice > course.price;
  const discountPercent = hasDiscount
    ? Math.round(((course.originalPrice! - course.price) / course.originalPrice!) * 100)
    : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl">
      <div className="relative aspect-video">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <BookOpen className="size-16 text-muted-foreground" />
          </div>
        )}
        {course.previewVideoUrl && (
          <button className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30">
            <PlayCircle className="size-16 text-white" weight="fill" />
          </button>
        )}
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-baseline gap-2">
          {isFree ? (
            <span className="text-3xl font-bold text-primary">
              {t("campus.course.free")}
            </span>
          ) : (
            <>
              <span className="text-3xl font-bold">
                {formatPrice(course.price, course.currency)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(course.originalPrice!, course.currency)}
                  </span>
                  <Badge variant="destructive" className="ml-1">
                    -{discountPercent}%
                  </Badge>
                </>
              )}
            </>
          )}
        </div>

        <div className="space-y-2.5">
          {isFree ? (
            <Link href="/login">
              <Button className="w-full" size="lg">
                {t("campus.courseDetail.enrollFree")}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button className="w-full" size="lg">
                  {t("campus.courseDetail.buyNow")}
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full" size="lg">
                  {t("campus.courseDetail.addToCart")}
                </Button>
              </Link>
            </>
          )}
        </div>

        <p className="my-4 text-center text-sm text-muted-foreground">
          <ShieldCheck className="mr-1 inline-block size-4" />
          {t("campus.courseDetail.moneyBackGuarantee")}
        </p>

        <div className="space-y-3 border-t pt-4">
          <h4 className="font-semibold">{t("campus.courseDetail.includes")}</h4>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2.5">
              <PlayCircle className="size-4 text-muted-foreground" />
              <span>
                {t("campus.courseDetail.videoLessons", { count: course.itemsCount })}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Folder className="size-4 text-muted-foreground" />
              <span>
                {t("campus.courseDetail.contentModules", { count: course.modulesCount })}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Download className="size-4 text-muted-foreground" />
              <span>{t("campus.courseDetail.downloadableResources")}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="size-4 text-muted-foreground" />
              <span>{t("campus.courseDetail.lifetimeAccess")}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <DeviceMobile className="size-4 text-muted-foreground" />
              <span>{t("campus.courseDetail.mobileAccess")}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Certificate className="size-4 text-muted-foreground" />
              <span>{t("campus.courseDetail.certificate")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

type CourseRequirementsProps = {
  requirements: string[];
};

export function CourseRequirements({ requirements }: CourseRequirementsProps) {
  const { t } = useTranslation();

  if (!requirements || requirements.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">{t("campus.courseDetail.requirements")}</h2>
      <ul className="space-y-2.5">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
            <span className="text-muted-foreground">{req}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type CourseObjectivesProps = {
  objectives: string[];
};

export function CourseObjectives({ objectives }: CourseObjectivesProps) {
  const { t } = useTranslation();

  if (!objectives || objectives.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card/50 p-6">
      <h2 className="mb-5 text-xl font-bold">{t("campus.courseDetail.objectives")}</h2>
      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {objectives.map((objective, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="mt-0.5 size-5 shrink-0 text-green-500" weight="bold" />
            <span>{objective}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type CourseInstructorProps = {
  course: CampusCourseDetail;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function CourseInstructor({ course }: CourseInstructorProps) {
  const { t } = useTranslation();
  const instructor = course.instructor;

  if (!instructor) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">{t("campus.course.instructor")}</h2>
      <div className="flex items-start gap-4">
        {instructor.avatar ? (
          <Image
            src={instructor.avatar}
            alt={instructor.name}
            width={64}
            height={64}
            className="size-16 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-muted">
            <span className="text-lg font-medium">{getInitials(instructor.name)}</span>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-primary">{instructor.name}</h3>
          {instructor.title && (
            <p className="text-sm text-muted-foreground">{instructor.title}</p>
          )}
        </div>
      </div>
      {instructor.bio && (
        <p className="mt-4 leading-relaxed text-muted-foreground">{instructor.bio}</p>
      )}
    </div>
  );
}
