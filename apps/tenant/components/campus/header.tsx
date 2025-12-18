"use client";

import Link from "next/link";
import Image from "next/image";
import { GraduationCap, List, X, User, SignOut, BookOpen } from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetProfile } from "@/services/profile/queries";
import type { CampusTenant } from "@/services/campus/service";

type CampusHeaderProps = {
  tenant: CampusTenant;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function CampusHeader({ tenant }: CampusHeaderProps) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: profileData } = useGetProfile();

  const user = profileData?.user;
  const isAuthenticated = !!user;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
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
                <GraduationCap className="size-5 text-primary-foreground" weight="bold" />
              </div>
            )}
            {tenant.showHeaderName && (
              <span className="text-lg font-semibold tracking-tight">{tenant.name}</span>
            )}
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/">
              <Button variant="ghost" size="sm">
                {t("campus.navigation.home")}
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="ghost" size="sm">
                {t("campus.navigation.courses")}
              </Button>
            </Link>
            {isAuthenticated && (
              <Link href="/my-courses">
                <Button variant="ghost" size="sm">
                  {t("enrollments.myCourses")}
                </Button>
              </Link>
            )}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex size-9 items-center justify-center rounded-full hover:bg-accent focus:outline-none">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="size-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                    <span className="text-sm font-medium">{getInitials(user.name)}</span>
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <Link href="/my-courses">
                  <DropdownMenuItem>
                    <BookOpen className="mr-2 size-4" />
                    {t("enrollments.myCourses")}
                  </DropdownMenuItem>
                </Link>
                <Link href="/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 size-4" />
                    {t("header.profile")}
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} variant="destructive">
                  <SignOut className="mr-2 size-4" />
                  {t("common.logOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t("campus.navigation.login")}
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">{t("campus.navigation.signup")}</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <List className="size-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                {t("campus.navigation.home")}
              </Button>
            </Link>
            <Link href="/courses" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                {t("campus.navigation.courses")}
              </Button>
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/my-courses" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="mr-2 size-4" />
                    {t("enrollments.myCourses")}
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 size-4" />
                    {t("header.profile")}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <SignOut className="mr-2 size-4" />
                  {t("common.logOut")}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    {t("campus.navigation.login")}
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">{t("campus.navigation.signup")}</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
