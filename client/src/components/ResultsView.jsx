import CocktailCard from './CocktailCard'
import { t } from '../i18n'

export default function ResultsView({ cocktails, onReset, onSelect, lang = 'en' }) {
  const tx = t[lang]
  return (
    <div className="results-view">
      <header className="results-view__header">
        <h1>{tx.yourCocktails}</h1>
        <button className="btn-secondary" onClick={onReset}>{tx.tryAgain}</button>
      </header>
      <div className="results-view__cards">
        {cocktails.map(cocktail => (
          <CocktailCard
            key={cocktail.rank}
            cocktail={cocktail}
            onSelect={onSelect}
            lang={lang}
          />
        ))}
      </div>
    </div>
  )
}
