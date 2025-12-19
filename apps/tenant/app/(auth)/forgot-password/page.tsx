"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/schemas/auth";
import { useForgotPassword } from "@/services/auth/mutations";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: ForgotPasswordInput) {
    forgotPassword(data);
  }

  if (isSuccess) {
    return (
      <>
        <h3 className="mt-2 text-center text-lg font-bold text-foreground">
          {t("auth.forgotPassword.checkEmail")}
        </h3>

        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.forgotPassword.checkEmailDescription")}
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            {t("auth.forgotPassword.backToSignIn")}
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h3 className="mt-2 text-center text-lg font-bold text-foreground">
        {t("auth.forgotPassword.title")}
      </h3>

      <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <CardContent>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            {t("auth.forgotPassword.description")}
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("auth.login.emailPlaceholder")}
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" isLoading={isPending}>
                {t("auth.forgotPassword.sendResetLink")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("auth.forgotPassword.rememberPassword")}{" "}
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
