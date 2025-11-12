const ArrowDown = ({ isDropdownOpen }: { isDropdownOpen: boolean }) => {
  return (
    <svg
      width="18"
      height="10"
      viewBox="0 0 18 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-white transition-transform ${
        isDropdownOpen ? "rotate-180" : ""
      }`}
    >
      <path
        d="M16.7813 0.781316C16.7813 0.781316 10.8894 8.78125 8.78131 8.78125C6.67304 8.78125 0.781311 0.78125 0.781311 0.78125"
        stroke="white"
        strokeWidth="1.5625"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowDown;
