export default function Logo({ size = 72 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-mark"
      aria-label="The Confidant"
    >
      {/* Outer diamond frame */}
      <polygon
        points="50,4 96,50 50,96 4,50"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      {/* Inner diamond hairline */}
      <polygon
        points="50,14 86,50 50,86 14,50"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.35"
      />
      {/* Martini bowl */}
      <path
        d="M32,34 L68,34 L50,62 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Stem */}
      <line
        x1="50" y1="62" x2="50" y2="74"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Base */}
      <line
        x1="40" y1="74" x2="60" y2="74"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
