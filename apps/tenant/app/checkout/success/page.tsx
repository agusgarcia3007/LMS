import { Suspense } from "react";
import { SpinnerGap } from "@phosphor-icons/react/dist/ssr";
import { CheckoutSuccessContent } from "./checkout-success-content";

export const metadata = {
  title: "Pago exitoso",
  description: "Tu pago ha sido procesado exitosamente",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <SpinnerGap className="size-12 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Verificando pago...</p>
      </div>
    </div>
  );
}
