import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Video, Bot, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "courses",
    icon: Video,
    image: "/images/demo-courses.png",
  },
  {
    id: "ai",
    icon: Bot,
    image: "/images/demo-ai.png",
  },
  {
    id: "students",
    icon: GraduationCap,
    image: "/images/demo-students.png",
  },
] as const;

export function ProductDemo() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("courses");

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <section className="bg-[var(--landing-bg-alt)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--landing-text)] sm:text-4xl">
            {t("landing.productDemo.title", { defaultValue: "See it in action" })}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--landing-text-muted)]">
            {t("landing.productDemo.subtitle", { defaultValue: "Everything you need to create and sell courses online" })}
          </p>
        </motion.div>

        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="inline-flex gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-card)] p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-[var(--landing-accent)] text-white shadow-sm"
                    : "text-[var(--landing-text-muted)] hover:text-[var(--landing-text)]"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {t(`landing.productDemo.tabs.${tab.id}`, { defaultValue: tab.id })}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="overflow-hidden rounded-xl border border-[var(--landing-border)] bg-[var(--landing-card)] shadow-2xl shadow-black/5">
            <div className="flex items-center gap-2 border-b border-[var(--landing-border)] bg-[var(--landing-bg)] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              <div className="ml-4 flex-1">
                <div className="mx-auto h-5 w-64 rounded-md bg-[var(--landing-border)]" />
              </div>
            </div>

            <div className="relative aspect-[16/9] bg-[var(--landing-bg-alt)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeTab}
                  src={activeTabData?.image}
                  alt={`LearnBase ${activeTab}`}
                  className="h-full w-full object-cover object-top"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            </div>
          </div>

          <div className="absolute -bottom-4 left-1/2 -z-10 h-[80%] w-[90%] -translate-x-1/2 rounded-xl bg-[var(--landing-accent)] opacity-5 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
