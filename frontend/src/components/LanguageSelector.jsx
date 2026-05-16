import { LANGUAGES } from '../languages'

export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map((lang) => {
        const active = lang.id === value.id
        return (
          <button
            key={lang.id}
            onClick={() => onChange(lang)}
            style={{
              background: active ? '#1C1C1C' : 'transparent',
              border: active ? '1px solid #2E2E2E' : '1px solid transparent',
              borderRadius: 6,
              color: active ? '#F8FAFC' : '#64748B',
            }}
            className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium
                       hover:text-slate-200 transition-all"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: active ? 1 : 0.5 }}
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            {lang.label}
            {active && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="3">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
