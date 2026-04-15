import { t } from '../i18n'

export default function ErrorView({ message, onRetry, lang = 'en' }) {
  const tx = t[lang]
  return (
    <div className="error-view">
      <p className="error-view__message">{message}</p>
      <button className="btn-primary" onClick={onRetry}>
        <span>{tx.tryAgain}</span>
      </button>
    </div>
  )
}
