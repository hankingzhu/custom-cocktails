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
    expect(screen.getByText('Glass: Rocks glass')).toBeInTheDocument()
    expect(screen.getByText('Garnish: Orange peel')).toBeInTheDocument()
  })

  it('renders the rank badge', () => {
    render(<CocktailCard cocktail={mockCocktail} />)
    expect(screen.getByText('#1')).toBeInTheDocument()
  })
})
