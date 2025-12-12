import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SplitText from "@/components/SplitText";
import { useJoinWaitlist } from "@/services/waitlist";

export function Waitlist() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const { mutate, isPending, isSuccess } = useJoinWaitlist();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    mutate(email.trim());
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden bg-muted/30 py-24 md:py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-4xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <SplitText
            text={t("landing.waitlist.title")}
            className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl"
            delay={30}
            duration={0.6}
            splitType="words"
            tag="h2"
          />
          <p className="mt-4 text-lg text-muted-foreground">
            {t("landing.waitlist.subtitle")}
          </p>
        </div>

        <div className="mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 via-muted/50 to-transparent p-1">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="rounded-[calc(1.5rem-4px)] bg-card/80 p-8 backdrop-blur-xl md:p-12">
              {isSuccess ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {t("landing.waitlist.success_title")}
                  </h3>
                  <p className="max-w-md text-muted-foreground">
                    {t("landing.waitlist.success_message")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
                      <Mail className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {t("landing.waitlist.form_title")}
                    </h3>
                    <p className="max-w-md text-muted-foreground">
                      {t("landing.waitlist.form_description")}
                    </p>
                  </div>

                  <div className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row">
                    <Input
                      type="email"
                      placeholder={t("landing.waitlist.email_placeholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 flex-1"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      isLoading={isPending}
                      className="h-12 sm:w-auto"
                    >
                      {t("landing.waitlist.cta")}
                    </Button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    {t("landing.waitlist.privacy")}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
