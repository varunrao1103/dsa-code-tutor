export default function OutputPanel({ result, loading }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin shrink-0" />
        <span className="text-xs font-mono" style={{ color: '#10B981' }}>Running…</span>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="px-4 py-3">
        <span className="text-xs font-mono" style={{ color: '#2E2E2E' }}>
          Run your code to see the output here...
        </span>
      </div>
    )
  }

  const { stdout, stderr, exitCode } = result
  const success = exitCode === 0

  return (
    <div className="px-4 py-2 font-mono text-xs">
      {/* exit badge */}
      <span
        style={{
          background: success ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${success ? '#065F46' : '#7F1D1D'}`,
          color: success ? '#10B981' : '#EF4444',
          borderRadius: 4,
          padding: '1px 6px',
          marginBottom: 6,
          display: 'inline-block',
        }}
      >
        exit {exitCode}
      </span>

      {!stdout.trim() && !stderr.trim() && (
        <div style={{ color: '#64748B' }} className="mt-1">(no output)</div>
      )}

      {stdout.trim() && (
        <pre style={{ color: '#10B981', margin: '4px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {stdout}
        </pre>
      )}

      {stderr.trim() && (
        <pre style={{ color: '#EF4444', margin: '4px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {stderr}
        </pre>
      )}
    </div>
  )
}
