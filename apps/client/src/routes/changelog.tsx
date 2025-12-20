import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import { createSeoMeta } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Bug, Zap, RefreshCw, FileText, Palette } from "lucide-react";
import changelogContent from "../../../../CHANGELOG.md?raw";

export const Route = createFileRoute("/changelog")({
  component: ChangelogPage,
  head: () =>
    createSeoMeta({
      title: "Changelog | Learnbase",
      description:
        "See what's new in Learnbase - latest features, improvements, and bug fixes.",
    }),
});

type ChangeGroup = {
  title: string;
  items: string[];
};

type ChangelogEntry = {
  version: string;
  groups: ChangeGroup[];
};

function parseChangelog(content: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  const lines = content.split("\n");

  let currentEntry: ChangelogEntry | null = null;
  let currentGroup: ChangeGroup | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentEntry) {
        if (currentGroup && currentGroup.items.length > 0) {
          currentEntry.groups.push(currentGroup);
        }
        entries.push(currentEntry);
      }
      currentEntry = { version: line.replace("## ", "").trim(), groups: [] };
      currentGroup = null;
    } else if (line.startsWith("### ") && currentEntry) {
      if (currentGroup && currentGroup.items.length > 0) {
        currentEntry.groups.push(currentGroup);
      }
      currentGroup = { title: line.replace("### ", "").trim(), items: [] };
    } else if (line.startsWith("- ") && currentGroup) {
      currentGroup.items.push(line.replace("- ", "").trim());
    }
  }

  if (currentEntry) {
    if (currentGroup && currentGroup.items.length > 0) {
      currentEntry.groups.push(currentGroup);
    }
    entries.push(currentEntry);
  }

  return entries;
}

const groupConfig: Record<
  string,
  { icon: typeof Sparkles; color: string; bgColor: string }
> = {
  Features: {
    icon: Sparkles,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  "Bug Fixes": {
    icon: Bug,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
  },
  Performance: {
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  Refactor: {
    icon: RefreshCw,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  Documentation: {
    icon: FileText,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  Styling: {
    icon: Palette,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-500/10",
  },
};

function ChangelogPage() {
  const { t } = useTranslation();
  const entries = parseChangelog(changelogContent);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              {t("landing.footer.changelog")}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {t("changelog.subtitle", "All the latest updates and improvements to Learnbase.")}
            </p>
          </div>

          <div className="relative space-y-12">
            <div className="absolute left-[19px] top-0 h-full w-px bg-border" />

            {entries.map((entry, entryIndex) => (
              <div key={entryIndex} className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative z-10 flex size-10 items-center justify-center rounded-full border bg-background">
                    <div className="size-3 rounded-full bg-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{entry.version}</h2>
                </div>

                <div className="ml-14 space-y-6">
                  {entry.groups.map((group, groupIndex) => {
                    const config = groupConfig[group.title] || {
                      icon: Sparkles,
                      color: "text-gray-600",
                      bgColor: "bg-gray-500/10",
                    };
                    const Icon = config.icon;

                    return (
                      <div key={groupIndex}>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="secondary"
                            className={`${config.bgColor} ${config.color} border-0 gap-1.5`}
                          >
                            <Icon className="size-3.5" />
                            {group.title}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {group.items.length} {group.items.length === 1 ? "change" : "changes"}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {group.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
