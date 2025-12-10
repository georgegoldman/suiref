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
  totalItems: number;
  totalPages: number;
}

interface GitHubRepo {
  name: string;
  owner: {
    id: number;
    login: string;
  };
  stargazers_count: number;
  contributors_url: string;
}

export const fetchSuiEcosystemData = async (
  page: number = 1,
  perPage: number = 20,
  searchQuery: string = ""
): Promise<EcosystemData> => {
  const cacheKey = `${CACHE_KEY}_page_${page}_limit_${perPage}_q_${searchQuery}`;

  // Check cache first
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log("Using cached ecosystem data");
      return data;
    }
  }

  try {
    // 1. Prepare Parallel Requests
    const baseRepoQuery = "language:move sui";
    const repoQuery = searchQuery 
      ? `${baseRepoQuery} ${searchQuery}`
      : baseRepoQuery;
    
    // User query: Search for users matching the term. 
    // We try to prioritize those related to 'sui' or 'move' if possible, but strict filtering might exclude people.
    // Let's search broadly for the name but sort by followers to get prominent users.
    const userQuery = searchQuery;

    console.log(`Searching Repos: "${repoQuery}" | Searching Users: "${userQuery}"`);

    const requests = [
      axios.get(`${GITHUB_API_BASE}/search/repositories`, {
        params: {
          q: repoQuery,
          sort: "stars",
          order: "desc",
          page: page,
          per_page: Math.ceil(perPage / 2),
        },
      }),
    ];

    if (searchQuery) {
      requests.push(
        axios.get(`${GITHUB_API_BASE}/search/users`, {
          params: {
            q: userQuery,
            sort: "followers",
            order: "desc",
            page: page,
            per_page: Math.ceil(perPage / 2),
          },
        })
      );
    }

    const responses = await Promise.all(requests);
    const repoResponse = responses[0];
    const userResponse = searchQuery ? responses[1] : null;

    const repos = repoResponse.data.items as GitHubRepo[];
    const users = userResponse ? (userResponse.data.items as any[]) : [];
    
    const totalRepoCount = repoResponse.data.total_count;
    const totalUserCount = userResponse ? userResponse.data.total_count : 0;
    const totalCount = totalRepoCount + totalUserCount;

    console.log(`✅ Fetched Page ${page}: ${repos.length} Repos, ${users.length} Users`);

    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const categories: GraphCategory[] = [
      { name: "Owner" },
      { name: "Contributor" },
    ];

    const nodeIds = new Set<string>();

    // 2. Process Users (SearchResults)
    for (const user of users) {
      const userId = `user-${user.id}`;
      if (!nodeIds.has(userId)) {
        nodes.push({
          id: userId,
          name: user.login,
          symbolSize: 30,
          category: 1, // Treat as Contributor/User
          value: 0,
          draggable: true,
        });
        nodeIds.add(userId);
      }
    }

    // 3. Process Repositories
    for (const repo of repos) {
      // Create node for Repo Owner
      const ownerId = `user-${repo.owner.id}`;
      if (!nodeIds.has(ownerId)) {
        nodes.push({
          id: ownerId,
          name: repo.owner.login,
          symbolSize: Math.min(repo.stargazers_count / 2 + 20, 60), 
          category: 0, // Owner
          value: repo.stargazers_count,
          draggable: true,
        });
        nodeIds.add(ownerId);
      }

      // 4. Fetch contributors for each repo
      try {
        console.log(`Fetching contributors for ${repo.name}...`);
        interface GitHubContributor {
          id: number;
          login: string;
          contributions: number;
        }

        const contribResponse = await axios.get(repo.contributors_url, {
          params: {
            per_page: 5,
          },
        });
        
        const contributors = contribResponse.data as GitHubContributor[];

        for (const contributor of contributors) {
          const contributorId = `user-${contributor.id}`;

          if (!nodeIds.has(contributorId)) {
            nodes.push({
              id: contributorId,
              name: contributor.login,
              symbolSize: 20 + contributor.contributions / 10,
              category: 1, // Contributor
              value: contributor.contributions,
              draggable: true,
            });
            nodeIds.add(contributorId);
          }

          if (contributorId !== ownerId) {
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
      }
    }

    const ecosystemData: EcosystemData = { 
      nodes, 
      links, 
      categories,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / perPage)
    };

    console.log("🎯 Page Data Summary:", {
      page,
      totalNodes: nodes.length,
      totalLinks: links.length,
    });

    // Cache the result
    localStorage.setItem(
      cacheKey,
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
