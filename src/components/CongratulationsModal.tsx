import PartyHat from "../assets/party-hat.png";
interface CongratulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAllModulesCompleted?: boolean;
  onNavigateToRewards?: () => void;
}

const CongratulationsModal = ({
  isOpen,
  onClose,
  isAllModulesCompleted = false,
  onNavigateToRewards,
}: CongratulationsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[5px] flex items-center justify-center z-50">
      <div className="bg-[#040C33] rounded-[10px] p-[20px] flex flex-col gap-[33px] max-w-[410px] w-full mx-4 text-center">
        <div className="flex flex-col items-center gap-[10px]">
          <img width={30} height={30} src={PartyHat} alt="" />

          {isAllModulesCompleted && (
            <h3 className="text-center font-bold text-normal">
              Congratulations you’ve completed all 5 modules
            </h3>
          )}

          <p
            className={`text-white/70 font-bold ${
              isAllModulesCompleted ? "text-xs" : "text-base"
            }`}
          >
            {isAllModulesCompleted
              ? `Your NFTs reward will be sent to your wallet. You now have early access to bootcamps and hackathons.`
              : "Congratulations! You've completed your first module"}
          </p>
        </div>

        {isAllModulesCompleted ? (
          <div className="flex flex-col items-start gap-[10px]">
            <p className="text-white/50 font-bold text-[8px]">
              NB: Your referrer just earned +5 points for helping you complete
              the journey.
            </p>
            <button
              onClick={onNavigateToRewards}
              className="bg-[#E8E8E8] w-full py-[10px] px-[20px] rounded-[10px] text-sm font-medium text-[#040C33] hover:bg-[#D1D1D1] transition-colors"
            >
              View my Rewards
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="bg-[#4DA2FD] text-white px-5 py-2.5 text-sm rounded-[10px] font-medium hover:bg-[#3B8FE8] transition-colors"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default CongratulationsModal;
