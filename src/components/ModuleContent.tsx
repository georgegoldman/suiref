import { useState } from "react";
import WhiteTick from "../assets/white-tick";
import VideoIcon from "../assets/video-icon";
import CongratulationsModal from "./CongratulationsModal";
import CaretLeft from "../assets/caret-left";
// import { AiOutlinePlay } from "react-icons/ai";

interface ModuleContentProps {
  moduleTitle: string;
  onBack: () => void;
  videoId?: string;
  onComplete?: () => void;
  isCompleted?: boolean;
  completedModulesCount?: number;
  onNavigateModule?: (moduleTitle: string) => void;
  onPageChange?: (page: string) => void;
}

const ModuleContent = ({
  moduleTitle,
  onBack,
  videoId,
  onComplete,
  isCompleted = false,
  completedModulesCount = 0,
  onNavigateModule,
  onPageChange,
}: ModuleContentProps) => {
  const [showCongratulations, setShowCongratulations] = useState(false);
  const moduleVideos: { [key: string]: string } = {
    "Intro to Sui Blockchain": "-VpZOtkMXcg",
    "Setting up your wallet": "dQw4w9WgXcQ", // Replace with actual video ID
    "Writing your first Sui move smart contract": "9bZkp7q19f0", // Replace with actual video ID
    "Deploying your Testnet": "kJQP7kiw5Fk", // Replace with actual video ID
    "Joining the SUI Developer community": "y6120QOlsfU", // Replace with actual video ID
  };

  // Use provided videoId or fall back to the mapped one
  const currentVideoId = videoId || moduleVideos[moduleTitle] || "-VpZOtkMXcg";

  // Module order for navigation
  const moduleOrder = [
    "Intro to Sui Blockchain",
    "Setting up your wallet",
    "Writing your first Sui move smart contract",
    "Deploying your Testnet",
    "Joining the SUI Developer community",
  ];

  // Navigation logic
  const currentIndex = moduleOrder.indexOf(moduleTitle);
  const isFirstModule = currentIndex === 0;
  const isLastModule = currentIndex === moduleOrder.length - 1;

  const handlePreviousModule = () => {
    if (!isFirstModule && onNavigateModule) {
      onNavigateModule(moduleOrder[currentIndex - 1]);
    }
  };

  const handleNextModule = () => {
    if (!isLastModule && onNavigateModule) {
      onNavigateModule(moduleOrder[currentIndex + 1]);
    }
  };

  const handleModuleComplete = () => {
    if (onComplete) {
      onComplete();
      setShowCongratulations(true);
    }
  };

  const handleCloseCongratulations = () => {
    setShowCongratulations(false);
  };

  const handleNavigateToRewards = () => {
    setShowCongratulations(false);
    if (onPageChange) {
      onPageChange("rewards");
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-[50px]">
        {/* Header with Back Button */}
        <div className="flex items-center gap-[8px]">
          <button
            className="bg-[#4DA2FD] w-[45px] flex items-center justify-center h-[45px] rounded-[10px]"
            onClick={onBack}
          >
            <CaretLeft />
          </button>
          <span className="text-white font-semibold font-rubik">Back</span>
        </div>

        <button
          className={`text-white text-sm font-medium p-[10px] rounded-[10px] border w-[183px] h-[40px] flex items-center gap-[10px] ${
            isCompleted
              ? "bg-[#4DA2FD] border-[#4DA2FD]"
              : "bg-[#4DA2FD1A] border-white/20"
          }`}
          onClick={handleModuleComplete}
          disabled={isCompleted}
        >
          <WhiteTick />
          {isCompleted ? "Completed" : "Mark as Complete"}
        </button>

        <div className="flex flex-col gap-[50px] w-[779px]">
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-[32px] font-bold">{moduleTitle}</h1>
            <p className="text-white/60 font-bold text-sm">Video</p>
          </div>
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <div className="relative w-[40px] h-[40px] flex items-center justify-center">
                  {/* Background circle */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="#E8E8E8"
                      strokeWidth="2"
                      fill="transparent"
                    />
                  </svg>

                  {/* Progress circle */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="#4DA2FD"
                      strokeWidth="2"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={
                        2 * Math.PI * 16 -
                        ((completedModulesCount * 20) / 100) *
                          (2 * Math.PI * 16)
                      }
                      strokeLinecap="round"
                      style={{
                        transition: "stroke-dashoffset 0.5s ease-in-out",
                      }}
                    />
                  </svg>

                  {/* Video icon in center */}
                  <div className="z-10">
                    <VideoIcon />
                  </div>
                </div>
                <p className="text-white/60 text-sm font-bold">
                  {moduleTitle}.mp4
                </p>
              </div>
              <button
                className={`text-white text-sm font-medium p-[10px] rounded-[10px] border w-[183px] h-[40px] flex items-center gap-[10px] ${
                  isCompleted
                    ? "bg-[#4DA2FD] border-[#4DA2FD]"
                    : "bg-[#4DA2FD1A] border-white/20"
                }`}
                onClick={handleModuleComplete}
                disabled={isCompleted}
              >
                <WhiteTick />
                {isCompleted ? "Completed" : "Mark as Complete"}
              </button>
            </div>
            <iframe
              className="w-full h-[306px] rounded-[10px]"
              src={`https://www.youtube.com/embed/${currentVideoId}?si=ybdnk0W7pWTinNxO`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex items-center justify-between">
            <button
              className={`p-[10px] rounded-[10px] text-white text-sm font-medium w-[141px] h-[40px] ${
                isFirstModule
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "bg-white/30 hover:bg-white/40"
              }`}
              onClick={handlePreviousModule}
              disabled={isFirstModule}
            >
              Back
            </button>
            <button
              className={`p-[10px] rounded-[10px] text-white text-sm font-medium w-[141px] h-[40px] ${
                isLastModule
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "bg-white/30 hover:bg-white/40"
              }`}
              onClick={handleNextModule}
              disabled={isLastModule}
            >
              Next Module
            </button>
          </div>
        </div>
      </div>

      {completedModulesCount === 1 && (
        <CongratulationsModal
          isOpen={showCongratulations}
          onClose={handleCloseCongratulations}
          isAllModulesCompleted={false}
        />
      )}

      {completedModulesCount === 5 && (
        <CongratulationsModal
          isOpen={showCongratulations}
          onClose={handleCloseCongratulations}
          isAllModulesCompleted={true}
          onNavigateToRewards={handleNavigateToRewards}
        />
      )}
    </div>
  );
};

export default ModuleContent;
