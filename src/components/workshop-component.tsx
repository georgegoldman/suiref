import { useState } from "react";
import CaretDown from "../assets/caret-down";
import PartyHat from "../assets/party-hat.png";

const WorkshopComponent = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    "Select workshop date & time"
  );
  const [showModal, setShowModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const workshopOptions = [
    "Aug  15 - SuiHub Lagos - 10:00 AM",
    "Aug  22 - SuiHub Lagos - 10:00 AM",
  ];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleRegister = () => {
    if (selectedOption !== "Select workshop date & time") {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowWelcomeModal(true);
  };

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    setActiveTab("modules");
  };

  return (
    <>
      <div className="flex flex-col gap-[50px]">
        <div className="flex flex-col gap-[10px]">
          <h2 className="text-2xl font-bold">Workshop</h2>
          <p className="text-white/60 text-xs font-medium">
            Choose workshop to start your SuiHub journey. Attending earns you
            referral points and gets you closer to your own rewards.
          </p>
        </div>
        <div className="flex flex-col gap-[30px] max-w-[548px] w-full">
          <div className="flex flex-col gap-[10px]">
            <h5 className="font-medium">Select Workshop</h5>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-transparent border border-white/20 rounded-[10px] px-4 py-3 flex items-center justify-between text-white/60 text-sm font-medium transition-colors"
              >
                <span className="text-left">{selectedOption}</span>
                <CaretDown isDropdownOpen={isDropdownOpen} />
              </button>

              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div className="mt-1 bg-transparent rounded-[10px] z-10 max-h-48 overflow-y-auto">
                  {workshopOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      className="w-full px-4 py-3 text-left text-white/80 text-sm font-medium hover:bg-white/10 transition-colors first:rounded-t-[10px] last:rounded-b-[10px]"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleRegister}
            className="bg-[#E8E8E8] h-[54px] py-2.5 px-5 rounded-[10px] font-medium text-sm text-[#040C33]"
          >
            Register Now
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[5px] flex items-center justify-center z-50">
          <div className="bg-[#040C33] rounded-[20px] p-8 max-w-md w-full mx-4 relative">
            {/* Party Hat Graphic */}
            <div className="flex justify-center mb-6">
              <img width={30} height={30} src={PartyHat} alt="" />
            </div>

            {/* Success Text */}
            <div className="text-center mb-8">
              <h3 className="font-bold text-white/70 mb-2">
                You're registered for the{" "}
                <span className="font-bold text-white">August 15</span>
              </h3>
              <p className="font-bold text-white/70">SuiHub Workshop</p>
            </div>

            {/* Done Button */}
            <button
              onClick={handleCloseModal}
              className="w-full bg-[#E8E8E8] text-[#040C33] h-[54px] font-medium py-3 px-6 rounded-[10px]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[5px] flex items-center justify-center z-50">
          <div className="bg-[#040C33] flex flex-col gap-[40px] rounded-[20px] p-8 py-5 max-w-md w-full mx-4 relative">
            <div className="flex flex-col items-center gap-[10px]">
              <h4 className="font-bold text-white text-[20px]">
                Welcome to SuiHub!
              </h4>
              <p className="text-white/60 font-medium text-sm text-center">
                Your attendance has been confirmed. You’re now on track to earn
                rewards.
              </p>
            </div>

            <div className="flex items-center justify-center gap-[10px]">
              <img width={30} height={30} src={PartyHat} alt="" />
              <p className="text-white/70 font-medium text-sm">
                Your referrer has just earned{" "}
                <span className="text-white">+1 points</span>
              </p>
            </div>

            <button
              onClick={handleCloseWelcomeModal}
              className="w-full bg-[#E8E8E8] text-[#040C33] h-[54px] font-medium py-3 px-6 rounded-[10px]"
            >
              Continue to Modules
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkshopComponent;
