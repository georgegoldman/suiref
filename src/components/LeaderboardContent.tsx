import React from "react";

export interface LeaderboardContentProps {
  showBackButton?: boolean;
  padding?: string;
  centerContent?: boolean;
}

// ⬅️ Make sure the component is typed with these props
const LeaderboardContent: React.FC<LeaderboardContentProps> = ({
  padding = "px-16 py-10",
  centerContent = true,
}) => {
  return (
    <div className={`flex flex-col gap-[3rem] ${padding} max-w-7xl ${centerContent ? "mx-auto" : ""}`}>
      {/* ...the rest of your existing LeaderboardContent JSX... */}
    </div>
  );
};

export default LeaderboardContent;
