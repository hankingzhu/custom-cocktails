// Minimalist glass silhouettes — all on a 24×42 viewBox, stroke only
const GLASS_PATHS = {
  'Rocks': 'M3,12 L21,12 L20,34 L4,34 Z',
  'Highball': 'M6,4 L18,4 L18,38 L6,38 Z',
  'Collins': 'M8,2 L16,2 L16,40 L8,40 Z',
  'Martini': 'M2,8 L12,28 L22,8 M12,28 L12,38 M7,38 L17,38',
  'Coupe': 'M2,8 C2,26 12,30 12,30 C12,30 22,26 22,8 M12,30 L12,38 M7,38 L17,38',
  'Nick & Nora': 'M4,10 C4,26 12,30 12,30 C12,30 20,26 20,10 M12,30 L12,38 M7,38 L17,38',
}

export default function GlassIcon({ type, size = 28 }) {
  const d = GLASS_PATHS[type]
  if (!d) return null
  return (
    <svg
      width={size}
      height={Math.round(size * 42 / 24)}
      viewBox="0 0 24 42"
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
