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
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const searchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/__auth/reset-password")({
  component: ResetPasswordPage,
  validateSearch: searchSchema,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  function onSubmit(data: ResetPasswordInput) {
    console.log("Reset password submitted:", { token, ...data });
    setSubmitted(true);
  }

  if (!token) {
    return (
      <>
        <h3 className="mt-2 text-center text-lg font-bold text-foreground">
          Invalid reset link
        </h3>

        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              This password reset link is invalid or has expired.
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            to="/forgot-password"
            className="font-medium text-primary hover:text-primary/90"
          >
            Request a new reset link
          </Link>
        </p>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <h3 className="mt-2 text-center text-lg font-bold text-foreground">
          Password reset successful
        </h3>

        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              Your password has been reset. You can now sign in with your new
              password.
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            Sign in
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h3 className="mt-2 text-center text-lg font-bold text-foreground">
        Set new password
      </h3>

      <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New password"
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
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Reset password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:text-primary/90"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
