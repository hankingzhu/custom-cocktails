// Minimalist glass silhouettes — all on a 24×44 viewBox, stroke only
const GLASS_PATHS = {
  'Rocks':    'M3,12 L21,12 L20,34 L4,34 Z',
  'Highball': 'M6,4 L18,4 L18,40 L6,40 Z',
  'Coupe':    'M2,6 C2,22 12,26 12,26 C12,26 22,22 22,6 M12,26 L12,42 M6,42 L18,42',
  'Martini':  'M2,6 L12,24 L22,6 M12,24 L12,42 M6,42 L18,42',
}

export default function GlassIcon({ type, size = 28 }) {
  const d = GLASS_PATHS[type]
  if (!d) return null
  return (
    <svg
      width={size}
      height={Math.round(size * 44 / 24)}
      viewBox="0 0 24 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}
