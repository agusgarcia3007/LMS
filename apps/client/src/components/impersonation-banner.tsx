import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { UserCircle, X } from "lucide-react";
import {
  isImpersonating,
  getImpersonationTarget,
  endImpersonation,
} from "@/lib/http";
import { QUERY_KEYS as PROFILE_KEYS } from "@/services/profile/service";

export function ImpersonationBanner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!isImpersonating()) return null;

  const target = getImpersonationTarget();
  if (!target) return null;

  const handleEnd = () => {
    if (endImpersonation()) {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.PROFILE });
      navigate({ to: "/backoffice/users" });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          <span className="text-sm font-medium">
            {t("impersonation.banner", { name: target.name })}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEnd}
          className="h-7 gap-1 text-amber-950 hover:bg-amber-600 hover:text-amber-950"
        >
          <X className="h-3 w-3" />
          {t("impersonation.end")}
        </Button>
      </div>
    </div>
  );
}
