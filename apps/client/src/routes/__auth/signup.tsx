import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  signupWithTenantSchema,
  type SignupWithTenantInput,
} from "@/lib/schemas/auth";
import { createSeoMeta } from "@/lib/seo";
import { getTenantFromRequest } from "@/lib/tenant.server";
import { getTenantFromHost } from "@/lib/tenant";
import { getCampusTenantServer } from "@/services/campus/server";
import { useSignup } from "@/services/auth/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/__auth/signup")({
  loader: async () => {
    const tenantInfo = await getTenantFromRequest({ data: {} });

    const tenant = tenantInfo.slug
      ? await getCampusTenantServer({ data: { slug: tenantInfo.slug } }).then(
          (r) => r?.tenant
        )
      : null;
    return { tenant, isCampus: tenantInfo.isCampus };
  },
  head: ({ loaderData }) => {
    const tenantName = loaderData?.tenant?.name || "LearnBase";
    return createSeoMeta({
      title: "Sign Up",
      description: `Create your ${tenantName} account`,
      siteName: tenantName,
      noindex: true,
    });
  },
  component: SignupPage,
});

function SignupPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { mutate: signup, isPending } = useSignup();
  const { tenant, isCampus } = Route.useLoaderData();
  const isOnTenantDomain = isCampus && !!tenant;
  const totalSteps = isOnTenantDomain ? 1 : 2;
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<SignupWithTenantInput>({
    resolver: zodResolver(signupWithTenantSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      tenantName: "",
    },
  });

  async function handleNextStep() {
    const isValid = await form.trigger(["name", "email", "password", "confirmPassword"]);
    if (isValid) {
      setCurrentStep(2);
    }
  }

  function handlePrevStep() {
    setCurrentStep(1);
  }

  function onSubmit(data: SignupWithTenantInput) {
    signup(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        locale: i18n.language,
        tenantName: isOnTenantDomain ? undefined : data.tenantName,
      },
      {
        onSuccess: (response) => {
          const { user } = response;

          if (isOnTenantDomain) {
            navigate({ to: "/", search: { campus: undefined } });
          } else if (user.tenantSlug) {
            window.location.href = `/${user.tenantSlug}`;
          }
        },
      }
    );
  }

  return (
    <>
      <h3 className="mt-2 text-center text-lg font-bold text-foreground">
        {isOnTenantDomain
          ? t("auth.signup.title")
          : currentStep === 1
            ? t("auth.signup.step1Title")
            : t("auth.signup.step2Title")}
      </h3>

      {!isOnTenantDomain && (
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  currentStep > step
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < 2 && (
                <div
                  className={cn(
                    "h-0.5 w-8 transition-colors",
                    currentStep > step ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.signup.name")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("auth.signup.namePlaceholder")}
                            autoComplete="name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common.password")}</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder={t("auth.login.passwordPlaceholder")}
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.signup.confirmPassword")}</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder={t("auth.signup.confirmPasswordPlaceholder")}
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="text-center text-xs text-muted-foreground">
                    {t("auth.signup.termsText")}{" "}
                    <a href="#" className="text-primary hover:text-primary/90">
                      {t("auth.signup.termsOfUse")}
                    </a>{" "}
                    {t("auth.signup.and")}{" "}
                    <a href="#" className="text-primary hover:text-primary/90">
                      {t("auth.signup.privacyPolicy")}
                    </a>
                  </p>

                  {isOnTenantDomain ? (
                    <Button type="submit" className="w-full" isLoading={isPending}>
                      {t("auth.signup.createAccount")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleNextStep}
                    >
                      {t("common.continue")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </>
              )}

              {currentStep === 2 && !isOnTenantDomain && (
                <>
                  <FormField
                    control={form.control}
                    name="tenantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.signup.academyName")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("auth.signup.academyNamePlaceholder")}
                            autoComplete="organization"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("auth.signup.academyNameDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t("common.back")}
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      isLoading={isPending}
                    >
                      {t("auth.signup.createAcademy")}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("auth.signup.hasAccount")}{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:text-primary/90"
        >
          {t("common.signIn")}
        </Link>
      </p>
    </>
  );
}
