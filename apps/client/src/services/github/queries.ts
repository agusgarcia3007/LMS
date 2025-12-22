import { useQuery } from "@tanstack/react-query";
import { githubReleasesOptions } from "./options";

export function useGitHubReleases() {
  return useQuery(githubReleasesOptions());
}
