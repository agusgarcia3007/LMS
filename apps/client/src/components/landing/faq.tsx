import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = ["ai", "domain", "data", "pricing"];

export function FAQ() {
  const { t } = useTranslation();

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl">
            {t("landing.faq.title")}
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            {t("landing.faq.subtitle")}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
          >
            {faqItems.map((item) => (
              <AccordionItem key={item} value={item} className="border-dashed">
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {t(`landing.faq.items.${item}.question`)}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base text-muted-foreground">
                    {t(`landing.faq.items.${item}.answer`)}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
