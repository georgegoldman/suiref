interface ProgressCircleProps {
  moduleNumber: number;
  isCompleted: boolean;
  progress: number; // 0-100
}

const ProgressCircle = ({
  moduleNumber,
  isCompleted,
  progress,
}: ProgressCircleProps) => {
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-[35px] h-[35px] flex items-center justify-center">
      {/* Background circle */}
      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
        <circle
          cx="17.5"
          cy="17.5"
          r={radius}
          stroke="#E8E8E8"
          strokeWidth="2"
          fill="transparent"
        />
      </svg>

      {/* Progress circle */}
      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
        <circle
          cx="17.5"
          cy="17.5"
          r={radius}
          stroke={isCompleted ? "#4DA2FD" : "#4DA2FD"}
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
      </svg>

      {/* Module number */}
      <div
        className={`text-xs font-medium z-10 ${
          isCompleted ? "text-white" : "text-[#4DA2FD]"
        }`}
      >
        {moduleNumber}
      </div>

      {/* Completion checkmark */}
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ProgressCircle;
