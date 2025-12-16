import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import { createSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: createSeoMeta({
      title: "Privacy Policy | Learnbase",
      description:
        "Privacy Policy for Learnbase - learn how we collect, use, and protect your data.",
    }),
  }),
});

function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("legal.privacy.title")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("legal.privacy.lastUpdated", { date: "December 16, 2025" })}
            </p>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2>{t("legal.privacy.sections.intro.title")}</h2>
              <p>{t("legal.privacy.sections.intro.content")}</p>
              <p>{t("legal.privacy.sections.intro.scope")}</p>
              <p>{t("legal.privacy.sections.intro.processor")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.collection.title")}</h2>

              <h3>{t("legal.privacy.sections.collection.direct.title")}</h3>
              <p>{t("legal.privacy.sections.collection.direct.content")}</p>
              <ul>
                <li>
                  <strong>{t("legal.privacy.sections.collection.direct.email.label")}</strong>:{" "}
                  {t("legal.privacy.sections.collection.direct.email.purpose")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.collection.direct.name.label")}</strong>:{" "}
                  {t("legal.privacy.sections.collection.direct.name.purpose")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.collection.direct.password.label")}</strong>:{" "}
                  {t("legal.privacy.sections.collection.direct.password.purpose")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.collection.direct.avatar.label")}</strong>:{" "}
                  {t("legal.privacy.sections.collection.direct.avatar.purpose")}
                </li>
              </ul>

              <h3>{t("legal.privacy.sections.collection.auto.title")}</h3>
              <p>{t("legal.privacy.sections.collection.auto.content")}</p>
              <ul>
                <li>{t("legal.privacy.sections.collection.auto.pageViews")}</li>
                <li>{t("legal.privacy.sections.collection.auto.session")}</li>
                <li>{t("legal.privacy.sections.collection.auto.userAgent")}</li>
                <li>{t("legal.privacy.sections.collection.auto.referrer")}</li>
                <li>{t("legal.privacy.sections.collection.auto.country")}</li>
              </ul>

              <h3>{t("legal.privacy.sections.collection.learning.title")}</h3>
              <ul>
                <li>{t("legal.privacy.sections.collection.learning.enrollments")}</li>
                <li>{t("legal.privacy.sections.collection.learning.progress")}</li>
                <li>{t("legal.privacy.sections.collection.learning.quizzes")}</li>
                <li>{t("legal.privacy.sections.collection.learning.certificates")}</li>
              </ul>

              <h3>{t("legal.privacy.sections.collection.payment.title")}</h3>
              <p>{t("legal.privacy.sections.collection.payment.content")}</p>
              <p>
                <strong>{t("legal.privacy.sections.collection.payment.noCards")}</strong>
              </p>

              <h3>{t("legal.privacy.sections.collection.ai.title")}</h3>
              <ul>
                <li>{t("legal.privacy.sections.collection.ai.audio")}</li>
                <li>{t("legal.privacy.sections.collection.ai.prompts")}</li>
                <li>{t("legal.privacy.sections.collection.ai.feedback")}</li>
                <li>{t("legal.privacy.sections.collection.ai.preferences")}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.use.title")}</h2>
              <ol>
                <li>{t("legal.privacy.sections.use.service")}</li>
                <li>{t("legal.privacy.sections.use.payments")}</li>
                <li>{t("legal.privacy.sections.use.emails")}</li>
                <li>{t("legal.privacy.sections.use.analytics")}</li>
                <li>{t("legal.privacy.sections.use.security")}</li>
                <li>{t("legal.privacy.sections.use.legal")}</li>
                <li>{t("legal.privacy.sections.use.ai")}</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.sharing.title")}</h2>
              <h3>{t("legal.privacy.sections.sharing.providers.title")}</h3>
              <p>{t("legal.privacy.sections.sharing.providers.content")}</p>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th>{t("legal.privacy.sections.sharing.providers.table.provider")}</th>
                      <th>{t("legal.privacy.sections.sharing.providers.table.data")}</th>
                      <th>{t("legal.privacy.sections.sharing.providers.table.purpose")}</th>
                      <th>{t("legal.privacy.sections.sharing.providers.table.location")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Stripe</td>
                      <td>{t("legal.privacy.sections.sharing.providers.stripe.data")}</td>
                      <td>{t("legal.privacy.sections.sharing.providers.stripe.purpose")}</td>
                      <td>USA/EU</td>
                    </tr>
                    <tr>
                      <td>Railway</td>
                      <td>{t("legal.privacy.sections.sharing.providers.railway.data")}</td>
                      <td>{t("legal.privacy.sections.sharing.providers.railway.purpose")}</td>
                      <td>USA</td>
                    </tr>
                    <tr>
                      <td>Cloudflare</td>
                      <td>{t("legal.privacy.sections.sharing.providers.cloudflare.data")}</td>
                      <td>{t("legal.privacy.sections.sharing.providers.cloudflare.purpose")}</td>
                      <td>Global</td>
                    </tr>
                    <tr>
                      <td>Resend</td>
                      <td>{t("legal.privacy.sections.sharing.providers.resend.data")}</td>
                      <td>{t("legal.privacy.sections.sharing.providers.resend.purpose")}</td>
                      <td>USA</td>
                    </tr>
                    <tr>
                      <td>Groq</td>
                      <td>{t("legal.privacy.sections.sharing.providers.groq.data")}</td>
                      <td>{t("legal.privacy.sections.sharing.providers.groq.purpose")}</td>
                      <td>USA</td>
                    </tr>
                    <tr>
                      <td>Google AI</td>
                      <td>{t("legal.privacy.sections.sharing.providers.google.data")}</td>
                      <td>{t("legal.privacy.sections.sharing.providers.google.purpose")}</td>
                      <td>USA</td>
                    </tr>
                    <tr>
                      <td>OpenAI</td>
                      <td>{t("legal.privacy.sections.sharing.providers.openai.data")}</td>
                      <td>{t("legal.privacy.sections.sharing.providers.openai.purpose")}</td>
                      <td>USA</td>
                    </tr>
                    <tr>
                      <td>Langfuse</td>
                      <td>{t("legal.privacy.sections.sharing.providers.langfuse.data")}</td>
                      <td>{t("legal.privacy.sections.sharing.providers.langfuse.purpose")}</td>
                      <td>USA</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>{t("legal.privacy.sections.sharing.legal.title")}</h3>
              <p>{t("legal.privacy.sections.sharing.legal.content")}</p>

              <h3>{t("legal.privacy.sections.sharing.business.title")}</h3>
              <p>{t("legal.privacy.sections.sharing.business.content")}</p>

              <p>
                <strong>{t("legal.privacy.sections.sharing.noSale")}</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.transfers.title")}</h2>
              <p>{t("legal.privacy.sections.transfers.content")}</p>
              <p>{t("legal.privacy.sections.transfers.scc")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.retention.title")}</h2>
              <ul>
                <li>
                  <strong>{t("legal.privacy.sections.retention.account.label")}</strong>:{" "}
                  {t("legal.privacy.sections.retention.account.period")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.retention.payment.label")}</strong>:{" "}
                  {t("legal.privacy.sections.retention.payment.period")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.retention.learning.label")}</strong>:{" "}
                  {t("legal.privacy.sections.retention.learning.period")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.retention.certificates.label")}</strong>:{" "}
                  {t("legal.privacy.sections.retention.certificates.period")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.retention.analytics.label")}</strong>:{" "}
                  {t("legal.privacy.sections.retention.analytics.period")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.retention.logs.label")}</strong>:{" "}
                  {t("legal.privacy.sections.retention.logs.period")}
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.gdpr.title")}</h2>
              <p>{t("legal.privacy.sections.gdpr.content")}</p>
              <ul>
                <li>
                  <strong>{t("legal.privacy.sections.gdpr.access.label")}</strong>:{" "}
                  {t("legal.privacy.sections.gdpr.access.description")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.gdpr.rectification.label")}</strong>:{" "}
                  {t("legal.privacy.sections.gdpr.rectification.description")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.gdpr.erasure.label")}</strong>:{" "}
                  {t("legal.privacy.sections.gdpr.erasure.description")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.gdpr.restriction.label")}</strong>:{" "}
                  {t("legal.privacy.sections.gdpr.restriction.description")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.gdpr.portability.label")}</strong>:{" "}
                  {t("legal.privacy.sections.gdpr.portability.description")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.gdpr.object.label")}</strong>:{" "}
                  {t("legal.privacy.sections.gdpr.object.description")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.gdpr.withdraw.label")}</strong>:{" "}
                  {t("legal.privacy.sections.gdpr.withdraw.description")}
                </li>
              </ul>
              <p>{t("legal.privacy.sections.gdpr.contact")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.ccpa.title")}</h2>
              <p>{t("legal.privacy.sections.ccpa.content")}</p>
              <ul>
                <li>
                  <strong>{t("legal.privacy.sections.ccpa.know.label")}</strong>:{" "}
                  {t("legal.privacy.sections.ccpa.know.description")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.ccpa.delete.label")}</strong>:{" "}
                  {t("legal.privacy.sections.ccpa.delete.description")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.ccpa.optout.label")}</strong>:{" "}
                  {t("legal.privacy.sections.ccpa.optout.description")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.ccpa.nondiscrimination.label")}</strong>:{" "}
                  {t("legal.privacy.sections.ccpa.nondiscrimination.description")}
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.cookies.title")}</h2>
              <p>{t("legal.privacy.sections.cookies.content")}</p>
              <ul>
                <li>
                  <strong>{t("legal.privacy.sections.cookies.noCookies")}</strong>
                </li>
                <li>
                  <strong>localStorage:</strong>{" "}
                  {t("legal.privacy.sections.cookies.localStorage")}
                </li>
                <li>
                  <strong>sessionStorage:</strong>{" "}
                  {t("legal.privacy.sections.cookies.sessionStorage")}
                </li>
                <li>
                  <strong>Umami:</strong>{" "}
                  {t("legal.privacy.sections.cookies.umami")}
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.security.title")}</h2>
              <p>{t("legal.privacy.sections.security.content")}</p>
              <ul>
                <li>{t("legal.privacy.sections.security.passwords")}</li>
                <li>{t("legal.privacy.sections.security.jwt")}</li>
                <li>{t("legal.privacy.sections.security.https")}</li>
                <li>{t("legal.privacy.sections.security.presigned")}</li>
                <li>{t("legal.privacy.sections.security.rbac")}</li>
                <li>{t("legal.privacy.sections.security.isolation")}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.children.title")}</h2>
              <p>{t("legal.privacy.sections.children.content")}</p>
              <p>{t("legal.privacy.sections.children.tenants")}</p>
              <p>{t("legal.privacy.sections.children.contact")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.multiTenant.title")}</h2>
              <p>{t("legal.privacy.sections.multiTenant.content")}</p>
              <ul>
                <li>
                  <strong>Learnbase:</strong>{" "}
                  {t("legal.privacy.sections.multiTenant.processor")}
                </li>
                <li>
                  <strong>{t("legal.privacy.sections.multiTenant.owners.label")}:</strong>{" "}
                  {t("legal.privacy.sections.multiTenant.owners.description")}
                </li>
              </ul>
              <p>{t("legal.privacy.sections.multiTenant.review")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.ai.title")}</h2>
              <p>{t("legal.privacy.sections.ai.content")}</p>
              <ul>
                <li>{t("legal.privacy.sections.ai.transcription")}</li>
                <li>{t("legal.privacy.sections.ai.generation")}</li>
                <li>{t("legal.privacy.sections.ai.chat")}</li>
                <li>{t("legal.privacy.sections.ai.images")}</li>
              </ul>
              <p>{t("legal.privacy.sections.ai.providers")}</p>
              <p>{t("legal.privacy.sections.ai.monitoring")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.changes.title")}</h2>
              <p>{t("legal.privacy.sections.changes.content")}</p>
            </section>

            <section className="mb-8">
              <h2>{t("legal.privacy.sections.contact.title")}</h2>
              <p>{t("legal.privacy.sections.contact.content")}</p>
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
              <p>{t("legal.privacy.sections.contact.subject")}</p>
            </section>

            <section className="mt-12 border-t pt-8">
              <p className="text-sm text-muted-foreground">
                {t("legal.privacy.seeAlso")}{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  {t("legal.terms.title")}
                </Link>
              </p>
            </section>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
