"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CheckCircle, SpinnerGap, XCircle } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVerifyEmail } from "@/services/auth/mutations";

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutate: verifyEmail, isPending, isSuccess, isError } = useVerifyEmail();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  if (!token) {
    return (
      <>
        <h3 className="mt-2 text-center text-lg font-bold text-foreground">
          {t("auth.emailVerification.errorTitle")}
        </h3>

        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent className="flex flex-col items-center gap-4">
            <XCircle className="size-12 text-destructive" />
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.emailVerification.errorInvalid")}
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            {t("common.signIn")}
          </Link>
        </p>
      </>
    );
  }

  if (isPending) {
    return (
      <>
        <h3 className="mt-2 text-center text-lg font-bold text-foreground">
          {t("auth.emailVerification.pageTitle")}
        </h3>

        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent className="flex flex-col items-center gap-4">
            <SpinnerGap className="size-12 animate-spin text-primary" />
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.emailVerification.verifying")}
            </p>
          </CardContent>
        </Card>
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <h3 className="mt-2 text-center text-lg font-bold text-foreground">
          {t("auth.emailVerification.successTitle")}
        </h3>

        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent className="flex flex-col items-center gap-4">
            <CheckCircle className="size-12 text-green-500" />
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.emailVerification.successDescription")}
            </p>
            <Link href="/login" className={buttonVariants({ className: "w-full" })}>
              {t("auth.emailVerification.goToDashboard")}
            </Link>
          </CardContent>
        </Card>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <h3 className="mt-2 text-center text-lg font-bold text-foreground">
          {t("auth.emailVerification.errorTitle")}
        </h3>

        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent className="flex flex-col items-center gap-4">
            <XCircle className="size-12 text-destructive" />
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.emailVerification.errorExpired")}
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            {t("auth.emailVerification.requestNewLink")}
          </Link>
        </p>
      </>
    );
  }

  return null;
}
