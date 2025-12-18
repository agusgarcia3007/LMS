"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  House,
  BookOpen,
  Stack,
  Video,
  FileText,
  ListChecks,
  FolderSimple,
  Users,
  UserCircle,
  GraduationCap,
  Gear,
  Palette,
  Sparkle,
  CreditCard,
  ChartLineUp,
  Bank,
  CaretDown,
  CaretRight,
  SignOut,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { canManageSite, canViewFinance } from "@/lib/permissions";
import { useLogout } from "@/services/auth/mutations";
import type { User } from "@/services/profile/service";
import type { Tenant } from "@/services/tenants/service";

type DashboardSidebarProps = {
  tenant: Tenant;
  user: User;
  isOpen: boolean;
  onToggle: () => void;
};

type NavItem = {
  title: string;
  href?: string;
  icon: React.ElementType;
  isActive?: boolean;
  children?: NavItem[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

export function DashboardSidebar({ tenant, user, isOpen, onToggle }: DashboardSidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["moduleItems", "finance"]));

  const tenantSlug = tenant.slug;

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const moduleItemsChildren: NavItem[] = [
    {
      title: t("dashboard.sidebar.videos"),
      href: `/${tenantSlug}/content/videos`,
      icon: Video,
      isActive: pathname.endsWith("/content/videos"),
    },
    {
      title: t("dashboard.sidebar.documents"),
      href: `/${tenantSlug}/content/documents`,
      icon: FileText,
      isActive: pathname.endsWith("/content/documents"),
    },
    {
      title: t("dashboard.sidebar.quizzes"),
      href: `/${tenantSlug}/content/quizzes`,
      icon: ListChecks,
      isActive: pathname.endsWith("/content/quizzes"),
    },
  ];

  const financeChildren: NavItem[] = [
    {
      title: t("dashboard.sidebar.subscription"),
      href: `/${tenantSlug}/finance/subscription`,
      icon: CreditCard,
      isActive: pathname.includes("/finance/subscription"),
    },
    {
      title: t("dashboard.sidebar.revenue"),
      href: `/${tenantSlug}/finance/revenue`,
      icon: ChartLineUp,
      isActive: pathname.includes("/finance/revenue"),
    },
    {
      title: t("dashboard.sidebar.payouts"),
      href: `/${tenantSlug}/finance/payouts`,
      icon: Bank,
      isActive: pathname.includes("/finance/payouts"),
    },
  ];

  const navGroups: NavGroup[] = [
    {
      title: t("dashboard.sidebar.overview"),
      items: [
        {
          title: t("dashboard.sidebar.home"),
          href: `/${tenantSlug}`,
          icon: House,
          isActive: pathname === `/${tenantSlug}`,
        },
      ],
    },
    {
      title: t("dashboard.sidebar.content"),
      items: [
        {
          title: t("dashboard.sidebar.courses"),
          href: `/${tenantSlug}/content/courses`,
          icon: BookOpen,
          isActive: pathname.endsWith("/content/courses"),
        },
        {
          title: t("dashboard.sidebar.modules"),
          href: `/${tenantSlug}/content/modules`,
          icon: Stack,
          isActive: pathname.endsWith("/content/modules"),
        },
        {
          title: t("dashboard.sidebar.moduleItems"),
          icon: Video,
          children: moduleItemsChildren,
          isActive: moduleItemsChildren.some((c) => c.isActive),
        },
        {
          title: t("dashboard.sidebar.categories"),
          href: `/${tenantSlug}/content/categories`,
          icon: FolderSimple,
          isActive: pathname.endsWith("/content/categories"),
        },
      ],
    },
    {
      title: t("dashboard.sidebar.management"),
      items: [
        {
          title: t("dashboard.sidebar.instructors"),
          href: `/${tenantSlug}/management/instructors`,
          icon: UserCircle,
          isActive: pathname.endsWith("/management/instructors"),
        },
        {
          title: t("dashboard.sidebar.users"),
          href: `/${tenantSlug}/management/users`,
          icon: Users,
          isActive: pathname.endsWith("/management/users"),
        },
        {
          title: t("dashboard.sidebar.enrollments"),
          href: `/${tenantSlug}/management/enrollments`,
          icon: GraduationCap,
          isActive: pathname.endsWith("/management/enrollments"),
        },
      ],
    },
    ...(canManageSite(user.role)
      ? [
          {
            title: t("dashboard.sidebar.mySite"),
            items: [
              {
                title: t("dashboard.sidebar.configuration"),
                href: `/${tenantSlug}/site/configuration`,
                icon: Gear,
                isActive: pathname.includes("/site/configuration"),
              },
              {
                title: t("dashboard.sidebar.customization"),
                href: `/${tenantSlug}/site/customization`,
                icon: Palette,
                isActive: pathname.includes("/site/customization"),
              },
              {
                title: t("dashboard.sidebar.aiAssistant"),
                href: `/${tenantSlug}/site/ai`,
                icon: Sparkle,
                isActive: pathname.includes("/site/ai"),
              },
            ],
          },
        ]
      : []),
    ...(canViewFinance(user.role)
      ? [
          {
            title: t("dashboard.sidebar.finance"),
            items: [
              {
                title: t("dashboard.sidebar.finance"),
                icon: CreditCard,
                children: financeChildren,
                isActive: financeChildren.some((c) => c.isActive),
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background transition-transform lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href={`/${tenantSlug}`} className="flex items-center gap-3">
            {tenant.logo ? (
              <img
                src={tenant.logo}
                alt={tenant.name}
                className="size-8 rounded-lg object-cover"
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                {tenant.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-semibold">{tenant.name}</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onToggle}
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-auto p-3">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-4">
              <p className="mb-2 px-3 text-xs font-medium uppercase text-muted-foreground">
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <NavItemComponent
                    key={item.title}
                    item={item}
                    expandedItems={expandedItems}
                    onToggleExpand={toggleExpanded}
                  />
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              disabled={isLoggingOut}
            >
              <SignOut className="size-5" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

type NavItemComponentProps = {
  item: NavItem;
  expandedItems: Set<string>;
  onToggleExpand: (key: string) => void;
};

function NavItemComponent({ item, expandedItems, onToggleExpand }: NavItemComponentProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.has(item.title);
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <li>
        <button
          onClick={() => onToggleExpand(item.title)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            item.isActive
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          )}
        >
          <Icon className="size-5" />
          <span className="flex-1 text-left">{item.title}</span>
          {isExpanded ? (
            <CaretDown className="size-4" />
          ) : (
            <CaretRight className="size-4" />
          )}
        </button>
        {isExpanded && (
          <ul className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
            {item.children!.map((child) => (
              <NavItemComponent
                key={child.title}
                item={child}
                expandedItems={expandedItems}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href!}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          item.isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
        )}
      >
        <Icon className="size-5" />
        <span>{item.title}</span>
      </Link>
    </li>
  );
}
