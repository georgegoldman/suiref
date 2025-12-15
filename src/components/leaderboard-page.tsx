/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import LeaderboardTable from "./LeaderboardTable";

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex-1 p-4 sm:p-6">
      <section className="max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-[10px]"
        >
          <div className="w-[45px] h-[45px] rounded-[10px] bg-black flex items-center justify-center transition-opacity hover:opacity-80">
            <AiOutlineArrowLeft color="white" />
          </div>
          <p className="text-black text-base font-rubik font-semibold">Back</p>
        </button>
        <div className="mt-6 sm:mt-4 bg-white border border-black/10 rounded-2xl p-4 sm:p-6 shadow-sm">
          <LeaderboardTable />
        </div>
      </section>
    </div>
  );
};

export default LeaderboardPage;
