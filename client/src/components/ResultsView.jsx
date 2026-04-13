import CocktailCard from './CocktailCard'

export default function ResultsView({ cocktails, onReset }) {
  return (
    <div className="results-view">
      <header className="results-view__header">
        <h1>Your Cocktails</h1>
        <button className="btn-secondary" onClick={onReset}>Try Again</button>
      </header>
      <div className="results-view__cards">
        {cocktails.map(cocktail => (
          <CocktailCard key={cocktail.rank} cocktail={cocktail} />
        ))}
      </div>
    </div>
  )
}
