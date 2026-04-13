# Mixologist AI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a stateless web app where users describe their mood and get 2–3 personalized AI-generated cocktail recipes back.

**Architecture:** React frontend (Vite) sends a form payload to a thin Node.js/Express backend, which constructs a Claude prompt using the user's input plus the classical cocktails reference file, calls the Claude API, validates the JSON response, and returns cocktail cards to the browser. No database, no auth, no sessions.

**Tech Stack:** React 18, Vite, Node.js 20+, Express 4, Anthropic SDK (`@anthropic-ai/sdk`), Jest + Supertest (server tests), Vitest + React Testing Library (client tests)

---

## File Map

```
custom-cocktails/
├── classical-cocktails.md          (existing — injected into prompts)
├── package.json                    (root workspace config)
├── server/
│   ├── package.json
│   ├── src/
│   │   ├── index.js                (Express entry point)
│   │   ├── prompt.js               (builds Claude prompt from user payload)
│   │   ├── validate.js             (validates Claude JSON response shape)
│   │   └── routes/
│   │       └── recommend.js        (POST /api/recommend handler)
│   └── tests/
│       ├── prompt.test.js
│       ├── validate.test.js
│       └── recommend.test.js
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx                (React entry point)
        ├── App.jsx                 (root — owns view state: input|loading|results|error)
        ├── api.js                  (single fetch wrapper for POST /api/recommend)
        ├── index.css               (global styles)
        └── components/
            ├── InputView.jsx       (form: textarea + toggles + submit)
            ├── ResultsView.jsx     (ranked cocktail card list + Try Again)
            ├── CocktailCard.jsx    (single card: name, mood match, recipe, method)
            └── ErrorView.jsx       (error message + retry button)
```

---

## Task 1: Initialize Project Structure

**Files:**
- Create: `package.json` (root)
- Create: `server/package.json`
- Create: `client/package.json`
- Create: `client/vite.config.js`
- Create: `client/index.html`
- Create: `client/src/main.jsx`

- [ ] **Step 1: Create root workspace package.json**

```json
{
  "name": "mixologist-ai",
  "private": true,
  "workspaces": ["server", "client"],
  "scripts": {
    "dev:server": "npm run dev --workspace=server",
    "dev:client": "npm run dev --workspace=client",
    "test": "npm run test --workspace=server && npm run test --workspace=client"
  }
}
```

- [ ] **Step 2: Create server/package.json**

```json
{
  "name": "mixologist-ai-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js",
    "test": "node --experimental-vm-modules node_modules/.bin/jest --runInBand"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "cors": "^2.8.5",
    "express": "^4.21.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^7.0.0"
  },
  "jest": {
    "extensionsToTreatAsEsm": [".js"],
    "transform": {}
  }
}
```

- [ ] **Step 3: Install server dependencies**

Run from `server/`:
```bash
cd server && npm install
```

Expected: `node_modules/` populated, no errors.

- [ ] **Step 4: Create client with Vite**

Run from project root:
```bash
cd client && npm create vite@latest . -- --template react
npm install
```

Expected: `client/src/App.jsx`, `client/src/main.jsx`, `client/vite.config.js` created.

- [ ] **Step 5: Install Vitest and React Testing Library in client**

Run from `client/`:
```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 6: Update client/vite.config.js to add test config**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js'
  }
})
```

- [ ] **Step 7: Create client/src/setupTests.js**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 8: Update client/package.json scripts**

Add to the `"scripts"` section:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 9: Commit**

```bash
git init
git add package.json server/package.json server/node_modules/.gitkeep client/package.json client/vite.config.js client/src/setupTests.js
```

Create `.gitignore` at project root first:
```
node_modules/
dist/
.env
```

```bash
git add .gitignore
git commit -m "feat: initialize project structure with server and client workspaces"
```

---

## Task 2: Express Server with Health Check

**Files:**
- Create: `server/src/index.js`
- Create: `server/tests/recommend.test.js` (health check portion only)

- [ ] **Step 1: Write the failing test**

Create `server/tests/recommend.test.js`:
```js
import request from 'supertest'
import { createApp } from '../src/index.js'

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const app = createApp()
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run from `server/`:
```bash
npm test
```
Expected: FAIL — `Cannot find module '../src/index.js'`

- [ ] **Step 3: Implement server/src/index.js**

```js
import express from 'express'
import cors from 'cors'

export function createApp() {
  const app = express()
  app.use(cors())
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  return app
}

const PORT = process.env.PORT || 3001
const app = createApp()
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test
```
Expected: PASS — `GET /health returns 200 with status ok`

- [ ] **Step 5: Commit**

```bash
git add server/src/index.js server/tests/recommend.test.js
git commit -m "feat: add Express server with health check endpoint"
```

---

## Task 3: Prompt Builder

**Files:**
- Create: `server/src/prompt.js`
- Create: `server/tests/prompt.test.js`

The prompt builder reads `classical-cocktails.md` at startup and uses it as grounding context in every Claude call.

- [ ] **Step 1: Write the failing tests**

Create `server/tests/prompt.test.js`:
```js
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```
Expected: FAIL — `Cannot find module '../src/prompt.js'`

- [ ] **Step 3: Implement server/src/prompt.js**

```js
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
- Use this exact JSON schema:
{
  "cocktails": [
    {
      "rank": 1,
      "name": "string",
      "moodMatch": "1-2 sentence explanation of why this suits the user",
      "ingredients": [{ "item": "string", "amount": "string" }],
      "method": "string",
      "glass": "string",
      "garnish": "string"
    }
  ]
}
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
  }

  lines.push('\nRecommend 2-3 cocktails that best match my mood and preferences. Rank them by fit.')

  return lines.join('\n')
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: PASS — all 5 prompt tests pass.

- [ ] **Step 5: Commit**

```bash
git add server/src/prompt.js server/tests/prompt.test.js
git commit -m "feat: add prompt builder for Claude API calls"
```

---

## Task 4: Response Validator

**Files:**
- Create: `server/src/validate.js`
- Create: `server/tests/validate.test.js`

- [ ] **Step 1: Write the failing tests**

Create `server/tests/validate.test.js`:
```js
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
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```
Expected: FAIL — `Cannot find module '../src/validate.js'`

- [ ] **Step 3: Implement server/src/validate.js**

```js
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: PASS — all 6 validate tests pass.

- [ ] **Step 5: Commit**

```bash
git add server/src/validate.js server/tests/validate.test.js
git commit -m "feat: add response validator for Claude output"
```

---

## Task 5: Recommend Route

**Files:**
- Create: `server/src/routes/recommend.js`
- Modify: `server/src/index.js` (mount the route)
- Modify: `server/tests/recommend.test.js` (add route tests)

- [ ] **Step 1: Write the failing tests**

Add to `server/tests/recommend.test.js`:
```js
import Anthropic from '@anthropic-ai/sdk'

// Mock the Anthropic SDK
jest.mock('@anthropic-ai/sdk')

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

describe('POST /api/recommend', () => {
  beforeEach(() => {
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{ text: JSON.stringify(mockCocktailResponse) }]
        })
      }
    }))
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
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{ text: 'not valid json at all' }]
        })
      }
    }))

    const app = createApp()
    const res = await request(app)
      .post('/api/recommend')
      .send({
        mood: 'happy',
        alcoholic: true,
        spirits: [],
        flavors: [],
        availableIngredients: ''
      })

    expect(res.status).toBe(500)
    expect(res.body.error).toMatch(/try again/)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```
Expected: FAIL — route tests fail (route not yet mounted).

- [ ] **Step 3: Create server/src/routes/recommend.js**

```js
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
```

- [ ] **Step 4: Mount route in server/src/index.js**

```js
import express from 'express'
import cors from 'cors'
import { recommendHandler } from './routes/recommend.js'

export function createApp() {
  const app = express()
  app.use(cors())
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.post('/api/recommend', recommendHandler)

  return app
}

const PORT = process.env.PORT || 3001
const app = createApp()
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test
```
Expected: PASS — all health check and recommend route tests pass.

- [ ] **Step 6: Commit**

```bash
git add server/src/routes/recommend.js server/src/index.js server/tests/recommend.test.js
git commit -m "feat: add POST /api/recommend route with Claude integration and retry logic"
```

---

## Task 6: Frontend API Module + App Shell

**Files:**
- Create: `client/src/api.js`
- Modify: `client/src/App.jsx` (replace Vite boilerplate with app shell)
- Modify: `client/src/index.css` (replace Vite boilerplate)

- [ ] **Step 1: Write the failing test for api.js**

Create `client/src/api.test.js`:
```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run from `client/`:
```bash
npm test
```
Expected: FAIL — `Cannot find module './api'`

- [ ] **Step 3: Implement client/src/api.js**

```js
export async function getRecommendations(payload) {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong — please try again.')
  }
  return data
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test
```
Expected: PASS — both api.js tests pass.

- [ ] **Step 5: Replace client/src/App.jsx with app shell**

```jsx
import { useState } from 'react'
import InputView from './components/InputView'
import ResultsView from './components/ResultsView'
import ErrorView from './components/ErrorView'
import { getRecommendations } from './api'
import './index.css'

export default function App() {
  const [view, setView] = useState('input')  // 'input' | 'loading' | 'results' | 'error'
  const [cocktails, setCocktails] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(payload) {
    setView('loading')
    try {
      const data = await getRecommendations(payload)
      setCocktails(data.cocktails)
      setView('results')
    } catch (err) {
      setErrorMessage(err.message)
      setView('error')
    }
  }

  function handleReset() {
    setCocktails([])
    setErrorMessage('')
    setView('input')
  }

  if (view === 'loading') {
    return (
      <main className="app">
        <div className="loading">
          <p>Crafting your cocktails...</p>
        </div>
      </main>
    )
  }

  if (view === 'results') {
    return (
      <main className="app">
        <ResultsView cocktails={cocktails} onReset={handleReset} />
      </main>
    )
  }

  if (view === 'error') {
    return (
      <main className="app">
        <ErrorView message={errorMessage} onRetry={handleReset} />
      </main>
    )
  }

  return (
    <main className="app">
      <InputView onSubmit={handleSubmit} />
    </main>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add client/src/api.js client/src/api.test.js client/src/App.jsx
git commit -m "feat: add frontend API module and App shell with view state management"
```

---

## Task 7: InputView Component

**Files:**
- Create: `client/src/components/InputView.jsx`
- Create: `client/src/components/InputView.test.jsx`

- [ ] **Step 1: Write the failing tests**

Create `client/src/components/InputView.test.jsx`:
```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InputView from './InputView'

describe('InputView', () => {
  it('renders the heading and textarea', () => {
    render(<InputView onSubmit={vi.fn()} />)
    expect(screen.getByText(/tell us how you feel/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /how are you feeling/i })).toBeInTheDocument()
  })

  it('submit button is disabled when textarea has fewer than 10 characters', () => {
    render(<InputView onSubmit={vi.fn()} />)
    const textarea = screen.getByRole('textbox', { name: /how are you feeling/i })
    fireEvent.change(textarea, { target: { value: 'short' } })
    expect(screen.getByRole('button', { name: /craft my cocktail/i })).toBeDisabled()
  })

  it('submit button is enabled when textarea has 10 or more characters', async () => {
    render(<InputView onSubmit={vi.fn()} />)
    const textarea = screen.getByRole('textbox', { name: /how are you feeling/i })
    await userEvent.type(textarea, 'I feel great today!')
    expect(screen.getByRole('button', { name: /craft my cocktail/i })).not.toBeDisabled()
  })

  it('hides spirit chips when non-alcoholic is selected', async () => {
    render(<InputView onSubmit={vi.fn()} />)
    const toggle = screen.getByRole('checkbox', { name: /non-alcoholic/i })
    await userEvent.click(toggle)
    expect(screen.queryByText('Whiskey')).not.toBeInTheDocument()
  })

  it('shows spirit chips when alcoholic is selected (default)', () => {
    render(<InputView onSubmit={vi.fn()} />)
    expect(screen.getByText('Whiskey')).toBeInTheDocument()
  })

  it('calls onSubmit with correct payload when submitted', async () => {
    const onSubmit = vi.fn()
    render(<InputView onSubmit={onSubmit} />)
    const textarea = screen.getByRole('textbox', { name: /how are you feeling/i })
    await userEvent.type(textarea, 'I had a long day and need to relax')
    await userEvent.click(screen.getByText('Whiskey'))
    await userEvent.click(screen.getByRole('button', { name: /craft my cocktail/i }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        mood: 'I had a long day and need to relax',
        alcoholic: true,
        spirits: expect.arrayContaining(['Whiskey'])
      })
    )
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```
Expected: FAIL — `Cannot find module './InputView'`

- [ ] **Step 3: Create client/src/components/InputView.jsx**

```jsx
import { useState } from 'react'

const SPIRITS = ['Whiskey', 'Gin', 'Rum', 'Tequila', 'Vodka']
const FLAVORS = ['Sweet', 'Sour', 'Bitter', 'Spicy', 'Smoky', 'Light']

export default function InputView({ onSubmit }) {
  const [mood, setMood] = useState('')
  const [alcoholic, setAlcoholic] = useState(true)
  const [spirits, setSpirits] = useState([])
  const [flavors, setFlavors] = useState([])
  const [availableIngredients, setAvailableIngredients] = useState('')

  function toggleChip(list, setList, value) {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ mood, alcoholic, spirits, flavors, availableIngredients })
  }

  return (
    <div className="input-view">
      <header>
        <h1>Mixologist AI</h1>
        <p className="tagline">Tell us how you feel, we'll make your drink</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="mood">How are you feeling?</label>
          <textarea
            id="mood"
            value={mood}
            onChange={e => setMood(e.target.value)}
            placeholder="I had a long day, want something smoky and not too sweet..."
            rows={4}
          />
        </div>

        <div className="field">
          <label>
            <input
              type="checkbox"
              aria-label="non-alcoholic"
              checked={!alcoholic}
              onChange={e => {
                setAlcoholic(!e.target.checked)
                setSpirits([])
              }}
            />
            {' '}Non-alcoholic
          </label>
        </div>

        {alcoholic && (
          <div className="field">
            <p className="field-label">Spirit preference</p>
            <div className="chips">
              {SPIRITS.map(spirit => (
                <button
                  key={spirit}
                  type="button"
                  className={`chip ${spirits.includes(spirit) ? 'chip--active' : ''}`}
                  onClick={() => toggleChip(spirits, setSpirits, spirit)}
                >
                  {spirit}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="field">
          <p className="field-label">Flavor nudge</p>
          <div className="chips">
            {FLAVORS.map(flavor => (
              <button
                key={flavor}
                type="button"
                className={`chip ${flavors.includes(flavor) ? 'chip--active' : ''}`}
                onClick={() => toggleChip(flavors, setFlavors, flavor)}
              >
                {flavor}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="ingredients">Ingredients I have at home (optional)</label>
          <input
            id="ingredients"
            type="text"
            value={availableIngredients}
            onChange={e => setAvailableIngredients(e.target.value)}
            placeholder="gin, lemon, honey, soda water..."
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={mood.trim().length < 10}
        >
          Craft My Cocktail
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: PASS — all 6 InputView tests pass.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/InputView.jsx client/src/components/InputView.test.jsx
git commit -m "feat: add InputView component with form, toggles, and chip selectors"
```

---

## Task 8: CocktailCard Component

**Files:**
- Create: `client/src/components/CocktailCard.jsx`
- Create: `client/src/components/CocktailCard.test.jsx`

- [ ] **Step 1: Write the failing tests**

Create `client/src/components/CocktailCard.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import CocktailCard from './CocktailCard'

const mockCocktail = {
  rank: 1,
  name: 'Midnight Ember',
  moodMatch: 'This smoky whiskey cocktail matches your reflective mood.',
  ingredients: [
    { item: 'Bourbon', amount: '2 oz' },
    { item: 'Honey syrup', amount: '½ oz' }
  ],
  method: 'Stir with ice, strain into rocks glass.',
  glass: 'Rocks glass',
  garnish: 'Orange peel'
}

describe('CocktailCard', () => {
  it('renders the cocktail name', () => {
    render(<CocktailCard cocktail={mockCocktail} />)
    expect(screen.getByText('Midnight Ember')).toBeInTheDocument()
  })

  it('renders the mood match explanation', () => {
    render(<CocktailCard cocktail={mockCocktail} />)
    expect(screen.getByText(/smoky whiskey cocktail/i)).toBeInTheDocument()
  })

  it('renders all ingredients with amounts', () => {
    render(<CocktailCard cocktail={mockCocktail} />)
    expect(screen.getByText('Bourbon')).toBeInTheDocument()
    expect(screen.getByText('2 oz')).toBeInTheDocument()
    expect(screen.getByText('Honey syrup')).toBeInTheDocument()
  })

  it('renders the preparation method', () => {
    render(<CocktailCard cocktail={mockCocktail} />)
    expect(screen.getByText(/stir with ice/i)).toBeInTheDocument()
  })

  it('renders glass type and garnish', () => {
    render(<CocktailCard cocktail={mockCocktail} />)
    expect(screen.getByText(/rocks glass/i)).toBeInTheDocument()
    expect(screen.getByText(/orange peel/i)).toBeInTheDocument()
  })

  it('renders the rank badge', () => {
    render(<CocktailCard cocktail={mockCocktail} />)
    expect(screen.getByText('#1')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```
Expected: FAIL — `Cannot find module './CocktailCard'`

- [ ] **Step 3: Create client/src/components/CocktailCard.jsx**

```jsx
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
          {ingredients.map((ing, i) => (
            <li key={i} className="ingredient-item">
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
        <span>Garnish: {garnish}</span>
      </div>
    </article>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: PASS — all 6 CocktailCard tests pass.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/CocktailCard.jsx client/src/components/CocktailCard.test.jsx
git commit -m "feat: add CocktailCard component"
```

---

## Task 9: ResultsView and ErrorView Components

**Files:**
- Create: `client/src/components/ResultsView.jsx`
- Create: `client/src/components/ResultsView.test.jsx`
- Create: `client/src/components/ErrorView.jsx`
- Create: `client/src/components/ErrorView.test.jsx`

- [ ] **Step 1: Write the failing tests**

Create `client/src/components/ResultsView.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ResultsView from './ResultsView'

const mockCocktails = [
  {
    rank: 1, name: 'Quiet Storm', moodMatch: 'Perfect for unwinding.',
    ingredients: [{ item: 'Bourbon', amount: '2 oz' }],
    method: 'Stir.', glass: 'Rocks glass', garnish: 'Peel'
  },
  {
    rank: 2, name: 'Velvet Hour', moodMatch: 'Smooth and easy.',
    ingredients: [{ item: 'Gin', amount: '2 oz' }],
    method: 'Shake.', glass: 'Coupe', garnish: 'Twist'
  }
]

describe('ResultsView', () => {
  it('renders all cocktail cards', () => {
    render(<ResultsView cocktails={mockCocktails} onReset={vi.fn()} />)
    expect(screen.getByText('Quiet Storm')).toBeInTheDocument()
    expect(screen.getByText('Velvet Hour')).toBeInTheDocument()
  })

  it('calls onReset when Try Again is clicked', async () => {
    const onReset = vi.fn()
    render(<ResultsView cocktails={mockCocktails} onReset={onReset} />)
    await userEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(onReset).toHaveBeenCalledTimes(1)
  })
})
```

Create `client/src/components/ErrorView.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorView from './ErrorView'

describe('ErrorView', () => {
  it('renders the error message', () => {
    render(<ErrorView message="Something went wrong — please try again." onRetry={vi.fn()} />)
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('calls onRetry when the retry button is clicked', async () => {
    const onRetry = vi.fn()
    render(<ErrorView message="Error" onRetry={onRetry} />)
    await userEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```
Expected: FAIL — `Cannot find module './ResultsView'` and `'./ErrorView'`

- [ ] **Step 3: Create client/src/components/ResultsView.jsx**

```jsx
import CocktailCard from './CocktailCard'

export default function ResultsView({ cocktails, onReset }) {
  return (
    <div className="results-view">
      <header className="results-view__header">
        <h1>Your Cocktails</h1>
        <button className="btn-secondary" onClick={onReset}>Try Again</button>
      </header>
      <div className="results-view__cards">
        {cocktails.map(cocktail => (
          <CocktailCard key={cocktail.rank} cocktail={cocktail} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create client/src/components/ErrorView.jsx**

```jsx
export default function ErrorView({ message, onRetry }) {
  return (
    <div className="error-view">
      <p className="error-view__message">{message}</p>
      <button className="btn-primary" onClick={onRetry}>Try Again</button>
    </div>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test
```
Expected: PASS — all ResultsView and ErrorView tests pass.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/ResultsView.jsx client/src/components/ResultsView.test.jsx client/src/components/ErrorView.jsx client/src/components/ErrorView.test.jsx
git commit -m "feat: add ResultsView and ErrorView components"
```

---

## Task 10: Styling

**Files:**
- Modify: `client/src/index.css`

- [ ] **Step 1: Replace client/src/index.css with app styles**

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Georgia', serif;
  background: #1a1a2e;
  color: #e8e0d0;
  min-height: 100vh;
}

.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Input View */
.input-view header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.input-view h1 {
  font-size: 2.5rem;
  color: #d4a843;
  letter-spacing: 0.05em;
}

.tagline {
  color: #a89880;
  margin-top: 0.5rem;
  font-style: italic;
}

.field {
  margin-bottom: 1.5rem;
}

.field label,
.field-label {
  display: block;
  font-size: 0.875rem;
  color: #a89880;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

textarea, input[type="text"] {
  width: 100%;
  background: #16213e;
  border: 1px solid #2d3561;
  border-radius: 6px;
  color: #e8e0d0;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
}

textarea:focus, input[type="text"]:focus {
  outline: none;
  border-color: #d4a843;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  background: #16213e;
  border: 1px solid #2d3561;
  border-radius: 20px;
  color: #a89880;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.35rem 0.9rem;
  transition: all 0.15s ease;
}

.chip:hover {
  border-color: #d4a843;
  color: #d4a843;
}

.chip--active {
  background: #d4a843;
  border-color: #d4a843;
  color: #1a1a2e;
}

.btn-primary {
  background: #d4a843;
  border: none;
  border-radius: 6px;
  color: #1a1a2e;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.05em;
  padding: 0.85rem 2rem;
  width: 100%;
  transition: background 0.15s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #e8c060;
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #d4a843;
  border-radius: 6px;
  color: #d4a843;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.5rem 1.25rem;
  transition: all 0.15s ease;
}

.btn-secondary:hover {
  background: #d4a843;
  color: #1a1a2e;
}

/* Loading */
.loading {
  text-align: center;
  padding: 4rem 0;
  color: #a89880;
  font-style: italic;
  font-size: 1.25rem;
}

/* Results View */
.results-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.results-view__header h1 {
  color: #d4a843;
  font-size: 1.75rem;
}

.results-view__cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Cocktail Card */
.cocktail-card {
  background: #16213e;
  border: 1px solid #2d3561;
  border-radius: 10px;
  padding: 1.5rem;
}

.cocktail-card__header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.cocktail-card__rank {
  color: #d4a843;
  font-size: 0.875rem;
  font-weight: bold;
}

.cocktail-card__name {
  font-size: 1.4rem;
  color: #e8e0d0;
}

.cocktail-card__mood-match {
  color: #a89880;
  font-style: italic;
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.cocktail-card__section {
  margin-bottom: 1rem;
}

.cocktail-card__section h3 {
  color: #d4a843;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.ingredient-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.ingredient-item__amount {
  color: #a89880;
}

.cocktail-card__meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.8rem;
  color: #a89880;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #2d3561;
}

/* Error View */
.error-view {
  text-align: center;
  padding: 4rem 0;
}

.error-view__message {
  color: #e07060;
  margin-bottom: 1.5rem;
}
```

- [ ] **Step 2: Remove Vite boilerplate from client/src/App.jsx**

The `App.jsx` already has `import './index.css'` from Task 6. No additional changes needed.

- [ ] **Step 3: Verify the app runs end to end**

Start the server in one terminal:
```bash
cd server && ANTHROPIC_API_KEY=your_key_here npm run dev
```

Start the client in another terminal:
```bash
cd client && npm run dev
```

Open `http://localhost:5173`. Verify:
1. Input view renders with heading and textarea
2. Submit button disabled until 10+ chars typed
3. Spirit chips disappear when non-alcoholic is toggled
4. Submitting shows loading state, then results
5. Each result card shows name, mood match, ingredients, method, glass, garnish
6. "Try Again" returns to the input form

- [ ] **Step 4: Commit**

```bash
git add client/src/index.css
git commit -m "feat: add app styling with dark cocktail bar theme"
```

---

## Task 11: Environment Configuration

**Files:**
- Create: `server/.env.example`

- [ ] **Step 1: Create server/.env.example**

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3001
```

- [ ] **Step 2: Ensure .gitignore covers .env files**

The root `.gitignore` from Task 1 already includes `.env`. Confirm it's present:
```bash
grep '.env' .gitignore
```
Expected output: `.env`

- [ ] **Step 3: Commit**

```bash
git add server/.env.example
git commit -m "chore: add .env.example for server environment setup"
```

---

## Self-Review Checklist Results

**Spec coverage:**
- ✅ Freeform textarea + structured toggles (Task 7 InputView)
- ✅ Alcohol toggle hides spirit chips (Task 7)
- ✅ Spirit preference chips (Task 7)
- ✅ Flavor nudge chips (Task 7)
- ✅ Available ingredients optional field (Task 7)
- ✅ Submit disabled under 10 chars (Task 7)
- ✅ 2–3 ranked cocktail cards (Task 8/9)
- ✅ Cocktail name, mood match, ingredients, method, glass, garnish (Task 8)
- ✅ Claude API integration with `claude-sonnet-4-6` (Task 5)
- ✅ Prompt grounded in classical-cocktails.md (Task 3)
- ✅ Retry once on malformed response (Task 5)
- ✅ Error view with retry button (Task 9)
- ✅ Non-alcoholic mocktail enforcement in prompt (Task 3)
- ✅ Available ingredients constraint in prompt (Task 3)
- ✅ "Try Again" resets to input view (Task 9)
- ✅ No auth, no persistence (stateless architecture throughout)

**Placeholder scan:** No TBD, TODO, or incomplete steps found.

**Type consistency:** All component props (`cocktail`, `onReset`, `onRetry`, `onSubmit`) and payload shape (`{ mood, alcoholic, spirits, flavors, availableIngredients }`) are consistent across all tasks.
