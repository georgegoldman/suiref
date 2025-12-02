const Calendar = ({ className }: { className?: string }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.3334 1.66602V4.99935M6.66669 1.66602V4.99935"
        stroke="white"
        strokeOpacity="0.6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.8333 3.33398H9.16667C6.02397 3.33398 4.45262 3.33398 3.47631 4.31029C2.5 5.28661 2.5 6.85795 2.5 10.0007V11.6673C2.5 14.81 2.5 16.3814 3.47631 17.3577C4.45262 18.334 6.02397 18.334 9.16667 18.334H10.8333C13.976 18.334 15.5474 18.334 16.5237 17.3577C17.5 16.3814 17.5 14.81 17.5 11.6673V10.0007C17.5 6.85795 17.5 5.28661 16.5237 4.31029C15.5474 3.33398 13.976 3.33398 10.8333 3.33398Z"
        stroke="white"
        strokeOpacity="0.6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 8.33398H17.5"
        stroke="white"
        strokeOpacity="0.6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99627 11.666H10.0038M9.99627 14.9993H10.0038M13.3259 11.666H13.3334M6.66669 11.666H6.67416M6.66669 14.9993H6.67416"
        stroke="white"
        strokeOpacity="0.6"
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Calendar;
