import { useEffect, useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import {
  fetchSuiEcosystemData,
  type EcosystemData,
  type GraphNode,
} from "../services/githubService";
import suirefLogo from "../assets/suiref-logo.png";

const Ecosystem = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [graphData, setGraphData] = useState<EcosystemData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSuiEcosystemData();
        console.log(data);
        setGraphData(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch ecosystem data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and highlight nodes based on search query
  const filteredData = useMemo(() => {
    if (!graphData) {
      return { data: null, matchingCount: 0 };
    }

    if (!searchQuery.trim()) {
      return { data: graphData, matchingCount: 0 };
    }

    const query = searchQuery.toLowerCase().trim();
    const matchingNodeIds = new Set<string>();
    const matchingNodes: GraphNode[] = [];
    const allNodes: (GraphNode & {
      itemStyle?: Record<string, unknown>;
      label?: Record<string, unknown>;
    })[] = [];

    // Find matching nodes
    graphData.nodes.forEach((node) => {
      const matches = node.name.toLowerCase().includes(query);
      allNodes.push({
        ...node,
        itemStyle: matches
          ? {
              borderColor: "#4da2ff",
              borderWidth: 3,
              shadowBlur: 20,
              shadowColor: "#4da2ff",
            }
          : {
              opacity: 0.3,
            },
        label: {
          show: matches || node.symbolSize > 10,
          color: matches ? "#4da2ff" : "#eee",
          fontSize: matches ? 14 : 12,
          fontWeight: matches ? "bold" : "normal",
        },
      });

      if (matches) {
        matchingNodeIds.add(node.id);
        matchingNodes.push(node);
      }
    });

    // Filter links to only show connections involving matching nodes
    const filteredLinks = graphData.links.filter(
      (link) =>
        matchingNodeIds.has(link.source) || matchingNodeIds.has(link.target)
    );

    return {
      data: {
        nodes: allNodes,
        links: searchQuery.trim() ? filteredLinks : graphData.links,
        categories: graphData.categories,
      },
      matchingCount: matchingNodes.length,
    };
  }, [graphData, searchQuery]);

  const option = filteredData.data
    ? {
        backgroundColor: "transparent",
        title: {
          text: "Sui Move Ecosystem",
          subtext: "GitHub Contributions",
          top: "top",
          left: "left",
          textStyle: {
            color: "#fff",
          },
          subtextStyle: {
            color: "#aaa",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}",
        },
        legend: {
          data: filteredData.data.categories.map((a) => a.name),
          textStyle: {
            color: "#ccc",
          },
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            name: "Sui Ecosystem",
            type: "graph",
            layout: "circular",
            circular: {
              rotateLabel: true,
            },
            data: filteredData.data.nodes,
            links: filteredData.data.links,
            categories: filteredData.data.categories.map((cat, index) => ({
              ...cat,
              itemStyle: {
                color: index === 0 ? "#4da2ff" : "#ff79c6",
              },
            })),
            roam: true,
            label: {
              position: "right",
              formatter: "{b}",
              color: "#eee",
            },
            lineStyle: {
              color: "source",
              curveness: 0.3,
              opacity: 0.5,
            },
            emphasis: {
              focus: "adjacency",
              lineStyle: {
                width: 4,
              },
            },
          },
        ],
      }
    : {};

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80 pointer-events-none"></div>

      {/* SuiRef Logo - Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
        <img src={suirefLogo} alt="SuiRef Logo" className="h-8 w-auto" />
        <span className="text-white/80 text-sm font-medium">
          Powered by SuiRef
        </span>
      </div>

      {/* Search Bar - Top Center */}
      {!isLoading && !error && graphData && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-md px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a contributor or repository owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#4da2ff] focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 text-center">
              <p className="text-white/70 text-sm">
                {filteredData.matchingCount > 0 ? (
                  <>
                    Found{" "}
                    <span className="text-[#4da2ff] font-semibold">
                      {filteredData.matchingCount}
                    </span>{" "}
                    {filteredData.matchingCount === 1 ? "match" : "matches"}
                  </>
                ) : (
                  <span className="text-red-400">No matches found</span>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-400 animate-pulse text-center">
            Fetching all pages from GitHub...
            <br />
            <span className="text-sm text-slate-500 mt-2 block">
              This may take a moment as we gather all repositories and
              contributors
            </span>
          </p>
        </div>
      ) : error ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <div className="text-red-400 text-xl">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          theme="dark"
        />
      )}
    </div>
  );
};

export default Ecosystem;
