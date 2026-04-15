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

  it('renders glass type and garnish values', () => {
    render(<CocktailCard cocktail={mockCocktail} />)
    expect(screen.getByText('Rocks glass')).toBeInTheDocument()
    expect(screen.getByText('Orange peel')).toBeInTheDocument()
  })

  it('renders glass and garnish data-labels', () => {
    render(<CocktailCard cocktail={mockCocktail} />)
    const meta = document.querySelector('.cocktail-card__meta')
    const spans = meta.querySelectorAll('span')
    expect(spans[0].getAttribute('data-label')).toBe('Glass')
    expect(spans[1].getAttribute('data-label')).toBe('Garnish')
  })

  it('renders the rank badge', () => {
    render(<CocktailCard cocktail={mockCocktail} />)
    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('renders "None" when garnish is null', () => {
    const noGarnish = { ...mockCocktail, garnish: null }
    render(<CocktailCard cocktail={noGarnish} />)
    expect(screen.getByText('None')).toBeInTheDocument()
  })
})
