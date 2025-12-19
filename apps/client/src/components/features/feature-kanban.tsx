import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
  type DragEndEvent,
} from "@/components/kibo-ui/kanban";
import { FeatureCard } from "./feature-card";
import type { Feature, FeatureStatus } from "@/services/features";

type KanbanColumn = {
  id: string;
  name: string;
  key: "ideas" | "inProgress" | "shipped";
};

type KanbanFeature = Feature & {
  name: string;
  column: string;
};

interface FeatureKanbanProps {
  features: {
    ideas: Feature[];
    inProgress: Feature[];
    shipped: Feature[];
  };
  hasMore?: {
    ideas: boolean;
    inProgress: boolean;
    shipped: boolean;
  };
  totals?: {
    ideas: number;
    inProgress: number;
    shipped: number;
  };
  onVote: (id: string, value: 1 | -1) => void;
  onCardClick?: (feature: Feature) => void;
  onStatusChange?: (id: string, status: FeatureStatus, order?: number) => void;
  onLoadMore?: {
    ideas: () => void;
    inProgress: () => void;
    shipped: () => void;
  };
  isLoadingMore?: {
    ideas: boolean;
    inProgress: boolean;
    shipped: boolean;
  };
  canDrag?: boolean;
  canVote?: boolean;
}

function LoadMoreTrigger({
  onLoadMore,
  isLoading,
  hasMore,
}: {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  if (!hasMore && !isLoading) return null;

  return (
    <div ref={ref} className="flex justify-center py-2">
      {isLoading && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
    </div>
  );
}

export function FeatureKanban({
  features,
  hasMore,
  totals,
  onVote,
  onCardClick,
  onStatusChange,
  onLoadMore,
  isLoadingMore,
  canDrag = false,
  canVote = true,
}: FeatureKanbanProps) {
  const { t } = useTranslation();

  const columns: KanbanColumn[] = [
    { id: "ideas", name: t("features.columns.ideas"), key: "ideas" },
    { id: "in_progress", name: t("features.columns.inProgress"), key: "inProgress" },
    { id: "shipped", name: t("features.columns.shipped"), key: "shipped" },
  ];

  const data: KanbanFeature[] = [
    ...features.ideas.map((f) => ({ ...f, name: f.title, column: "ideas" })),
    ...features.inProgress.map((f) => ({
      ...f,
      name: f.title,
      column: "in_progress",
    })),
    ...features.shipped.map((f) => ({ ...f, name: f.title, column: "shipped" })),
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (!onStatusChange) return;

    const { active, over } = event;
    if (!over) return;

    const activeFeature = data.find((f) => f.id === active.id);
    if (!activeFeature) return;

    const overColumn = columns.find((c) => c.id === over.id);
    const overFeature = data.find((f) => f.id === over.id);
    const newStatus = (overColumn?.id ?? overFeature?.column) as FeatureStatus;

    if (!newStatus) return;

    const columnFeatures = data
      .filter((f) => f.column === newStatus && f.id !== activeFeature.id)
      .sort((a, b) => a.order - b.order);

    let newOrder: number;

    if (overColumn) {
      newOrder = columnFeatures.length > 0
        ? columnFeatures[columnFeatures.length - 1].order + 1
        : 0;
    } else if (overFeature) {
      const overIndex = columnFeatures.findIndex((f) => f.id === overFeature.id);
      if (overIndex === 0) {
        newOrder = Math.max(0, overFeature.order - 1);
      } else if (overIndex === -1) {
        newOrder = columnFeatures.length > 0
          ? columnFeatures[columnFeatures.length - 1].order + 1
          : 0;
      } else {
        newOrder = overFeature.order;
      }
    } else {
      newOrder = 0;
    }

    if (newStatus !== activeFeature.column || newOrder !== activeFeature.order) {
      onStatusChange(activeFeature.id, newStatus, newOrder);
    }
  };

  return (
    <KanbanProvider
      columns={columns}
      data={data}
      onDragEnd={handleDragEnd}
      sensors={canDrag ? sensors : []}
    >
      {(column) => {
        const columnKey = column.key;
        const total = totals?.[columnKey] ?? data.filter((f) => f.column === column.id).length;
        const columnHasMore = hasMore?.[columnKey] ?? false;
        const columnIsLoading = isLoadingMore?.[columnKey] ?? false;
        const columnLoadMore = onLoadMore?.[columnKey];

        return (
          <KanbanBoard key={column.id} id={column.id}>
            <KanbanHeader className="flex items-center justify-between">
              <span>{column.name}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs">
                {total}
              </span>
            </KanbanHeader>
            <KanbanCards<KanbanFeature> id={column.id}>
              {(feature) => (
                <KanbanCard
                  key={feature.id}
                  id={feature.id}
                  name={feature.name}
                  column={feature.column}
                >
                  <FeatureCard
                    feature={feature}
                    onVote={onVote}
                    onClick={() => onCardClick?.(feature)}
                    canVote={canVote}
                  />
                </KanbanCard>
              )}
            </KanbanCards>
            {columnLoadMore && (
              <LoadMoreTrigger
                onLoadMore={columnLoadMore}
                isLoading={columnIsLoading}
                hasMore={columnHasMore}
              />
            )}
          </KanbanBoard>
        );
      }}
    </KanbanProvider>
  );
}
