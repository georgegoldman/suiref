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

// Custom API Interface
interface CustomDeveloperResponse {
  username: string;
  has_move_files: boolean;
  total_repositories: number;
  total_commits: number;
  repositories: {
    repo_name: string;
    repo_url: string;
    commit_count: number;
    description?: string;
  }[];
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
    if (searchQuery) {
      console.log(`Searching Custom API for Developer: "${searchQuery}"...`);
      
      try {
        const response = await axios.get<CustomDeveloperResponse>(
          `https://sui-contributors.onrender.com/check-sui-developer`,
          {
            params: {
              username: searchQuery,
            },
          }
        );

        const data = response.data;
        console.log("✅ Custom API Response:", data);

        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];
        const categories: GraphCategory[] = [
          { name: "Developer" },
          { name: "Repository" },
        ];

        // Central Node: Developer
        const developerId = `dev-${data.username}`;
        nodes.push({
          id: developerId,
          name: data.username,
          symbolSize: Math.min(data.total_commits / 2 + 40, 100), // Scale size by commits
          category: 0, // Developer
          value: data.total_commits,
          draggable: true,
        });

        // Child Nodes: Repositories
        // Since the API returns all repos, we might want to paginate locally if needed, 
        // but for now we'll show them all (or the slice for the current page if we wanted, 
        // but the current request asked for the bubble map logic).
        // Let's implement simple client-side pagination for consistency with the UI controls
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedRepos = data.repositories.slice(startIndex, endIndex);

        paginatedRepos.forEach((repo) => {
          const repoId = `repo-${repo.repo_name}`;
          
          nodes.push({
            id: repoId,
            name: repo.repo_name.split("/")[1] || repo.repo_name, // Show only repo name part
            symbolSize: Math.min(Math.max(repo.commit_count * 2, 20), 60), // Scale by commits, min 20
            category: 1, // Repository
            value: repo.commit_count,
            draggable: true,
          });

          // Link Developer -> Repo
          links.push({
            source: developerId,
            target: repoId,
          });
        });

        const ecosystemData: EcosystemData = {
          nodes,
          links,
          categories,
          totalItems: data.repositories.length,
          totalPages: Math.ceil(data.repositories.length / perPage),
        };

        // Cache the result
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: ecosystemData,
            timestamp: Date.now(),
          })
        );

        return ecosystemData;

      } catch (err) {
        console.error("Custom API failed or user not found", err);
        // Fallback or empty result if not found
        return {
          nodes: [],
          links: [],
          categories: [{ name: "Developer" }, { name: "Repository" }],
          totalItems: 0,
          totalPages: 0,
        };
      }
    } 
    
    // DEFAULT BEHAVIOUR (No search query): Keep existing GitHub API logic for general browsing
    else {
      // 1. Prepare Parallel Requests
      console.log(`Fetching repositories page ${page} (Default View)...`);
      const baseRepoQuery = "language:move sui";
      
      const response = await axios.get(`${GITHUB_API_BASE}/search/repositories`, {
        params: {
          q: baseRepoQuery,
          sort: "stars",
          order: "desc",
          page: page,
          per_page: perPage,
        },
      });

      const repos = response.data.items as GitHubRepo[];
      const totalCount = response.data.total_count;

      console.log(`✅ Fetched Page ${page}: ${repos.length} Repos`);

      const nodes: GraphNode[] = [];
      const links: GraphLink[] = [];
      const categories: GraphCategory[] = [
        { name: "Owner" },
        { name: "Contributor" },
      ];

      const nodeIds = new Set<string>();

      // Process Repositories
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

        // Fetch contributors for each repo
        try {
          // console.log(`Fetching contributors for ${repo.name}...`);
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
          // console.warn(`Failed to fetch contributors for ${repo.name}`, err);
        }
      }

      const ecosystemData: EcosystemData = { 
        nodes, 
        links, 
        categories,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage)
      };

      // Cache the result
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: ecosystemData,
          timestamp: Date.now(),
        })
      );

      return ecosystemData;
    }

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
