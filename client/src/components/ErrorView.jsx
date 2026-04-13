export default function ErrorView({ message, onRetry }) {
  return (
    <div className="error-view">
      <p className="error-view__message">{message}</p>
      <button className="btn-primary" onClick={onRetry}>Try Again</button>
    </div>
  )
}
