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
  const [lang, setLang] = useState('en')

  function toggleLang() {
    setLang(l => l === 'en' ? 'zh' : 'en')
  }

  async function handleSubmit(payload) {
    setView('loading')
    try {
      const data = await getRecommendations({ ...payload, language: lang })
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

  return (
    <>
      <button className="lang-toggle" onClick={toggleLang} aria-label="Toggle language">
        {lang === 'en' ? '中文' : 'EN'}
      </button>

      <main className="app">
        {view === 'loading' && (
          <div className="loading">
            <p>{lang === 'en' ? 'Crafting your cocktails...' : '正在为您调制鸡尾酒…'}</p>
          </div>
        )}
        {view === 'results' && (
          <ResultsView cocktails={cocktails} onReset={handleReset} lang={lang} />
        )}
        {view === 'error' && (
          <ErrorView message={errorMessage} onRetry={handleReset} lang={lang} />
        )}
        {view === 'input' && (
          <InputView onSubmit={handleSubmit} lang={lang} />
        )}
      </main>
    </>
  )
}
