import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';
const CACHE_KEY = 'sui_ecosystem_data_v4';
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

export const fetchSuiEcosystemData = async (): Promise<EcosystemData> => {
  // Check cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log('Using cached ecosystem data');
      return data;
    }
  }

  try {
    // 1. Search for top Sui Move repositories
    const searchResponse = await axios.get(`${GITHUB_API_BASE}/search/repositories`, {
      params: {
        q: 'language:move sui sort:stars',
        per_page: 30, // Increased limit to 30
      },
    });

    const repos = searchResponse.data.items;
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const categories: GraphCategory[] = [
      { name: 'Owner' },
      { name: 'Contributor' },
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

      // 3. Fetch contributors for each repo
      try {
        const contributorsResponse = await axios.get(repo.contributors_url, {
          params: { per_page: 5 }, // Increased limit to 5
        });

        for (const contributor of contributorsResponse.data) {
          const contributorId = `user-${contributor.id}`;
          
          if (!nodeIds.has(contributorId)) {
            nodes.push({
              id: contributorId,
              name: contributor.login,
              symbolSize: 20 + (contributor.contributions / 10), // Size based on contributions
              category: 1, // Contributor
              value: contributor.contributions,
              draggable: true,
            });
            nodeIds.add(contributorId);
          }

          // Link contributor to Repo Owner (if they are different)
          if (contributorId !== ownerId) {
             // Check if link already exists to avoid duplicates (undirected graph usually fine with one link)
             const linkExists = links.some(l => 
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

    // Cache the result
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: ecosystemData,
      timestamp: Date.now(),
    }));

    return ecosystemData;
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    throw error;
  }
};
