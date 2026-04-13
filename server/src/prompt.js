import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const COCKTAIL_REFERENCE = readFileSync(
  resolve(__dirname, '../../classical-cocktails.md'),
  'utf-8'
)

export function buildSystemPrompt(cocktailReference = COCKTAIL_REFERENCE) {
  return `You are an expert professional mixologist with deep knowledge of classic and contemporary cocktails. Use the following classical cocktail reference as inspiration and grounding — you may adapt classics or create entirely new cocktails.

CLASSICAL COCKTAIL REFERENCE:
${cocktailReference}

RESPONSE RULES:
- Always respond with valid JSON only. No prose, no markdown, no extra text.
- Return exactly 2 or 3 cocktail recommendations ranked by fit.
- Use this exact JSON schema (replace all placeholder descriptions with real values):
\`\`\`json
{
  "cocktails": [
    {
      "rank": 1,
      "name": "string — cocktail name",
      "moodMatch": "string — 1-2 sentences explaining why this suits the user",
      "ingredients": [{ "item": "string", "amount": "string" }],
      "method": "string — step-by-step preparation",
      "glass": "string — glass type",
      "garnish": "string or null if no garnish"
    }
  ]
}
\`\`\`
- Do not wrap the response in a code fence or markdown block. Return raw JSON only.
- "rank" must be a sequential integer starting at 1. No repeated ranks.
- Cocktail names can be whimsical, evocative, or classic — match the mood.
- The moodMatch must directly reference what the user described.`
}

export function buildUserPrompt(payload) {
  const { mood, alcoholic, spirits, flavors, availableIngredients } = payload

  const lines = []
  lines.push(`How I feel: ${mood}`)

  if (!alcoholic) {
    lines.push('Requirement: non-alcoholic mocktails only — no spirits or alcohol of any kind.')
  } else {
    if (spirits && spirits.length > 0) {
      lines.push(`Preferred spirits: ${spirits.join(', ')}`)
    }
  }

  if (flavors && flavors.length > 0) {
    lines.push(`Flavor preferences: ${flavors.join(', ')}`)
  }

  if (availableIngredients && availableIngredients.trim() !== '') {
    lines.push(`Constraint: only use ingredients from this list (plus basic bar staples like ice, water, sugar): ${availableIngredients}`)
    lines.push('If the available ingredients cannot produce 2 cocktails, relax the constraint for lower-ranked suggestions and note the substitution in moodMatch.')
  }

  lines.push('Recommend 2-3 cocktails that best match my mood and preferences. Rank them by fit.')

  return lines.join('\n')
}
