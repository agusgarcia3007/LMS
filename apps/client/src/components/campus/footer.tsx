import { GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Image } from "@/components/ui/image";
import type { CampusTenant } from "@/services/campus/service";

type CampusFooterProps = {
  tenant: CampusTenant;
};

export function CampusFooter({ tenant }: CampusFooterProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2.5">
            {tenant.logo ? (
              <Image
                src={tenant.logo}
                alt={tenant.name}
                width={36}
                height={36}
                className="size-9 rounded-lg object-cover"
              />
            ) : (
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="size-5 text-primary-foreground" />
              </div>
            )}
            <span className="text-lg font-semibold tracking-tight">{tenant.name}</span>
          </div>

          <p className="max-w-md text-sm text-muted-foreground">
            {tenant.footerText || t("campus.footer.defaultText")}
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">
              {t("campus.footer.terms")}
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              {t("campus.footer.privacy")}
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              {t("campus.footer.contact")}
            </a>
          </div>

          <div className="pt-4 text-xs text-muted-foreground/60">
            &copy; {currentYear} {tenant.name}. {t("campus.footer.copyright")}
          </div>
        </div>
      </div>
    </footer>
  );
}
