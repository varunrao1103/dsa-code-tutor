const DIFFICULTY_COLORS = {
  Easy: '#22C55E',
  Medium: '#F59E0B',
  Hard: '#EF4444',
}

export default function ProblemDisplay({ title, difficulty, content, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full gap-2">
        <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
        <span className="text-sm text-slate-400">Loading problem…</span>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
        <span className="text-2xl">📋</span>
        <p className="text-sm text-slate-500">Problem content will appear here.</p>
      </div>
    )
  }

  const color = DIFFICULTY_COLORS[difficulty] ?? '#94a3b8'

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Problem title + difficulty */}
      <div className="px-4 pt-3 pb-2 shrink-0 flex flex-col gap-1.5">
        <h2 className="text-base font-bold text-white leading-snug">{title}</h2>
        <span
          className="text-xs font-semibold self-start px-2 py-0.5 rounded"
          style={{
            color,
            background: `${color}18`,
            border: `1px solid ${color}40`,
          }}
        >
          {difficulty}
        </span>
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '1px solid #2E2E2E' }} className="mx-4 shrink-0" />

      {/* Problem HTML content */}
      <div
        className="problem-content flex-1 overflow-y-auto px-4 py-3 text-sm leading-relaxed"
        style={{ color: '#94A3B8' }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}
