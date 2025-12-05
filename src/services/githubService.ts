import axios from "axios";

const GITHUB_API_BASE = "https://api.github.com";
const CACHE_KEY = "sui_ecosystem_data_v4";
const CACHE_DURATION = 1000 * 60 * 60;

export interface GraphNode {
  id: string;
  name: string;
  symbolSize: number;
  category: number;
  value: number;
  draggable?: boolean;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphCategory {
  name: string;
}

export interface EcosystemData {
  nodes: GraphNode[];
  links: GraphLink[];
  categories: GraphCategory[];
}

// Helper function to parse Link header and get next page URL
const getNextPageUrl = (linkHeader: string | null): string | null => {
  if (!linkHeader) return null;
  const links = linkHeader.split(",");
  for (const link of links) {
    const [url, rel] = link.split(";");
    if (rel && rel.includes('rel="next"')) {
      return url.trim().slice(1, -1); // Remove < and >
    }
  }
  return null;
};

// Helper function to fetch pages of a GitHub API endpoint
const fetchAllPages = async <T>(
  initialUrl: string,
  params: Record<string, unknown> = {},
  extractItems: (response: {
    data: unknown;
    headers: Record<string, unknown>;
  }) => T[] = (response) => {
    const data = response.data as { items?: T[] } & T[];
    console.log(data);
    return data.items || data;
  },
  maxPages: number = 2 // Limit to first 3 pages by default
): Promise<T[]> => {
  const allItems: T[] = [];
  let currentPage = 1;
  let hasMorePages = true;
  const perPage = typeof params.per_page === "number" ? params.per_page : 100;

  while (hasMorePages && currentPage <= maxPages) {
    try {
      const response = await axios.get(initialUrl, {
        params: {
          ...params,
          page: currentPage,
          per_page: perPage,
        },
      });

      console.log(`[Page ${currentPage}] Raw GitHub API Response:`, {
        url: initialUrl,
        status: response.status,
        headers: response.headers,
        dataLength: Array.isArray(response.data)
          ? response.data.length
          : response.data?.items?.length || 0,
        data: response.data,
      });

      const items = extractItems(response);
      console.log(`[Page ${currentPage}] Extracted items:`, items);
      console.log(`[Page ${currentPage}] Items count: ${items.length}`);

      allItems.push(...items);
      console.log(
        `[Page ${currentPage}] Total accumulated items: ${allItems.length}`
      );

      // Check if there are more pages
      const linkHeader = response.headers.link as string | null;
      const nextPageUrl = getNextPageUrl(linkHeader);

      // Also check if we got fewer items than per_page (last page) or reached max pages
      if (!nextPageUrl || items.length < perPage || currentPage >= maxPages) {
        hasMorePages = false;
      } else {
        currentPage++;
      }
    } catch (error) {
      console.warn(`Error fetching page ${currentPage}:`, error);
      hasMorePages = false; // Stop on error
    }
  }

  return allItems;
};

export const fetchSuiEcosystemData = async (): Promise<EcosystemData> => {
  // Check cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log("Using cached ecosystem data");
      return data;
    }
  }

  try {
    // 1. Fetch all pages of Sui Move repositories
    console.log("Fetching all repository pages...");
    interface GitHubRepo {
      name: string;
      owner: {
        id: number;
        login: string;
      };
      stargazers_count: number;
      contributors_url: string;
    }

    const repos = await fetchAllPages<GitHubRepo>(
      `${GITHUB_API_BASE}/search/repositories`,
      {
        q: "language:move sui sort:stars",
        per_page: 100,
      },
      (response) => {
        const data = response.data as { items: GitHubRepo[] };
        return data.items;
      },
      3 // Limit to first 3 pages
    );

    console.log(`✅ Fetched ${repos.length} repositories across all pages`);
    console.log("📦 All repositories data:", repos);
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const categories: GraphCategory[] = [
      { name: "Owner" },
      { name: "Contributor" },
    ];

    // Helper to track existing nodes
    const nodeIds = new Set<string>();

    // 2. Process repositories
    for (const repo of repos) {
      // Create node for Repo Owner
      const ownerId = `user-${repo.owner.id}`;
      if (!nodeIds.has(ownerId)) {
        nodes.push({
          id: ownerId,
          name: repo.owner.login,
          symbolSize: Math.min(repo.stargazers_count / 2 + 20, 60), // Size based on stars of their repo
          category: 0, // Owner
          value: repo.stargazers_count,
          draggable: true,
        });
        nodeIds.add(ownerId);
      }

      // 3. Fetch all pages of contributors for each repo
      try {
        console.log(`Fetching contributors for ${repo.name}...`);
        interface GitHubContributor {
          id: number;
          login: string;
          contributions: number;
        }

        const contributors = await fetchAllPages<GitHubContributor>(
          repo.contributors_url,
          {
            per_page: 100, // Fetch more contributors per page
          },
          (response) => {
            return response.data as GitHubContributor[];
          },
          3 // Limit to first 3 pages
        );

        console.log(
          `✅ Found ${contributors.length} contributors for ${repo.name}`
        );
        console.log(`👥 Contributors data for ${repo.name}:`, contributors);

        for (const contributor of contributors) {
          const contributorId = `user-${contributor.id}`;

          if (!nodeIds.has(contributorId)) {
            nodes.push({
              id: contributorId,
              name: contributor.login,
              symbolSize: 20 + contributor.contributions / 10, // Size based on contributions
              category: 1, // Contributor
              value: contributor.contributions,
              draggable: true,
            });
            nodeIds.add(contributorId);
          }

          // Link contributor to Repo Owner (if they are different)
          if (contributorId !== ownerId) {
            // Check if link already exists to avoid duplicates (undirected graph usually fine with one link)
            const linkExists = links.some(
              (l) =>
                (l.source === contributorId && l.target === ownerId) ||
                (l.source === ownerId && l.target === contributorId)
            );

            if (!linkExists) {
              links.push({
                source: contributorId,
                target: ownerId,
              });
            }
          }
        }
      } catch (err) {
        console.warn(`Failed to fetch contributors for ${repo.name}`, err);
        // Continue even if contributors fail
      }
    }

    const ecosystemData = { nodes, links, categories };

    console.log("🎯 Final Ecosystem Data Summary:", {
      totalNodes: nodes.length,
      totalLinks: links.length,
      totalCategories: categories.length,
      nodes: nodes,
      links: links,
      categories: categories,
    });

    // Cache the result
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data: ecosystemData,
        timestamp: Date.now(),
      })
    );

    return ecosystemData;
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw error;
  }
};
