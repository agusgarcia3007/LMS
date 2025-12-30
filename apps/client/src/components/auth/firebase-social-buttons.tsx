import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { IconBrandGoogle, IconBrandApple } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  getFirebaseAuth,
  signInWithGoogle,
  signInWithApple,
  type FirebaseConfig,
} from "@/lib/firebase";
import { useExternalLogin } from "@/services/auth/mutations";

interface FirebaseSocialButtonsProps {
  tenantSlug: string;
  firebaseConfig: FirebaseConfig;
  onSuccess: () => void;
  enableGoogle?: boolean;
  enableApple?: boolean;
}

export function FirebaseSocialButtons({
  tenantSlug,
  firebaseConfig,
  onSuccess,
  enableGoogle = true,
  enableApple = true,
}: FirebaseSocialButtonsProps) {
  const { t } = useTranslation();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const { mutate: externalLogin } = useExternalLogin();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const auth = getFirebaseAuth(tenantSlug, firebaseConfig);
      const { idToken, photoUrl } = await signInWithGoogle(auth);
      externalLogin({ token: idToken, photoUrl }, { onSuccess });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error(t("auth.social.error"));
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    try {
      const auth = getFirebaseAuth(tenantSlug, firebaseConfig);
      const { idToken, photoUrl } = await signInWithApple(auth);
      externalLogin({ token: idToken, photoUrl }, { onSuccess });
    } catch (error) {
      console.error("Apple sign-in error:", error);
      toast.error(t("auth.social.error"));
      setIsAppleLoading(false);
    }
  };

  if (!enableGoogle && !enableApple) {
    return null;
  }

  return (
    <div className="space-y-3">
      {enableGoogle && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isAppleLoading}
          isLoading={isGoogleLoading}
        >
          {!isGoogleLoading && <IconBrandGoogle className="mr-2 size-5" />}
          {t("auth.social.continueWithGoogle")}
        </Button>
      )}
      {enableApple && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleAppleSignIn}
          disabled={isGoogleLoading}
          isLoading={isAppleLoading}
        >
          {!isAppleLoading && <IconBrandApple className="mr-2 size-5" />}
          {t("auth.social.continueWithApple")}
        </Button>
      )}
    </div>
  );
}
