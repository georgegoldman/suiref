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
          <div className="w-[45px] h-[45px] rounded-[10px] bg-[#4DA2FD] flex items-center justify-center">
            <AiOutlineArrowLeft color="white" />
          </div>
          <p className="text-white text-base font-rubik font-semibold">Back</p>
        </button>
        <div className="mt-6 sm:mt-4 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
          <LeaderboardTable />
        </div>
      </section>
    </div>
  );
};

export default LeaderboardPage;
