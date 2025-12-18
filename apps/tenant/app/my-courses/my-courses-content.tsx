"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BookOpen } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EnrolledCourseCard } from "@/components/campus/enrolled-course-card";
import { useEnrollments } from "@/services/enrollments";
import { getAccessToken } from "@/lib/http";

export function MyCoursesContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: enrollmentsData, isLoading } = useEnrollments();

  useEffect(() => {
    if (typeof window !== "undefined" && !getAccessToken()) {
      router.push("/login");
    }
  }, [router]);

  const enrollments = enrollmentsData?.enrollments ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {isLoading ? (
        <CoursesGridSkeleton />
      ) : enrollments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {enrollments.map((enrollment) => (
            <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <BookOpen className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">
        {t("enrollments.empty.title")}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("enrollments.empty.description")}
      </p>
      <Link href="/courses" className="mt-4">
        <Button>{t("enrollments.empty.cta")}</Button>
      </Link>
    </div>
  );
}

function CoursesGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border/50"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="p-5">
            <Skeleton className="mb-3 h-6 w-24" />
            <Skeleton className="mb-2 h-5 w-full" />
            <Skeleton className="mb-4 h-4 w-3/4" />
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
