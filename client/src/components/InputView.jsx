import { useState } from 'react'
import Logo from './Logo'
import GlassIcon from './GlassIcon'
import { t } from '../i18n'

const SPIRITS = ['Whiskey', 'Gin', 'Rum', 'Tequila', 'Vodka']
const FLAVORS = ['Sweet', 'Sour', 'Bitter', 'Spicy', 'Smoky', 'Light']
const GLASSES = ['Rocks', 'Highball', 'Coupe', 'Martini']

export default function InputView({ onSubmit, lang = 'en' }) {
  const tx = t[lang]
  const [mood, setMood] = useState('')
  const [alcoholic, setAlcoholic] = useState(true)
  const [spirits, setSpirits] = useState([])
  const [flavors, setFlavors] = useState([])
  const [glassType, setGlassType] = useState('')
  const [availableIngredients, setAvailableIngredients] = useState('')

  function toggleChip(list, setList, value) {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ mood, alcoholic, spirits, flavors, glassType, availableIngredients })
  }

  return (
    <div className="input-view">
      <header>
        <Logo size={68} />
        <h1>The Confidant</h1>
        <p className="tagline">{tx.tagline}</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="mood">{tx.moodLabel}</label>
          <textarea
            id="mood"
            value={mood}
            onChange={e => setMood(e.target.value)}
            placeholder={tx.moodPlaceholder}
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
            {' '}{tx.nonAlcoholic}
          </label>
        </div>

        {alcoholic && (
          <div className="field">
            <p className="field-label">{tx.spiritLabel}</p>
            <div className="chips">
              {SPIRITS.map(spirit => (
                <button
                  key={spirit}
                  type="button"
                  className={`chip ${spirits.includes(spirit) ? 'chip--active' : ''}`}
                  onClick={() => toggleChip(spirits, setSpirits, spirit)}
                >
                  {tx.spirits[spirit]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="field">
          <p className="field-label">{tx.flavorLabel}</p>
          <div className="chips">
            {FLAVORS.map(flavor => (
              <button
                key={flavor}
                type="button"
                className={`chip ${flavors.includes(flavor) ? 'chip--active' : ''}`}
                onClick={() => toggleChip(flavors, setFlavors, flavor)}
              >
                {tx.flavors[flavor]}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <p className="field-label">{tx.glassLabel}</p>
          <div className="glass-chips">
            {GLASSES.map(glass => (
              <button
                key={glass}
                type="button"
                className={`glass-chip ${glassType === glass ? 'glass-chip--active' : ''}`}
                onClick={() => setGlassType(prev => prev === glass ? '' : glass)}
                aria-pressed={glassType === glass}
                aria-label={tx.glasses[glass]}
              >
                <GlassIcon type={glass} size={24} />
                <span className="glass-chip__label">{tx.glasses[glass]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="ingredients">{tx.ingredientsLabel}</label>
          <input
            id="ingredients"
            type="text"
            value={availableIngredients}
            onChange={e => setAvailableIngredients(e.target.value)}
            placeholder={tx.ingredientsPlaceholder}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={mood.trim().length < 10}
        >
          <span>{tx.submit}</span>
        </button>
      </form>
    </div>
  )
}
