import { buildSystemPrompt, buildUserPrompt } from '../src/prompt.js'

describe('buildSystemPrompt', () => {
  it('returns a string containing the mixologist role instruction', () => {
    const prompt = buildSystemPrompt('mock cocktail reference content')
    expect(typeof prompt).toBe('string')
    expect(prompt).toContain('mixologist')
    expect(prompt).toContain('mock cocktail reference content')
    expect(prompt).toContain('JSON')
  })
})

describe('buildUserPrompt', () => {
  it('includes mood in the prompt', () => {
    const payload = {
      mood: 'stressed after a long day',
      alcoholic: true,
      spirits: ['Whiskey'],
      flavors: ['Smoky'],
      availableIngredients: ''
    }
    const prompt = buildUserPrompt(payload)
    expect(prompt).toContain('stressed after a long day')
    expect(prompt).toContain('Whiskey')
    expect(prompt).toContain('Smoky')
  })

  it('mentions non-alcoholic restriction when alcoholic is false', () => {
    const payload = {
      mood: 'relaxed',
      alcoholic: false,
      spirits: [],
      flavors: [],
      availableIngredients: ''
    }
    const prompt = buildUserPrompt(payload)
    expect(prompt.toLowerCase()).toContain('non-alcoholic')
  })

  it('includes available ingredients when provided', () => {
    const payload = {
      mood: 'happy',
      alcoholic: true,
      spirits: [],
      flavors: [],
      availableIngredients: 'gin, lemon, honey'
    }
    const prompt = buildUserPrompt(payload)
    expect(prompt).toContain('gin, lemon, honey')
  })

  it('does not mention available ingredients when field is empty', () => {
    const payload = {
      mood: 'happy',
      alcoholic: true,
      spirits: [],
      flavors: [],
      availableIngredients: ''
    }
    const prompt = buildUserPrompt(payload)
    expect(prompt).not.toContain('only use')
  })
})
