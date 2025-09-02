interface ModulesComponentProps {
  onModuleSelect: (moduleTitle: string) => void;
  completedModules: Set<string>;
}

const ModulesComponent = ({
  onModuleSelect,
  completedModules,
}: ModulesComponentProps) => {
  return (
    <div className="flex flex-col gap-[2.5rem] sm:gap-[3.125rem]">
      <div className="flex flex-col gap-[0.625rem]">
        <h4 className="text-2xl font-bold">Modules</h4>
        <p className="text-xs text-white/60 font-medium">
          Choose workshop to start your SuiHub journey. Attending earns you
          referral points and gets you closer to your own rewards.
        </p>
      </div>
      <div className="flex flex-col gap-[1.5rem] sm:gap-[2rem]">
        <div className="flex flex-col gap-[0.625rem]">
          <h3 className="font-bold text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem]">Your Learning Modules</h3>
          <p className="text-sm font-bold text-white/60">
            Complete all 5 modules to earn your NFTs reward and unlock bootcamps
            access
          </p>
        </div>
        <div className="bg-[#4DA2FD17] rounded-[0.625rem] flex flex-col gap-[0.375rem] p-[1.25rem] w-full max-w-[clamp(12rem,50vw,15.125rem)]">
          <p className="text-white/60 text-sm font-bold">Progress:</p>
          <p className="text-[1.25rem] font-bold">
            {completedModules.size} of 5 completed
          </p>
        </div>

        <div className="flex flex-col gap-[0.625rem]">
          <h4 className="font-medium">Modules</h4>
          <div className="flex items-center justify-between border border-white/20 p-[0.625rem] rounded-[0.625rem]">
            <div className="flex items-center gap-[0.625rem]">
              <div className="border border-[#4DA2FD4A] bg-[#4DA2FD17] text-[#4DA2FD] text-xs font-medium p-[0.625rem] rounded-full w-[2.1875rem] h-[2.1875rem] flex items-center justify-center">
                1
              </div>
              <p className="text-white/70 text-sm font-medium">
                Intro to Sui Blockchain
              </p>
            </div>
            <button
              className="border border-[#4DA2FD] rounded-[0.5rem] bg-[#4DA2FD42] p-2 text-xs font-medium"
              onClick={() => {
                onModuleSelect("Intro to Sui Blockchain");
              }}
            >
              {completedModules.has("Intro to Sui Blockchain")
                ? "Completed"
                : "Start Module"}
            </button>
          </div>

          <div className="flex items-center justify-between border border-white/20 p-[0.625rem] rounded-[0.625rem]">
            <div className="flex items-center gap-[0.625rem]">
              <div className="border border-[#4DA2FD4A] bg-[#4DA2FD17] text-[#4DA2FD] text-xs font-medium p-[0.625rem] rounded-full w-[2.1875rem] h-[2.1875rem] flex items-center justify-center">
                2
              </div>
              <p className="text-white/70 text-sm font-medium">
                Setting up your wallet
              </p>
            </div>
            <button
              className="border border-[#4DA2FD] rounded-[0.5rem] bg-[#4DA2FD42] p-2 text-xs font-medium"
              onClick={() => onModuleSelect("Setting up your wallet")}
            >
              {completedModules.has("Setting up your wallet")
                ? "Completed"
                : "Start Module"}
            </button>
          </div>

          <div className="flex items-center justify-between border border-white/20 p-[0.625rem] rounded-[0.625rem]">
            <div className="flex items-center gap-[0.625rem]">
              <div className="border border-[#4DA2FD4A] bg-[#4DA2FD17] text-[#4DA2FD] text-xs font-medium p-[0.625rem] rounded-full w-[2.1875rem] h-[2.1875rem] flex items-center justify-center">
                3
              </div>
              <p className="text-white/70 text-sm font-medium">
                Writing your first Sui move smart contract
              </p>
            </div>
            <button
              className="border border-[#4DA2FD] rounded-[0.5rem] bg-[#4DA2FD42] p-2 text-xs font-medium"
              onClick={() =>
                onModuleSelect("Writing your first Sui move smart contract")
              }
            >
              {completedModules.has(
                "Writing your first Sui move smart contract"
              )
                ? "Completed"
                : "Start Module"}
            </button>
          </div>

          <div className="flex items-center justify-between border border-white/20 p-[0.625rem] rounded-[0.625rem]">
            <div className="flex items-center gap-[0.625rem]">
              <div className="border border-[#4DA2FD4A] bg-[#4DA2FD17] text-[#4DA2FD] text-xs font-medium p-[0.625rem] rounded-full w-[2.1875rem] h-[2.1875rem] flex items-center justify-center">
                4
              </div>
              <p className="text-white/70 text-sm font-medium">
                Deploying your Testnet
              </p>
            </div>
            <button
              className="border border-[#4DA2FD] rounded-[0.5rem] bg-[#4DA2FD42] p-2 text-xs font-medium"
              onClick={() => onModuleSelect("Deploying your Testnet")}
            >
              {completedModules.has("Deploying your Testnet")
                ? "Completed"
                : "Start Module"}
            </button>
          </div>

          <div className="flex items-center justify-between border border-white/20 p-[0.625rem] rounded-[0.625rem]">
            <div className="flex items-center gap-[0.625rem]">
              <div className="border border-[#4DA2FD4A] bg-[#4DA2FD17] text-[#4DA2FD] text-xs font-medium p-[0.625rem] rounded-full w-[2.1875rem] h-[2.1875rem] flex items-center justify-center">
                5
              </div>
              <p className="text-white/70 text-sm font-medium">
                Joining the SUI Developer community
              </p>
            </div>
            <button
              className="border border-[#4DA2FD] rounded-[0.5rem] bg-[#4DA2FD42] p-2 text-xs font-medium"
              onClick={() =>
                onModuleSelect("Joining the SUI Developer community")
              }
            >
              {completedModules.has("Joining the SUI Developer community")
                ? "Completed"
                : "Start Module"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulesComponent;
