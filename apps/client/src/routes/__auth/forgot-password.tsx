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
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/__auth/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: ForgotPasswordInput) {
    console.log("Forgot password submitted:", data);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <h3 className="mt-2 text-center text-lg font-bold text-foreground">
          Check your email
        </h3>

        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              If an account exists with that email, we've sent you a link to
              reset your password.
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            Back to sign in
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h3 className="mt-2 text-center text-lg font-bold text-foreground">
        Reset your password
      </h3>

      <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <CardContent>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Send reset link
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
