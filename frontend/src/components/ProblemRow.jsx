import { Link } from 'react-router-dom'

const DIFFICULTY_COLORS = {
  Easy: '#22C55E',
  Medium: '#F59E0B',
  Hard: '#EF4444',
}

export default function ProblemRow({ problem, index }) {
  const { questionId, title, titleSlug, difficulty } = problem
  const color = DIFFICULTY_COLORS[difficulty] ?? '#94a3b8'

  return (
    <div
      style={{
        borderBottom: '1px solid #2E2E2E',
        background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
      }}
      className="flex items-center px-5 py-3 gap-4 hover:bg-white/5 transition-colors group"
    >
      {/* Number */}
      <span className="text-sm font-mono shrink-0" style={{ color: '#64748B', width: 48 }}>
        {questionId}.
      </span>

      {/* Title */}
      <Link
        to={`/problem/${titleSlug}`}
        className="flex-1 text-sm font-medium transition-colors truncate"
        style={{ color: '#F8FAFC' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#8B5CF6')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#F8FAFC')}
      >
        {title}
      </Link>

      {/* Difficulty */}
      <span
        className="text-xs font-semibold shrink-0"
        style={{ color, minWidth: 64, textAlign: 'right' }}
      >
        {difficulty}
      </span>
    </div>
  )
}
