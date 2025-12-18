"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  SpinnerGap,
  Wallet,
  Clock,
  CurrencyDollar,
  Bank,
  Check,
  Warning,
  X,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  usePayouts,
  usePayoutSettings,
  usePayoutMetrics,
  useUpdatePayoutSettings,
  useRequestPayout,
  type PayoutStatus,
} from "@/services/finance";

const payoutSettingsSchema = z.object({
  method: z.enum(["bank_transfer", "paypal", "stripe"]).nullable(),
  bankName: z.string().nullable(),
  accountNumber: z.string().nullable(),
  routingNumber: z.string().nullable(),
  paypalEmail: z.string().email().nullable().or(z.literal("")),
  minimumPayout: z.number().min(1),
});

type PayoutSettingsFormData = z.infer<typeof payoutSettingsSchema>;

const STATUS_STYLES: Record<PayoutStatus, { bg: string; text: string; icon: typeof Check }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
  processing: { bg: "bg-blue-100", text: "text-blue-700", icon: SpinnerGap },
  completed: { bg: "bg-green-100", text: "text-green-700", icon: Check },
  failed: { bg: "bg-red-100", text: "text-red-700", icon: X },
};

export default function PayoutsPage() {
  const { t } = useTranslation();
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const { data: payoutsData, isLoading: payoutsLoading } = usePayouts();
  const { data: settingsData, isLoading: settingsLoading } = usePayoutSettings();
  const { data: metricsData, isLoading: metricsLoading } = usePayoutMetrics();
  const updateSettingsMutation = useUpdatePayoutSettings();
  const requestPayoutMutation = useRequestPayout();

  const form = useForm<PayoutSettingsFormData>({
    resolver: zodResolver(payoutSettingsSchema),
    defaultValues: {
      method: null,
      bankName: null,
      accountNumber: null,
      routingNumber: null,
      paypalEmail: null,
      minimumPayout: 100,
    },
  });

  useEffect(() => {
    if (settingsData?.settings) {
      form.reset({
        method: settingsData.settings.method,
        bankName: settingsData.settings.bankName,
        accountNumber: settingsData.settings.accountNumber,
        routingNumber: settingsData.settings.routingNumber,
        paypalEmail: settingsData.settings.paypalEmail,
        minimumPayout: settingsData.settings.minimumPayout,
      });
    }
  }, [settingsData, form]);

  const isLoading = payoutsLoading || settingsLoading || metricsLoading;

  if (isLoading) {
    return <PayoutsSkeleton />;
  }

  const payouts = payoutsData?.payouts ?? [];
  const settings = settingsData?.settings;
  const metrics = metricsData?.metrics;

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const handleSaveSettings = (values: PayoutSettingsFormData) => {
    updateSettingsMutation.mutate(
      {
        method: values.method,
        bankName: values.method === "bank_transfer" ? values.bankName : null,
        accountNumber: values.method === "bank_transfer" ? values.accountNumber : null,
        routingNumber: values.method === "bank_transfer" ? values.routingNumber : null,
        paypalEmail: values.method === "paypal" ? values.paypalEmail : null,
        minimumPayout: values.minimumPayout,
      },
      {
        onSuccess: () => setIsEditingSettings(false),
      }
    );
  };

  const handleRequestPayout = () => {
    requestPayoutMutation.mutate();
  };

  const selectedMethod = form.watch("method");
  const canRequestPayout = settings?.method && metrics && metrics.pendingAmount >= settings.minimumPayout;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("finance.payouts.title")}</h1>
        <p className="text-muted-foreground">{t("finance.payouts.description")}</p>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-md">
                <Clock className="size-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("finance.payouts.pendingAmount")}</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.pendingAmount, metrics.currency)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-md">
                <CurrencyDollar className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("finance.payouts.totalPaidOut")}</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalPaidOut, metrics.currency)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-md">
                <Wallet className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("finance.payouts.nextPayout")}</p>
                <p className="text-lg font-bold">
                  {metrics.nextPayoutDate
                    ? format(new Date(metrics.nextPayoutDate), "MMM d, yyyy")
                    : t("finance.payouts.notScheduled")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button onClick={handleRequestPayout} disabled={!canRequestPayout || requestPayoutMutation.isPending}>
          {requestPayoutMutation.isPending && <SpinnerGap className="mr-2 size-4 animate-spin" />}
          {t("finance.payouts.requestPayout")}
        </Button>
        {!canRequestPayout && settings?.method && metrics && (
          <p className="text-sm text-muted-foreground flex items-center">
            <Warning className="size-4 mr-1" />
            {t("finance.payouts.minimumNotMet", {
              amount: formatCurrency(settings.minimumPayout, metrics.currency),
            })}
          </p>
        )}
      </div>

      <div className="rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">{t("finance.payouts.settings")}</h2>
          {!isEditingSettings && (
            <Button variant="outline" size="sm" onClick={() => setIsEditingSettings(true)}>
              {t("common.edit")}
            </Button>
          )}
        </div>

        {isEditingSettings ? (
          <form onSubmit={form.handleSubmit(handleSaveSettings)} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("finance.payouts.payoutMethod")}</Label>
              <Controller
                name="method"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(value) => field.onChange(value || null)}
                  >
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">{t("finance.payouts.bankTransfer")}</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {selectedMethod === "bank_transfer" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">{t("finance.payouts.bankName")}</Label>
                  <Input
                    id="bankName"
                    {...form.register("bankName")}
                    value={form.watch("bankName") ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">{t("finance.payouts.accountNumber")}</Label>
                  <Input
                    id="accountNumber"
                    {...form.register("accountNumber")}
                    value={form.watch("accountNumber") ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">{t("finance.payouts.routingNumber")}</Label>
                  <Input
                    id="routingNumber"
                    {...form.register("routingNumber")}
                    value={form.watch("routingNumber") ?? ""}
                  />
                </div>
              </div>
            )}

            {selectedMethod === "paypal" && (
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="paypalEmail">{t("finance.payouts.paypalEmail")}</Label>
                <Input
                  id="paypalEmail"
                  type="email"
                  {...form.register("paypalEmail")}
                  value={form.watch("paypalEmail") ?? ""}
                />
              </div>
            )}

            {selectedMethod === "stripe" && (
              <p className="text-sm text-muted-foreground">
                {t("finance.payouts.stripeConnected")}
              </p>
            )}

            <div className="space-y-2 max-w-xs">
              <Label htmlFor="minimumPayout">{t("finance.payouts.minimumPayout")}</Label>
              <Input
                id="minimumPayout"
                type="number"
                min={1}
                {...form.register("minimumPayout", { valueAsNumber: true })}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={updateSettingsMutation.isPending}>
                {updateSettingsMutation.isPending && <SpinnerGap className="mr-2 size-4 animate-spin" />}
                {t("common.save")}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditingSettings(false)}>
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Bank className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{t("finance.payouts.payoutMethod")}</p>
                <p className="font-medium">
                  {settings?.method
                    ? settings.method === "bank_transfer"
                      ? t("finance.payouts.bankTransfer")
                      : settings.method === "paypal"
                      ? "PayPal"
                      : "Stripe"
                    : t("finance.payouts.notConfigured")}
                </p>
              </div>
            </div>
            {settings?.method === "bank_transfer" && settings.bankName && (
              <div className="pl-8">
                <p className="text-sm text-muted-foreground">{settings.bankName}</p>
                <p className="text-sm text-muted-foreground">****{settings.accountNumber?.slice(-4)}</p>
              </div>
            )}
            {settings?.method === "paypal" && settings.paypalEmail && (
              <div className="pl-8">
                <p className="text-sm text-muted-foreground">{settings.paypalEmail}</p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <CurrencyDollar className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{t("finance.payouts.minimumPayout")}</p>
                <p className="font-medium">{formatCurrency(settings?.minimumPayout ?? 100, settings?.currency ?? "USD")}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h2 className="font-medium">{t("finance.payouts.history")}</h2>
        </div>

        {payouts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {t("finance.payouts.noPayouts")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t("finance.payouts.amount")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t("finance.payouts.method")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t("finance.payouts.status")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t("finance.payouts.requestedDate")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t("finance.payouts.processedDate")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t("finance.payouts.reference")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => {
                  const style = STATUS_STYLES[payout.status];
                  const StatusIcon = style.icon;
                  return (
                    <tr key={payout.id} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3 font-medium">
                        {formatCurrency(payout.amount, payout.currency)}
                      </td>
                      <td className="px-4 py-3 text-sm capitalize">{payout.method.replace("_", " ")}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text} rounded-full inline-flex items-center gap-1`}>
                          <StatusIcon className={`size-3 ${payout.status === "processing" ? "animate-spin" : ""}`} />
                          {t(`finance.payouts.${payout.status}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {format(new Date(payout.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {payout.processedAt
                          ? format(new Date(payout.processedAt), "MMM d, yyyy")
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                        {payout.reference ?? "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function PayoutsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
