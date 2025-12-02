import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { fetchSuiEcosystemData, type EcosystemData } from '../services/githubService';

const Ecosystem = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [graphData, setGraphData] = useState<EcosystemData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSuiEcosystemData();
        setGraphData(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch ecosystem data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const option = graphData ? {
    backgroundColor: 'transparent',
    title: {
      text: 'Sui Move Ecosystem',
      subtext: 'GitHub Contributions',
      top: 'top',
      left: 'left',
      textStyle: {
        color: '#fff'
      },
      subtextStyle: {
        color: '#aaa'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    legend: {
      data: graphData.categories.map((a) => a.name),
      textStyle: {
        color: '#ccc'
      }
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        name: 'Sui Ecosystem',
        type: 'graph',
        layout: 'circular',
        circular: {
          rotateLabel: true
        },
        data: graphData.nodes.map((node) => ({
          ...node,
          label: {
            show: node.symbolSize > 10
          }
        })),
        links: graphData.links,
        categories: graphData.categories.map((cat, index) => ({
          ...cat,
          itemStyle: {
            color: index === 0 ? '#4da2ff' : '#ff79c6'
          }
        })),
        roam: true,
        label: {
          position: 'right',
          formatter: '{b}',
          color: '#eee'
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3,
          opacity: 0.5
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 4
          }
        }
      }
    ]
  } : {};

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80 pointer-events-none"></div>

      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-400 animate-pulse">Fetching data from GitHub...</p>
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
          style={{ height: '100%', width: '100%' }}
          theme="dark"
        />
      )}
    </div>
  );
};

export default Ecosystem;