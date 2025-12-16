import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import { createSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: createSeoMeta({
      title: "Terms of Service | Learnbase",
      description:
        "Terms of Service for Learnbase - the platform for creating and managing online academies.",
    }),
  }),
});

function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("legal.terms.title")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("legal.terms.lastUpdated", { date: "December 16, 2024" })}
            </p>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2>{t("legal.terms.sections.acceptance.title")}</h2>
              <p>{t("legal.terms.sections.acceptance.content")}</p>
              <p>{t("legal.terms.sections.acceptance.age")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.description.title")}</h2>
              <p>{t("legal.terms.sections.description.content")}</p>
              <ul>
                <li>{t("legal.terms.sections.description.features.academies")}</li>
                <li>{t("legal.terms.sections.description.features.courses")}</li>
                <li>{t("legal.terms.sections.description.features.students")}</li>
                <li>{t("legal.terms.sections.description.features.certificates")}</li>
                <li>{t("legal.terms.sections.description.features.payments")}</li>
                <li>{t("legal.terms.sections.description.features.ai")}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.accounts.title")}</h2>
              <p>{t("legal.terms.sections.accounts.content")}</p>
              <h3>{t("legal.terms.sections.accounts.roles.title")}</h3>
              <ul>
                <li>
                  <strong>{t("legal.terms.sections.accounts.roles.owner.title")}</strong>:{" "}
                  {t("legal.terms.sections.accounts.roles.owner.description")}
                </li>
                <li>
                  <strong>{t("legal.terms.sections.accounts.roles.admin.title")}</strong>:{" "}
                  {t("legal.terms.sections.accounts.roles.admin.description")}
                </li>
                <li>
                  <strong>{t("legal.terms.sections.accounts.roles.student.title")}</strong>:{" "}
                  {t("legal.terms.sections.accounts.roles.student.description")}
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.billing.title")}</h2>
              <p>{t("legal.terms.sections.billing.content")}</p>
              <h3>{t("legal.terms.sections.billing.plans.title")}</h3>
              <ul>
                <li>
                  <strong>Starter:</strong> $49/month - 5% commission
                </li>
                <li>
                  <strong>Growth:</strong> $99/month - 2% commission
                </li>
                <li>
                  <strong>Scale:</strong> $349/month - 0% commission
                </li>
              </ul>
              <p>{t("legal.terms.sections.billing.renewal")}</p>
              <p>{t("legal.terms.sections.billing.refund")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.stripeConnect.title")}</h2>
              <p>{t("legal.terms.sections.stripeConnect.content")}</p>
              <p>{t("legal.terms.sections.stripeConnect.responsibility")}</p>
              <p>{t("legal.terms.sections.stripeConnect.courseRefunds")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.ip.title")}</h2>
              <p>{t("legal.terms.sections.ip.platform")}</p>
              <p>{t("legal.terms.sections.ip.userContent")}</p>
              <p>{t("legal.terms.sections.ip.license")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.acceptableUse.title")}</h2>
              <p>{t("legal.terms.sections.acceptableUse.content")}</p>
              <ul>
                <li>{t("legal.terms.sections.acceptableUse.prohibited.illegal")}</li>
                <li>{t("legal.terms.sections.acceptableUse.prohibited.copyright")}</li>
                <li>{t("legal.terms.sections.acceptableUse.prohibited.harassment")}</li>
                <li>{t("legal.terms.sections.acceptableUse.prohibited.malware")}</li>
                <li>{t("legal.terms.sections.acceptableUse.prohibited.ai")}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.ai.title")}</h2>
              <p>{t("legal.terms.sections.ai.content")}</p>
              <p>{t("legal.terms.sections.ai.providers")}</p>
              <p>{t("legal.terms.sections.ai.responsibility")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.certificates.title")}</h2>
              <p>{t("legal.terms.sections.certificates.content")}</p>
              <p>{t("legal.terms.sections.certificates.permanence")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.privacy.title")}</h2>
              <p>
                {t("legal.terms.sections.privacy.content")}{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  {t("legal.terms.sections.privacy.link")}
                </Link>
                .
              </p>
              <p>{t("legal.terms.sections.privacy.dataController")}</p>
              <p>{t("legal.terms.sections.privacy.dpa")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.liability.title")}</h2>
              <p>{t("legal.terms.sections.liability.warranty")}</p>
              <p>{t("legal.terms.sections.liability.limitation")}</p>
              <p>{t("legal.terms.sections.liability.exclusions")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.indemnification.title")}</h2>
              <p>{t("legal.terms.sections.indemnification.content")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.termination.title")}</h2>
              <p>{t("legal.terms.sections.termination.user")}</p>
              <p>{t("legal.terms.sections.termination.platform")}</p>
              <p>{t("legal.terms.sections.termination.effect")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.disputes.title")}</h2>
              <p>{t("legal.terms.sections.disputes.law")}</p>
              <p>{t("legal.terms.sections.disputes.resolution")}</p>
              <p>{t("legal.terms.sections.disputes.arbitration")}</p>
              <p>{t("legal.terms.sections.disputes.classAction")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.changes.title")}</h2>
              <p>{t("legal.terms.sections.changes.content")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.terms.sections.contact.title")}</h2>
              <p>{t("legal.terms.sections.contact.content")}</p>
              <p>
                <strong>Learnbase LLC</strong>
                <br />
                Email:{" "}
                <a
                  href="mailto:hello@uselearnbase.com"
                  className="text-primary hover:underline"
                >
                  hello@uselearnbase.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
