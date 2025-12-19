import { useQuery, useSuspenseQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  featuresBoardOptions,
  featuresPendingOptions,
  featureOptions,
  featuresColumnOptions,
} from "./options";
import type { ColumnStatus } from "./service";

export const useFeaturesBoard = (search?: string) =>
  useQuery(featuresBoardOptions(search));

export const useFeaturesBoardSuspense = (search?: string) =>
  useSuspenseQuery(featuresBoardOptions(search));

export const useFeaturesColumn = (status: ColumnStatus, search?: string) =>
  useInfiniteQuery(featuresColumnOptions(status, search));

export const useFeaturesPending = () => useQuery(featuresPendingOptions());

export const useFeaturesPendingSuspense = () =>
  useSuspenseQuery(featuresPendingOptions());

export const useFeature = (id: string) => useQuery(featureOptions(id));

export const useFeatureSuspense = (id: string) =>
  useSuspenseQuery(featureOptions(id));
