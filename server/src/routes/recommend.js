import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt, buildUserPrompt } from '../prompt.js'
import { validateCocktailResponse } from '../validate.js'

const client = new Anthropic()

async function callClaude(systemPrompt, userPrompt) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  })
  const text = message.content[0].text
  const parsed = JSON.parse(text)
  validateCocktailResponse(parsed)
  return parsed
}

export async function recommendHandler(req, res) {
  const { mood, alcoholic, spirits = [], flavors = [], availableIngredients = '' } = req.body

  if (!mood || typeof mood !== 'string' || mood.trim().length === 0) {
    return res.status(400).json({ error: 'mood is required' })
  }

  const payload = { mood: mood.trim(), alcoholic: Boolean(alcoholic), spirits, flavors, availableIngredients }
  const systemPrompt = buildSystemPrompt()
  const userPrompt = buildUserPrompt(payload)

  try {
    const result = await callClaude(systemPrompt, userPrompt)
    return res.json(result)
  } catch {
    // Retry once on failure (malformed JSON or validation error)
    try {
      const result = await callClaude(systemPrompt, userPrompt)
      return res.json(result)
    } catch {
      return res.status(500).json({ error: 'Something went wrong — please try again.' })
    }
  }
}
