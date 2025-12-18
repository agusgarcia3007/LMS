"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  CurrencyDollar,
  ChartLine,
  ShoppingCart,
  TrendUp,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useRevenueMetrics,
  useRevenueChart,
  useRevenueTransactions,
} from "@/services/finance";

type ChartPeriod = "7d" | "30d" | "90d" | "1y";

export default function RevenuePage() {
  const { t } = useTranslation();
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("30d");
  const { data: metricsData, isLoading: metricsLoading } = useRevenueMetrics();
  const { data: chartData, isLoading: chartLoading } = useRevenueChart(chartPeriod);
  const { data: transactionsData, isLoading: transactionsLoading } = useRevenueTransactions();

  const isLoading = metricsLoading || chartLoading || transactionsLoading;

  if (isLoading) {
    return <RevenueSkeleton />;
  }

  const metrics = metricsData?.metrics;
  const chartPoints = chartData?.data ?? [];
  const transactions = transactionsData?.transactions ?? [];

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const maxRevenue = Math.max(...chartPoints.map((p) => p.revenue), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("finance.revenue.title")}</h1>
        <p className="text-muted-foreground">{t("finance.revenue.description")}</p>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-md">
                <CurrencyDollar className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("finance.revenue.totalRevenue")}</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue, metrics.currency)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-md">
                <ChartLine className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("finance.revenue.monthlyRevenue")}</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.monthlyRevenue, metrics.currency)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-md">
                <TrendUp className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("finance.revenue.averageOrder")}</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.averageOrderValue, metrics.currency)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-md">
                <ShoppingCart className="size-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("finance.revenue.totalOrders")}</p>
                <p className="text-2xl font-bold">{metrics.totalOrders}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">{t("finance.revenue.chart")}</h2>
          <div className="flex gap-1">
            {(["7d", "30d", "90d", "1y"] as ChartPeriod[]).map((period) => (
              <Button
                key={period}
                size="sm"
                variant={chartPeriod === period ? "default" : "ghost"}
                onClick={() => setChartPeriod(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-64 flex items-end gap-1">
          {chartPoints.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              {t("finance.revenue.noData")}
            </div>
          ) : (
            chartPoints.map((point, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1"
                title={`${point.period}: ${formatCurrency(point.revenue)}`}
              >
                <div
                  className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                  style={{
                    height: `${(point.revenue / maxRevenue) * 100}%`,
                    minHeight: point.revenue > 0 ? "4px" : "0px",
                  }}
                />
                {chartPoints.length <= 12 && (
                  <span className="text-xs text-muted-foreground truncate max-w-full">
                    {point.period}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h2 className="font-medium">{t("finance.revenue.recentTransactions")}</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {t("finance.revenue.noTransactions")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t("finance.revenue.customer")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t("finance.revenue.course")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t("finance.revenue.amount")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t("finance.revenue.status")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t("finance.revenue.date")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{transaction.userName}</p>
                        <p className="text-sm text-muted-foreground">{transaction.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{transaction.courseTitle}</td>
                    <td className="px-4 py-3 font-medium">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </td>
                    <td className="px-4 py-3">
                      {transaction.status === "completed" && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          {t("finance.revenue.completed")}
                        </span>
                      )}
                      {transaction.status === "pending" && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                          {t("finance.revenue.pending")}
                        </span>
                      )}
                      {transaction.status === "refunded" && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full flex items-center gap-1 w-fit">
                          <ArrowsClockwise className="size-3" />
                          {t("finance.revenue.refunded")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {format(new Date(transaction.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function RevenueSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-80 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
