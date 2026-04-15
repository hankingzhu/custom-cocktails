import { useState, useRef, useEffect } from 'react'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
]

export default function LangDropdown({ lang, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const current = LANGUAGES.find(l => l.value === lang)

  return (
    <div ref={ref} className={`lang-dropdown${open ? ' lang-dropdown--open' : ''}`}>
      <button
        className="lang-dropdown__trigger"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.label}
        <svg
          className="lang-dropdown__chevron"
          width="8" height="5" viewBox="0 0 8 5"
          fill="none" aria-hidden="true"
        >
          <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="lang-dropdown__menu" role="listbox">
        {LANGUAGES.map(l => (
          <button
            key={l.value}
            className={`lang-dropdown__option${lang === l.value ? ' lang-dropdown__option--active' : ''}`}
            role="option"
            aria-selected={lang === l.value}
            onClick={() => { onChange(l.value); setOpen(false) }}
          >
            {l.label}
            {lang === l.value && (
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden="true">
                <path d="M1 3L3 5L7 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
