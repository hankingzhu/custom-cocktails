export default function CocktailCard({ cocktail }) {
  const { rank, name, moodMatch, ingredients, method, glass, garnish } = cocktail

  return (
    <article className="cocktail-card">
      <div className="cocktail-card__header">
        <span className="cocktail-card__rank">#{rank}</span>
        <h2 className="cocktail-card__name">{name}</h2>
      </div>

      <p className="cocktail-card__mood-match">{moodMatch}</p>

      <div className="cocktail-card__section">
        <h3>Ingredients</h3>
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
        <h3>Method</h3>
        <p>{method}</p>
      </div>

      <div className="cocktail-card__meta">
        <span>Glass: {glass}</span>
        <span>Garnish: {garnish ?? 'None'}</span>
      </div>
    </article>
  )
}
