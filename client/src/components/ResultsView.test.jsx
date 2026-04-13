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
