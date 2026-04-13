# Mixologist AI — Product Requirements Document

**Date:** 2026-04-12  
**Status:** Approved  
**Scope:** v1 — stateless web app, AI-powered personalized cocktail recommendations

---

## 1. Overview & Goals

### What It Does
A stateless web app where users describe how they're feeling and optionally set ingredient constraints. Claude generates 2–3 personalized cocktail recipes ranked by fit, each with a custom name, full recipe, and a short explanation of why it suits the user's mood.

### Target Users
- Casual drinkers and home bartenders exploring new drinks
- Cocktail enthusiasts seeking precise, personalized recommendations
- Bar and restaurant staff generating ideas for guests

### Success Criteria
- A user can get a personalized cocktail recommendation in under 30 seconds
- Output always includes: cocktail name, ingredient list with measurements, preparation method, and a 1–2 sentence mood match explanation
- Works for both alcoholic and non-alcoholic preferences
- No login, no account — zero onboarding friction

### Non-Goals (v1)
- Saving or favoriting recipes
- User accounts or history
- Social sharing
- Inventory or pantry management

---

## 2. UI Layout

The app has a single page with two visual states: **input view** and **results view**.

### Input View

| Element | Description |
|---|---|
| Header | App name + tagline: "Tell us how you feel, we'll make your drink" |
| Freeform textarea | Large input with placeholder: *"I had a long day, want something relaxing but not too heavy..."* — minimum 10 characters to enable submit |
| Alcohol toggle | Switch between Alcoholic / Non-alcoholic |
| Spirit preference | Multi-select chips: Whiskey, Gin, Rum, Tequila, Vodka, Any. Hidden when non-alcoholic is selected. |
| Flavor nudge | Optional multi-select chips: Sweet, Sour, Bitter, Spicy, Smoky, Light |
| Available ingredients | Optional freeform text field (comma-separated): "Ingredients I have at home" |
| Submit button | "Craft My Cocktail" — disabled until textarea has ≥10 characters |

### Results View

Replaces the input view on submit. Contains:

- 2–3 cocktail cards, ranked #1–#3
- Each card includes:
  - AI-generated cocktail name (can be whimsical/custom)
  - "Why this suits you" — 1–2 sentence mood match explanation
  - Ingredient list with measurements
  - Step-by-step preparation method
  - Glass type and garnish
- "Try Again" button returns the user to the input view

---

## 3. Architecture

### Stack

| Layer | Technology |
|---|---|
| Frontend | React (single-page, no router) |
| Backend | Node.js / Express — single endpoint |
| AI | Claude API (`claude-sonnet-4-6`) |

### API Contract

**Endpoint:** `POST /api/recommend`

**Request payload:**
```json
{
  "mood": "string (required)",
  "alcoholic": "boolean (required)",
  "spirits": ["string"] ,
  "flavors": ["string"],
  "availableIngredients": "string (optional, comma-separated)"
}
```

**Response payload:**
```json
{
  "cocktails": [
    {
      "rank": 1,
      "name": "string",
      "moodMatch": "string (1-2 sentences)",
      "ingredients": [{ "item": "string", "amount": "string" }],
      "method": "string",
      "glass": "string",
      "garnish": "string"
    }
  ]
}
```

### Data Flow

1. User fills out the form and submits
2. Frontend sends JSON payload to `POST /api/recommend`
3. Backend constructs a prompt using the payload + `classical-cocktails.md` as grounding context
4. Single Claude API call — no streaming — returns structured JSON
5. Backend validates the response shape, returns it to the frontend
6. Frontend renders the cocktail cards

### Prompt Strategy

- System prompt instructs Claude to act as a professional mixologist
- `classical-cocktails.md` content is injected as reference/inspiration (not a hard constraint — Claude can create novel cocktails)
- User constraints (spirits, flavors, available ingredients) are injected as hard rules
- Claude is instructed to always return valid JSON matching the defined schema
- Response must contain exactly 2–3 cocktail objects

---

## 4. Error Handling & Edge Cases

| Scenario | Behavior |
|---|---|
| Claude API failure or timeout | Show friendly error on results view: "Something went wrong — please try again." with a retry button. No technical details exposed. |
| Malformed AI output | Backend validates JSON schema. On failure, retry once automatically. If retry fails, return error to frontend. |
| Empty / nonsense input | Frontend requires ≥10 characters in textarea before enabling submit. AI handles ambiguous prompts gracefully. |
| Non-alcoholic request | System prompt explicitly instructs Claude to produce mocktails only. Spirit chips hidden in the UI. |
| Overly limited available ingredients | Claude explains why the constraint is too limiting and offers the closest possible suggestion. |

---

## 5. Out of Scope (Future Considerations)

- User accounts and session history
- Favoriting and saving recipes
- Social sharing (export card as image)
- Ingredient quantity scaling (e.g., make for 4 people)
- Pairing suggestions (food, music, occasion)
- Multi-language support
