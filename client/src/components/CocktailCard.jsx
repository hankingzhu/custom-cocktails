import { t } from '../i18n'

export default function CocktailCard({ cocktail, onSelect, lang = 'en' }) {
  const tx = t[lang]
  const { rank, name, moodMatch, ingredients, method, glass, garnish } = cocktail

  return (
    <article className="cocktail-card">
      <div className="cocktail-card__header">
        <span className="cocktail-card__rank">#{rank}</span>
        <h2 className="cocktail-card__name">{name}</h2>
      </div>

      <p className="cocktail-card__mood-match">{moodMatch}</p>

      <div className="cocktail-card__section">
        <h3>{tx.ingredients}</h3>
        <ul className="ingredient-list">
          {ingredients.map((ing) => (
            <li key={`${ing.item}-${ing.amount}`} className="ingredient-item">
              <span className="ingredient-item__name">{ing.item}</span>
              <span className="ingredient-item__amount">{ing.amount}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="cocktail-card__section">
        <h3>{tx.method}</h3>
        <p>{method}</p>
      </div>

      <div className="cocktail-card__meta">
        <span data-label={tx.glass}>{glass}</span>
        <span data-label={tx.garnish}>{garnish ?? tx.none}</span>
      </div>

      {onSelect && (
        <button className="btn-select" onClick={() => onSelect(cocktail)}>
          <span>{tx.selectDrink}</span>
        </button>
      )}
    </article>
  )
}
