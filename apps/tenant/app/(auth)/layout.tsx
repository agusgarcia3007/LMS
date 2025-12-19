import { headers } from "next/headers";
import { getCampusTenantServer } from "@/services/campus/server";
import { computeThemeStyles, createGoogleFontLinks } from "@/lib/theme";
import { cn } from "@/lib/utils";
import Image from "next/image";

async function getTenantSlug(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("x-tenant-slug");
}

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const slug = await getTenantSlug();

  if (!slug) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
              L
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  }

  const tenantData = await getCampusTenantServer(slug);
  const tenant = tenantData?.tenant;

  if (!tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
          {children}
        </div>
      </div>
    );
  }

  const { themeClass, customStyles } = computeThemeStyles(tenant);
  const fontLinks = createGoogleFontLinks(tenant.customTheme);

  return (
    <>
      {fontLinks.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <div
        className={cn("flex min-h-screen items-center justify-center", themeClass)}
        style={customStyles}
      >
        <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {tenant.logo ? (
              <Image
                src={tenant.logo}
                alt={tenant.name}
                width={160}
                height={40}
                className="mx-auto h-10 w-auto object-contain"
              />
            ) : (
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
                {tenant.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
