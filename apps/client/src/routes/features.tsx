import { useState, useDeferredValue, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Clock, ArrowLeft, Search } from "lucide-react";

import { Button, Input } from "@learnbase/ui";
import { Skeleton } from "@learnbase/ui";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@learnbase/ui";
import { LandingHeader } from "@/components/landing/header";
import {
  FeatureKanban,
  FeatureSubmitDialog,
  FeatureCreateDialog,
  FeatureDetailDialog,
  FeatureApprovalDialog,
  PendingFeaturesPanel,
} from "@/components/features";
import { createSeoMeta } from "@/lib/seo";
import { useGetProfile } from "@/services/profile/queries";
import {
  useFeaturesBoard,
  useFeaturesPending,
  useSubmitFeature,
  useCreateFeatureDirect,
  useVoteFeature,
  useUpdateFeatureStatus,
  useApproveFeature,
  useRejectFeature,
  FeaturesService,
  QUERY_KEYS,
  type Feature,
  type FeatureStatus,
  type ColumnStatus,
  type SubmitFeatureRequest,
  type CreateFeatureDirectRequest,
  type FeatureBoardResponse,
} from "@/services/features";

export const Route = createFileRoute("/features")({
  ssr: false,
  head: () =>
    createSeoMeta({
      title: "Roadmap | LearnBase",
      description:
        "See what we're building next. Vote on features and submit your ideas.",
      noindex: false,
    }),
  component: FeaturesPage,
});

function FeaturesSkeleton() {
  return (
    <div className="grid auto-cols-fr grid-flow-col gap-4">
      {[1, 2, 3].map((col) => (
        <div key={col} className="space-y-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <div className="space-y-2 rounded-md border bg-secondary p-2">
            {[1, 2, 3].map((card) => (
              <Skeleton key={card} className="h-28 w-full rounded-md" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturesPage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState("");
  const deferredSearch = useDeferredValue(searchInput);
  const search = deferredSearch.trim() || undefined;

  const queryClient = useQueryClient();
  const { data: profileData } = useGetProfile();
  const { data: boardData, isLoading: isBoardLoading } = useFeaturesBoard(search);
  const { data: pendingData, isLoading: isPendingLoading } =
    useFeaturesPending();

  const [loadingMore, setLoadingMore] = useState<Record<string, boolean>>({});

  const { mutate: submitFeature, isPending: isSubmitting } = useSubmitFeature();
  const { mutate: createDirect, isPending: isCreating } =
    useCreateFeatureDirect();
  const { mutate: voteFeature } = useVoteFeature();
  const { mutate: updateStatus } = useUpdateFeatureStatus();
  const { mutate: approveFeature, isPending: isApproving } =
    useApproveFeature();
  const { mutate: rejectFeature, isPending: isRejecting } = useRejectFeature();

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailFeature, setDetailFeature] = useState<Feature | null>(null);
  const [approvalFeature, setApprovalFeature] = useState<Feature | null>(null);

  const user = profileData?.user;
  const isSuperadmin = user?.role === "superadmin";
  const isAuthenticated = !!user;

  const features = boardData?.features ?? {
    ideas: [],
    inProgress: [],
    shipped: [],
  };
  const hasMore = boardData?.hasMore ?? {
    ideas: false,
    inProgress: false,
    shipped: false,
  };
  const totals = boardData?.totals ?? {
    ideas: 0,
    inProgress: 0,
    shipped: 0,
  };
  const pendingFeatures = pendingData?.features ?? [];

  const columnKeyToStatus: Record<"ideas" | "inProgress" | "shipped", ColumnStatus> = {
    ideas: "ideas",
    inProgress: "in_progress",
    shipped: "shipped",
  };

  const handleLoadMore = useCallback(
    async (columnKey: "ideas" | "inProgress" | "shipped") => {
      const status = columnKeyToStatus[columnKey];
      const currentFeatures = features[columnKey];
      const lastFeature = currentFeatures[currentFeatures.length - 1];
      if (!lastFeature) return;

      setLoadingMore((prev) => ({ ...prev, [columnKey]: true }));

      try {
        const result = await FeaturesService.getColumn(status, lastFeature.order, search);

        queryClient.setQueryData<FeatureBoardResponse>(
          [...QUERY_KEYS.FEATURES_BOARD, { search }],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              features: {
                ...old.features,
                [columnKey]: [...old.features[columnKey], ...result.features],
              },
              hasMore: {
                ...old.hasMore,
                [columnKey]: result.hasMore,
              },
            };
          }
        );
      } finally {
        setLoadingMore((prev) => ({ ...prev, [columnKey]: false }));
      }
    },
    [features, search, queryClient]
  );

  const handleSubmit = (data: SubmitFeatureRequest) => {
    submitFeature(data, {
      onSuccess: () => setSubmitDialogOpen(false),
    });
  };

  const handleCreateDirect = (data: CreateFeatureDirectRequest) => {
    createDirect(data, {
      onSuccess: () => setCreateDialogOpen(false),
    });
  };

  const handleVote = (id: string, value: 1 | -1) => {
    if (!isAuthenticated) return;
    voteFeature({ id, value });
  };

  const handleStatusChange = (id: string, status: FeatureStatus, order?: number) => {
    if (!isSuperadmin) return;
    if (status === "pending") return;
    updateStatus({ id, status, order });
  };

  const handleApprove = (id: string) => {
    approveFeature(id, {
      onSuccess: () => setApprovalFeature(null),
    });
  };

  const handleReject = (id: string, reason?: string) => {
    rejectFeature(
      { id, reason },
      {
        onSuccess: () => setApprovalFeature(null),
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon" className="size-8">
                  <ArrowLeft className="size-4" />
                </Button>
              </Link>
              <div>
                <h1 className="font-bold text-2xl">{t("features.title")}</h1>
                <p className="text-muted-foreground text-sm">
                  {t("features.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
            {isSuperadmin && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Clock className="mr-2 size-4" />
                    {t("features.pending.title")}
                    {pendingFeatures.length > 0 && (
                      <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-primary-foreground text-xs">
                        {pendingFeatures.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{t("features.pending.title")}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <PendingFeaturesPanel
                      features={pendingFeatures}
                      onApprove={setApprovalFeature}
                      onReject={setApprovalFeature}
                      isLoading={isPendingLoading}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {isSuperadmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="mr-2 size-4" />
                {t("features.create.button")}
              </Button>
            )}

            {isAuthenticated && !isSuperadmin && (
              <Button size="sm" onClick={() => setSubmitDialogOpen(true)}>
                <Plus className="mr-2 size-4" />
                {t("features.submit.button")}
              </Button>
            )}

            {!isAuthenticated && (
              <Link to="/__auth/login">
                <Button size="sm">
                  <Plus className="mr-2 size-4" />
                  {t("features.submit.button")}
                </Button>
              </Link>
            )}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("features.search.placeholder")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isBoardLoading ? (
          <FeaturesSkeleton />
        ) : (
          <FeatureKanban
            features={features}
            hasMore={hasMore}
            totals={totals}
            onVote={handleVote}
            onCardClick={setDetailFeature}
            onStatusChange={handleStatusChange}
            onLoadMore={{
              ideas: () => handleLoadMore("ideas"),
              inProgress: () => handleLoadMore("inProgress"),
              shipped: () => handleLoadMore("shipped"),
            }}
            isLoadingMore={{
              ideas: loadingMore.ideas ?? false,
              inProgress: loadingMore.inProgress ?? false,
              shipped: loadingMore.shipped ?? false,
            }}
            canDrag={isSuperadmin}
            canVote={isAuthenticated}
          />
        )}
      </main>

      <FeatureSubmitDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        onSubmit={handleSubmit}
        isPending={isSubmitting}
      />

      <FeatureCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateDirect}
        isPending={isCreating}
      />

      <FeatureDetailDialog
        feature={detailFeature}
        open={!!detailFeature}
        onOpenChange={(open) => !open && setDetailFeature(null)}
        onVote={handleVote}
        canVote={isAuthenticated}
      />

      <FeatureApprovalDialog
        feature={approvalFeature}
        open={!!approvalFeature}
        onOpenChange={(open) => !open && setApprovalFeature(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        isApproving={isApproving}
        isRejecting={isRejecting}
      />
    </div>
  );
}
