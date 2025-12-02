const ProgressBar = ({ width }: { width: number }) => {
  return (
    <svg
      width={width}
      height="4"
      viewBox="0 0 892 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={width} height="4" rx="2" fill="#009442" />
    </svg>
  );
};

export default ProgressBar;
