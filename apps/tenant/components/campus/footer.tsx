import Link from "next/link";
import Image from "next/image";
import { GraduationCap, TwitterLogo, FacebookLogo, InstagramLogo, LinkedinLogo, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";
import type { CampusTenant } from "@/services/campus/service";

type CampusFooterProps = {
  tenant: CampusTenant;
};

export function CampusFooter({ tenant }: CampusFooterProps) {
  const currentYear = new Date().getFullYear();
  const socialLinks = tenant.socialLinks;

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo ? (
              <Image
                src={tenant.logo}
                alt={tenant.name}
                width={40}
                height={40}
                className="size-10 rounded-lg object-cover"
              />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="size-6 text-primary-foreground" weight="bold" />
              </div>
            )}
            <span className="text-lg font-semibold">{tenant.name}</span>
          </div>

          {socialLinks && (
            <div className="flex items-center gap-4">
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <TwitterLogo className="size-5" />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <FacebookLogo className="size-5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <InstagramLogo className="size-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LinkedinLogo className="size-5" />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <YoutubeLogo className="size-5" />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-border/40 pt-8">
          <div className="flex flex-col items-center gap-4 text-center text-sm text-muted-foreground md:flex-row md:justify-between">
            <p>
              {tenant.footerText || `${currentYear} ${tenant.name}. Todos los derechos reservados.`}
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="hover:text-foreground">
                Terminos
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacidad
              </Link>
              {tenant.contactEmail && (
                <a href={`mailto:${tenant.contactEmail}`} className="hover:text-foreground">
                  Contacto
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
