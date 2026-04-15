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

  it('renders glass type chips', () => {
    render(<InputView onSubmit={vi.fn()} />)
    expect(screen.getByText('Coupe')).toBeInTheDocument()
    expect(screen.getByText('Rocks')).toBeInTheDocument()
    expect(screen.getByText('Nick & Nora')).toBeInTheDocument()
  })

  it('includes selected glass types in onSubmit payload', async () => {
    const onSubmit = vi.fn()
    render(<InputView onSubmit={onSubmit} />)
    const textarea = screen.getByRole('textbox', { name: /how are you feeling/i })
    await userEvent.type(textarea, 'I had a long day and need to relax')
    await userEvent.click(screen.getByText('Coupe'))
    await userEvent.click(screen.getByRole('button', { name: /craft my cocktail/i }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ glassTypes: ['Coupe'] })
    )
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
