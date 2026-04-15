import { useState } from 'react'
import Logo from './Logo'
import GlassIcon from './GlassIcon'

const SPIRITS = ['Whiskey', 'Gin', 'Rum', 'Tequila', 'Vodka']
const FLAVORS = ['Sweet', 'Sour', 'Bitter', 'Spicy', 'Smoky', 'Light']
const GLASSES = ['Rocks', 'Coupe', 'Highball', 'Nick & Nora', 'Collins', 'Martini']

export default function InputView({ onSubmit }) {
  const [mood, setMood] = useState('')
  const [alcoholic, setAlcoholic] = useState(true)
  const [spirits, setSpirits] = useState([])
  const [flavors, setFlavors] = useState([])
  const [glassTypes, setGlassTypes] = useState([])
  const [availableIngredients, setAvailableIngredients] = useState('')

  function toggleChip(list, setList, value) {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ mood, alcoholic, spirits, flavors, glassTypes, availableIngredients })
  }

  return (
    <div className="input-view">
      <header>
        <Logo size={68} />
        <h1>The Confidant</h1>
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
          <p className="field-label">Glass preference</p>
          <div className="glass-chips">
            {GLASSES.map(glass => (
              <button
                key={glass}
                type="button"
                className={`glass-chip ${glassTypes.includes(glass) ? 'glass-chip--active' : ''}`}
                onClick={() => toggleChip(glassTypes, setGlassTypes, glass)}
                aria-pressed={glassTypes.includes(glass)}
                aria-label={glass}
              >
                <GlassIcon type={glass} size={24} />
                <span className="glass-chip__label">{glass}</span>
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
          <span>Craft My Cocktail</span>
        </button>
      </form>
    </div>
  )
}
