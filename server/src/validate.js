const REQUIRED_FIELDS = ['rank', 'name', 'moodMatch', 'ingredients', 'method', 'glass', 'garnish']

export function validateCocktailResponse(parsed) {
  if (!parsed.cocktails || !Array.isArray(parsed.cocktails)) {
    throw new Error('missing cocktails array')
  }
  if (parsed.cocktails.length < 2 || parsed.cocktails.length > 3) {
    throw new Error('expected 2-3 cocktails')
  }
  for (const cocktail of parsed.cocktails) {
    for (const field of REQUIRED_FIELDS) {
      if (cocktail[field] === undefined || cocktail[field] === null) {
        throw new Error(`missing field: ${field}`)
      }
    }
  }
}
