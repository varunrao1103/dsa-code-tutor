/**
 * Renders FeedbackSchema response:
 *   { appreciation, time_complexity, hints[] }
 */
export default function HintsPanel({ data }) {
  if (!data) return null

  const isOptimal = data.appreciation && data.hints.length === 0

  return (
    <div className="flex flex-col gap-3">

      {isOptimal ? (
        /* ── Correct & optimal ── */
        <div
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #065F46', borderRadius: 12 }}
          className="p-4 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <p className="text-sm font-semibold" style={{ color: '#10B981' }}>{data.appreciation}</p>
          </div>
          {data.time_complexity && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs" style={{ color: '#64748B' }}>Time complexity:</span>
              <code
                style={{ background: '#222222', color: '#8B5CF6', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}
              >
                {data.time_complexity}
              </code>
            </div>
          )}
        </div>
      ) : (
        /* ── Hints ── */
        <>
          {data.appreciation && (
            <div
              style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid #78350F', borderRadius: 12 }}
              className="p-3 text-xs leading-relaxed"
            >
              <span style={{ color: '#FB923C' }}>{data.appreciation}</span>
            </div>
          )}
          <ol className="flex flex-col gap-2.5">
            {data.hints.map((hint, i) => (
              <li
                key={i}
                style={{ background: '#1C1C1C', border: '1px solid #2E2E2E', borderRadius: 12 }}
                className="p-3.5 flex gap-3 items-start"
              >
                <span
                  style={{
                    background: '#222222',
                    border: '1px solid #7C3AED',
                    color: '#8B5CF6',
                    borderRadius: 6,
                    minWidth: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{hint}</p>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}
