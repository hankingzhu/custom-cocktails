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
