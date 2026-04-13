const REQUIRED_FIELDS = ['rank', 'name', 'moodMatch', 'ingredients', 'method', 'glass', 'garnish']
const NULLABLE_FIELDS = ['garnish']

export function validateCocktailResponse(parsed) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('missing cocktails array')
  }
  if (!parsed.cocktails || !Array.isArray(parsed.cocktails)) {
    throw new Error('missing cocktails array')
  }
  if (parsed.cocktails.length < 2 || parsed.cocktails.length > 3) {
    throw new Error('expected 2-3 cocktails')
  }
  for (const cocktail of parsed.cocktails) {
    for (const field of REQUIRED_FIELDS) {
      const value = cocktail[field]
      const isMissing = NULLABLE_FIELDS.includes(field)
        ? value === undefined
        : value === undefined || value === null
      const isEmptyString = typeof value === 'string' && value.trim() === ''
      if (isMissing || isEmptyString) {
        throw new Error(`missing field: ${field}`)
      }
    }
    if (!Array.isArray(cocktail.ingredients) || cocktail.ingredients.length === 0) {
      throw new Error('missing field: ingredients')
    }
    if (typeof cocktail.rank !== 'number') {
      throw new Error('missing field: rank')
    }
  }
}
