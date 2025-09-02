import { useState } from "react";
import WorkshopComponent from "./workshop-component";
import ModulesComponent from "./modules-component";
import ModuleContent from "./ModuleContent";

interface WorkshopProps {
  onPageChange?: (page: string) => void;
}

type TabType = "workshop" | "modules";

const Workshop = ({ onPageChange }: WorkshopProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("workshop");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(
    new Set()
  );

  const handleModuleSelect = (moduleTitle: string) => {
    setSelectedModule(moduleTitle);
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
  };

  const handleModuleComplete = (moduleTitle: string) => {
    setCompletedModules((prev) => new Set([...prev, moduleTitle]));
  };

  return (
    <div className="flex-1 p-4 sm:p-6">
      {selectedModule ? (
        <ModuleContent
          moduleTitle={selectedModule}
          onBack={handleBackToModules}
          onComplete={() => handleModuleComplete(selectedModule)}
          isCompleted={completedModules.has(selectedModule)}
          completedModulesCount={completedModules.size}
          onNavigateModule={handleModuleSelect}
          onPageChange={onPageChange}
        />
      ) : (
        <div className="max-w-6xl mx-auto flex flex-col gap-[3.125rem]">
          <div className="bg-white/10 rounded-[1.25rem] p-[0.3125rem] w-full max-w-[clamp(18rem,85vw,31.875rem)]">
            <div className="flex">
              <button
                onClick={() => setActiveTab("workshop")}
                className={`px-4 sm:px-6 py-3 rounded-[0.9375rem] font-medium text-sm transition-all duration-200 flex-1 ${
                  activeTab === "workshop"
                    ? "bg-[#4DA2FD] rounded text-white"
                    : "bg-transparent text-white/80"
                }`}
              >
                Workshop
              </button>
              <button
                onClick={() => setActiveTab("modules")}
                className={`px-4 sm:px-6 py-3 rounded-[0.9375rem] font-medium text-sm transition-all duration-200 flex-1 ${
                  activeTab === "modules"
                    ? "bg-[#4DA2FD] rounded text-white"
                    : "bg-transparent text-white/80"
                }`}
              >
                Modules
              </button>
            </div>
          </div>

          {activeTab === "workshop" && (
            <WorkshopComponent
              setActiveTab={(tab: string) => setActiveTab(tab as TabType)}
            />
          )}
          {activeTab === "modules" && (
            <ModulesComponent
              onModuleSelect={handleModuleSelect}
              completedModules={completedModules}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Workshop;
