import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const faqItems = ["ai", "domain", "data", "pricing"];

export function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-[800px] px-4">
        <h2 className="mb-16 text-center text-3xl font-bold sm:text-4xl md:text-5xl">
          {t("landing.faq.title")}
        </h2>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={item}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted/50"
              >
                <span className="pr-8 font-semibold">
                  {t(`landing.faq.items.${item}.question`)}
                </span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-4 text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.faq.items.${item}.answer`)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
