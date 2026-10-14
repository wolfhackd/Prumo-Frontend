type ArrowIconProps = {
  diagonal?: boolean;
};

export function ArrowIcon({ diagonal = false }: ArrowIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={diagonal ? "arrow-icon arrow-icon-diagonal" : "arrow-icon"}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M4 10h11M10 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path
          d="M8 22.5 16 7l8 15.5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 18h10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="m5 10 3.2 3.2L15 6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
