import { getRecommendations } from './api'

describe('getRecommendations', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('POSTs to /api/recommend and returns parsed JSON', async () => {
    const mockResponse = { cocktails: [] }
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    })

    const payload = {
      mood: 'relaxed',
      alcoholic: true,
      spirits: [],
      flavors: [],
      availableIngredients: ''
    }

    const result = await getRecommendations(payload)
    expect(global.fetch).toHaveBeenCalledWith('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    expect(result).toEqual(mockResponse)
  })

  it('throws an error when the response is not ok', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Something went wrong — please try again.' })
    })

    await expect(
      getRecommendations({ mood: 'happy', alcoholic: true, spirits: [], flavors: [], availableIngredients: '' })
    ).rejects.toThrow('Something went wrong — please try again.')
  })
})
