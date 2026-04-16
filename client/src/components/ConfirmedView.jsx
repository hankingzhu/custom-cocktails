import { t } from '../i18n'

export default function ConfirmedView({ cocktail, onStartOver, lang = 'en' }) {
  const tx = t[lang]

  return (
    <div className="confirmed-view">
      <div className="confirmed-view__mark" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <polygon
            points="24,2 46,24 24,46 2,24"
            stroke="currentColor" strokeWidth="1.2"
          />
          <polygon
            points="24,10 38,24 24,38 10,24"
            stroke="currentColor" strokeWidth="0.5" opacity="0.35"
          />
          <path
            d="M16 24L21 29L32 18"
            stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="confirmed-view__heading">{tx.confirmedHeading}</h1>
      <p className="confirmed-view__name">{cocktail.name}</p>
      <p className="confirmed-view__message">{tx.confirmedSubtitle(cocktail.name)}</p>

      <button className="btn-primary confirmed-view__btn" onClick={onStartOver}>
        <span>{tx.startOver}</span>
      </button>
    </div>
  )
}
