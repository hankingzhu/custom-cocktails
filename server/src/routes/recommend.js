import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt, buildUserPrompt } from '../prompt.js'
import { validateCocktailResponse } from '../validate.js'
import { MOCK_RESPONSE } from '../mockResponse.js'

const client = new Anthropic()

async function callClaude(systemPrompt, userPrompt) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  })
  const block = message.content?.[0]
  if (!block || block.type !== 'text') {
    throw new Error('unexpected Claude response shape')
  }
  const stripped = block.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
  const parsed = JSON.parse(stripped)
  validateCocktailResponse(parsed)
  return parsed
}

export async function recommendHandler(req, res) {
  const { mood, alcoholic, spirits = [], flavors = [], availableIngredients = '' } = req.body

  if (!mood || typeof mood !== 'string' || mood.trim().length === 0) {
    return res.status(400).json({ error: 'mood is required' })
  }

  if (!Array.isArray(spirits) || !Array.isArray(flavors)) {
    return res.status(400).json({ error: 'spirits and flavors must be arrays' })
  }

  if (mood.trim().length > 500) {
    return res.status(400).json({ error: 'mood must be 500 characters or fewer' })
  }
  if (availableIngredients.length > 500) {
    return res.status(400).json({ error: 'availableIngredients must be 500 characters or fewer' })
  }

  if (process.env.USE_MOCK === 'true') {
    return res.json(MOCK_RESPONSE)
  }

  const payload = { mood: mood.trim(), alcoholic: Boolean(alcoholic), spirits, flavors, availableIngredients }
  const systemPrompt = buildSystemPrompt()
  const userPrompt = buildUserPrompt(payload)

  try {
    const result = await callClaude(systemPrompt, userPrompt)
    return res.json(result)
  } catch (err) {
    // Only retry on parse/validation errors, not Anthropic API errors
    const isRetryable = err instanceof SyntaxError || (typeof err.message === 'string' && (
  err.message.startsWith('missing') ||
  err.message.startsWith('expected') ||
  err.message === 'unexpected Claude response shape'
))
    if (isRetryable) {
      try {
        const result = await callClaude(systemPrompt, userPrompt)
        return res.json(result)
      } catch {
        return res.status(500).json({ error: 'Something went wrong — please try again.' })
      }
    }
    return res.status(500).json({ error: 'Something went wrong — please try again.' })
  }
}
