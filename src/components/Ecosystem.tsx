import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  fetchSuiEcosystemData,
  type EcosystemData,
} from "../services/githubService";
// import suirefLogo from "../assets/suiref-logo.png";

const Ecosystem = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [graphData, setGraphData] = useState<EcosystemData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // The actual active search filter
  const [inputValue, setInputValue] = useState(""); // The input field value
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(20);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Pass searchQuery to service
        const data = await fetchSuiEcosystemData(currentPage, perPage, searchQuery);
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
  }, [currentPage, perPage, searchQuery]); // Re-fetch when search query changes

  // Handle search submission
  const handleSearch = () => {
    if (inputValue.trim() !== searchQuery) {
      setSearchQuery(inputValue.trim());
      setCurrentPage(1); // Reset to page 1 for new search
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const option = graphData
    ? {
        backgroundColor: "transparent",
        // title prop restored and moved down
        // title: {
        //   text: "Sui Move Ecosystem",
        //   subtext: searchQuery 
        //     ? `Search: "${searchQuery}" - Page ${currentPage}` 
        //     : `Page ${currentPage} (Showing ${graphData?.nodes.length} nodes)`,
        //   top: 120, // Moved down to clear navbar
        //   left: "left",
        //   textStyle: {
        //     color: "#000",
        //   },
        //   subtextStyle: {
        //     color: "#666",
        //   },
        // },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}",
        },
        legend: {
          data: graphData.categories.map((a) => a.name),
          bottom: 30, // Moved to bottom right to avoid pagination
          right: 30,
          textStyle: {
            color: "#000", // Changed to black for visibility
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
            data: graphData.nodes,
            links: graphData.links,
            categories: graphData.categories.map((cat, index) => ({
              ...cat,
              itemStyle: {
                color: index === 0 ? "#4da2ff" : "#ff79c6",
              },
            })),
            roam: true,
            label: {
              position: "right",
              formatter: "{b}",
              color: "#333",
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
    <div className="w-full h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-white text-black">
      {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80 pointer-events-none"></div> */}\
      
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 w-full z-30 px-8 py-6 flex justify-between items-center bg-white/50 backdrop-blur-sm border-b border-black/5">
         <div className="text-xl font-bold tracking-tighter">SUIREF ECOSYSTEM</div>

         <div className="absolute  left-1/2 transform -translate-x-1/2 z-20 w-full max-w-md px-4 flex flex-col items-center gap-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search repositories (Press Enter)..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 pl-12 bg-white border border-black/10 rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-sm"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/50"
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
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {inputValue && inputValue === searchQuery ? (
                 <svg
                 className="w-5 h-5 text-[#4da2ff]"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24"
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   strokeWidth={2}
                   d="M5 13l4 4L19 7"
                 />
               </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-black/50 hover:text-black"
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
              )}
            </button>
            
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue("");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-black/50 hover:text-black transition-colors"
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
          {!isLoading && searchQuery && graphData && (
            <div className="text-center">
              <p className="text-white/70 text-sm">
                {graphData.totalItems > 0 ? (
                  <>
                    Found{" "}
                    <span className="text-[#4da2ff] font-semibold">
                      {graphData.totalItems}
                    </span>{" "}
                    results for "{searchQuery}"
                  </>
                ) : (
                  <span className="text-red-400">No results found for "{searchQuery}"</span>
                )}
              </p>
            </div>
          )}
        </div>

         <div className="flex gap-6 text-sm font-medium">
             <a href="/" className="hover:opacity-60">Home</a>
             <a href="/dashboard" className="hover:opacity-60">Community</a>
         </div>
      </div>


      {/* SuiRef Logo - Top Right (Removed or Updated) */}
      {/* <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
        <img src={suirefLogo} alt="SuiRef Logo" className="h-8 w-auto invert" />
        <span className="text-black/80 text-sm font-medium">
          Powered by SuiRef
        </span>
      </div> */}

      {/* Search Bar - Top Center */}
      {/* Search Bar - Top Center - Moved down to avoid navbar overlap */}
      

      {/* Pagination Controls - Bottom Center */}
      {!isLoading && !error && graphData && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4 bg-black/5 backdrop-blur-md rounded-full px-6 py-3 border border-black/10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-full transition-colors ${
              currentPage === 1
                ? "text-black/20 cursor-not-allowed"
                : "text-black/80 hover:bg-black/10 hover:text-black"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-black font-medium">Page {currentPage}</span>
            <span className="text-black/50 text-xs">of {graphData.totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(graphData.totalPages, p + 1))}
            disabled={currentPage === graphData.totalPages}
            className={`p-2 rounded-full transition-colors ${
              currentPage === graphData.totalPages
                ? "text-black/20 cursor-not-allowed"
                : "text-black/80 hover:bg-black/5 hover:text-black"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-400 animate-pulse text-center">
            {searchQuery ? `Searching for "${searchQuery}"...` : `Fetching Page ${currentPage}...`}
            <br />
            <span className="text-sm text-slate-500 mt-2 block">
              Gathering repositories and contributors
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
      ) : graphData && (
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
