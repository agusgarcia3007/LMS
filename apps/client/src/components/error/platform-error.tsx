import { useTranslation } from "react-i18next";
import { ErrorPage } from "./error-page";

type PlatformErrorProps = {
  error: Error;
  reset?: () => void;
  showDetails?: boolean;
  isNotFound?: boolean;
};

export function PlatformErrorPage({
  error,
  reset,
  showDetails = false,
  isNotFound = false,
}: PlatformErrorProps) {
  const { t } = useTranslation();

  const logo = (
    <span className="text-2xl font-bold tracking-tight">LearnBase</span>
  );

  return (
    <ErrorPage
      error={error}
      reset={reset}
      showDetails={showDetails}
      title={isNotFound ? t("errors.notFoundTitle") : t("errors.pageTitle")}
      description={
        isNotFound ? t("errors.notFoundDescription") : t("errors.pageDescription")
      }
      actionLabel={reset ? t("errors.tryAgain") : t("errors.backToHome")}
      actionHref={reset ? undefined : "/"}
      logo={logo}
    />
  );
}
