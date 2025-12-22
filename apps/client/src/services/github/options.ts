import { queryOptions } from "@tanstack/react-query";
import { getGitHubReleases } from "./service";

export const GITHUB_QUERY_KEYS = {
  releases: ["github", "releases"] as const,
};

export const githubReleasesOptions = () =>
  queryOptions({
    queryKey: GITHUB_QUERY_KEYS.releases,
    queryFn: getGitHubReleases,
    staleTime: 1000 * 60 * 5,
  });
