"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AvatarUpload from "@/components/file-upload/avatar-upload";
import { useGetProfile } from "@/services/profile/queries";
import { useUpdateProfile } from "@/services/profile/mutations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SpinnerGap } from "@phosphor-icons/react";
import { getAccessToken } from "@/lib/http";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

function ProfileSkeleton() {
  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <div className="size-24 rounded-full bg-muted animate-pulse" />
        <div className="text-center space-y-1">
          <div className="h-4 w-28 mx-auto bg-muted animate-pulse rounded" />
          <div className="h-3 w-36 mx-auto bg-muted animate-pulse rounded" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-12 bg-muted animate-pulse rounded" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-12 bg-muted animate-pulse rounded" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-44 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-36 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    </>
  );
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: profileData, isLoading } = useGetProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const user = profileData?.user;

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined" && !getAccessToken()) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      form.reset({ name: user.name });
    }
  }, [user, form]);

  function onSubmit(data: UpdateProfileInput) {
    updateProfile(data.name);
  }

  return (
    <div>
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">{t("profile.title")}</h1>
        </div>
      </header>
      <main className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
        {isLoading ? (
          <ProfileSkeleton />
        ) : user ? (
          <>
            <AvatarUpload currentAvatar={user.avatar} userName={user.name} />

            <Card>
              <CardHeader>
                <CardTitle>{t("profile.title")}</CardTitle>
                <CardDescription>{t("profile.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("profile.name")}</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("profile.namePlaceholder")}
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("common.email")}</Label>
                    <Input id="email" type="email" value={user.email} disabled />
                    <p className="text-sm text-muted-foreground">
                      {t("profile.emailReadonly")}
                    </p>
                  </div>

                  <Button type="submit" disabled={isPending}>
                    {isPending && <SpinnerGap className="size-4 animate-spin mr-2" />}
                    {t("profile.saveChanges")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        ) : null}
      </main>
    </div>
  );
}
