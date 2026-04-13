import { validateCocktailResponse } from '../src/validate.js'

const validCocktail = {
  rank: 1,
  name: 'Midnight Ember',
  moodMatch: 'Smoky and complex to match your reflective mood.',
  ingredients: [{ item: 'Bourbon', amount: '2 oz' }],
  method: 'Stir with ice, strain into glass.',
  glass: 'Rocks glass',
  garnish: 'Orange peel'
}

describe('validateCocktailResponse', () => {
  it('accepts a valid response with 2 cocktails', () => {
    const input = { cocktails: [validCocktail, { ...validCocktail, rank: 2 }] }
    expect(() => validateCocktailResponse(input)).not.toThrow()
  })

  it('accepts a valid response with 3 cocktails', () => {
    const input = {
      cocktails: [
        validCocktail,
        { ...validCocktail, rank: 2 },
        { ...validCocktail, rank: 3 }
      ]
    }
    expect(() => validateCocktailResponse(input)).not.toThrow()
  })

  it('throws if cocktails array is missing', () => {
    expect(() => validateCocktailResponse({})).toThrow('missing cocktails array')
  })

  it('throws if cocktails array has fewer than 2 items', () => {
    expect(() => validateCocktailResponse({ cocktails: [validCocktail] })).toThrow('expected 2-3 cocktails')
  })

  it('throws if cocktails array has more than 3 items', () => {
    const tooMany = Array(4).fill(validCocktail)
    expect(() => validateCocktailResponse({ cocktails: tooMany })).toThrow('expected 2-3 cocktails')
  })

  it('throws if a cocktail is missing required fields', () => {
    const incomplete = { rank: 1, name: 'Test' }
    expect(() => validateCocktailResponse({ cocktails: [incomplete, incomplete] })).toThrow('missing field')
  })

  it('accepts null garnish', () => {
    const input = {
      cocktails: [
        { ...validCocktail, garnish: null },
        { ...validCocktail, rank: 2, garnish: null }
      ]
    }
    expect(() => validateCocktailResponse(input)).not.toThrow()
  })

  it('throws if called with null', () => {
    expect(() => validateCocktailResponse(null)).toThrow('missing cocktails array')
  })

  it('throws if a cocktail has an empty string for a required field', () => {
    const emptyMethod = { ...validCocktail, method: '' }
    expect(() => validateCocktailResponse({ cocktails: [emptyMethod, { ...validCocktail, rank: 2 }] })).toThrow('missing field: method')
  })

  it('throws if ingredients is an empty array', () => {
    const emptyIngredients = { ...validCocktail, ingredients: [] }
    expect(() => validateCocktailResponse({ cocktails: [emptyIngredients, { ...validCocktail, rank: 2 }] })).toThrow('missing field: ingredients')
  })

  it('throws if rank is a string instead of a number', () => {
    const stringRank = { ...validCocktail, rank: '1' }
    expect(() => validateCocktailResponse({ cocktails: [stringRank, { ...validCocktail, rank: 2 }] })).toThrow('missing field: rank')
  })
})
