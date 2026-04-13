import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'

const mockCocktailResponse = {
  cocktails: [
    {
      rank: 1,
      name: 'Quiet Storm',
      moodMatch: 'Smoky and calming for a long day.',
      ingredients: [{ item: 'Bourbon', amount: '2 oz' }, { item: 'Honey syrup', amount: '½ oz' }],
      method: 'Stir with ice, strain into rocks glass.',
      glass: 'Rocks glass',
      garnish: 'Orange peel'
    },
    {
      rank: 2,
      name: 'Velvet Hour',
      moodMatch: 'Smooth and easy-drinking for unwinding.',
      ingredients: [{ item: 'Rye whiskey', amount: '2 oz' }, { item: 'Sweet vermouth', amount: '1 oz' }],
      method: 'Stir with ice, strain into coupe.',
      glass: 'Coupe',
      garnish: 'Cherry'
    }
  ]
}

// Mock the Anthropic SDK using ESM-compatible unstable_mockModule
const mockCreate = jest.fn()

jest.unstable_mockModule('@anthropic-ai/sdk', () => ({
  default: jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate }
  }))
}))

// Dynamic imports must come AFTER jest.unstable_mockModule
const { createApp } = await import('../src/index.js')

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const app = createApp()
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})

describe('POST /api/recommend', () => {
  beforeEach(() => {
    mockCreate.mockResolvedValue({
      content: [{ text: JSON.stringify(mockCocktailResponse) }]
    })
  })

  it('returns 200 with cocktail recommendations on valid input', async () => {
    const app = createApp()
    const res = await request(app)
      .post('/api/recommend')
      .send({
        mood: 'stressed after a long day, want something smoky',
        alcoholic: true,
        spirits: ['Whiskey'],
        flavors: ['Smoky'],
        availableIngredients: ''
      })

    expect(res.status).toBe(200)
    expect(res.body.cocktails).toHaveLength(2)
    expect(res.body.cocktails[0].name).toBe('Quiet Storm')
  })

  it('returns 400 when mood is missing', async () => {
    const app = createApp()
    const res = await request(app)
      .post('/api/recommend')
      .send({ alcoholic: true, spirits: [], flavors: [], availableIngredients: '' })

    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/mood/)
  })

  it('returns 500 when Claude returns malformed JSON and retry also fails', async () => {
    mockCreate.mockResolvedValue({
      content: [{ text: 'not valid json at all' }]
    })

    const app = createApp()
    const res = await request(app)
      .post('/api/recommend')
      .send({
        mood: 'happy day feeling good',
        alcoholic: true,
        spirits: [],
        flavors: [],
        availableIngredients: ''
      })

    expect(res.status).toBe(500)
    expect(res.body.error).toMatch(/try again/)
  })
})
