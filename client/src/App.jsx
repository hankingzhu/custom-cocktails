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
