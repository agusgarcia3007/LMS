const GITHUB_API = "https://api.github.com";
const REPO_OWNER = "agusgarcia3007";
const REPO_NAME = "Learnbase";

export type GitHubRelease = {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
};

export async function getGitHubReleases(): Promise<GitHubRelease[]> {
  const response = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/releases`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch releases: ${response.status}`);
  }

  return response.json();
}
