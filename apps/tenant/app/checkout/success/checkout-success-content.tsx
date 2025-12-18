"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  CheckCircleIcon,
  BookOpenIcon,
  SpinnerGapIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSessionStatus } from "@/services/checkout";

export function CheckoutSuccessContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";

  const { data, isLoading, isError } = useSessionStatus(sessionId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <SpinnerGapIcon className="size-12 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">{t("checkout.verifying")}</p>
        </div>
      </div>
    );
  }

  const isSuccess = data?.paymentStatus === "paid";

  if (isError || !isSuccess) {
    return (
      <div className="container mx-auto max-w-lg py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircleIcon className="size-8 text-destructive" />
            </div>
            <CardTitle>{t("checkout.error.title")}</CardTitle>
            <CardDescription>{t("checkout.error.description")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Link href="/courses">
              <Button>{t("checkout.backToCourses")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircleIcon className="size-8 text-green-500" weight="fill" />
          </div>
          <CardTitle>{t("checkout.success.title")}</CardTitle>
          <CardDescription>{t("checkout.success.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-muted-foreground">
            {t("checkout.success.emailConfirmation")}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/my-courses">
              <Button className="gap-2">
                <BookOpenIcon className="size-4" />
                {t("checkout.success.goToCourses")}
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline">
                {t("checkout.success.continueShopping")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
