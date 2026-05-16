import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getLeetCodeProblems } from '../api'
import { TOPICS } from '../topics'
import ProblemRow from '../components/ProblemRow'

const DIFFICULTY_COUNTS = { Easy: 0, Medium: 0, Hard: 0 }

function countDifficulties(problems) {
  const counts = { ...DIFFICULTY_COUNTS }
  for (const p of problems) counts[p.difficulty] = (counts[p.difficulty] ?? 0) + 1
  return counts
}

export default function ProblemsPage() {
  const [activeTopic, setActiveTopic] = useState(TOPICS[0].slug)
  const [problems, setProblems] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [skip, setSkip] = useState(0)
  const [search, setSearch] = useState('')
  const LIMIT = 50

  const fetchProblems = useCallback(async (tag, currentSkip, append = false) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getLeetCodeProblems(tag, currentSkip, LIMIT)
      setTotalNum(data.totalNum ?? 0)
      setProblems((prev) => append ? [...prev, ...(data.data ?? [])] : (data.data ?? []))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setSkip(0)
    setSearch('')
    fetchProblems(activeTopic, 0, false)
  }, [activeTopic, fetchProblems])

  function handleLoadMore() {
    const next = skip + LIMIT
    setSkip(next)
    fetchProblems(activeTopic, next, true)
  }

  const filtered = search.trim()
    ? problems.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : problems

  const counts = countDifficulties(filtered)

  return (
    <div style={{ background: '#0D0D0D', height: '100%', overflowY: 'auto' }} className="flex flex-col text-slate-100">

      {/* ── Hero ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A0A35 0%, #141414 60%, #0D0D0D 100%)',
          borderBottom: '1px solid #2E2E2E',
        }}
        className="px-6 py-10 text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Practice Problems</h1>
        <p className="text-slate-400 text-sm mb-6">
          Browse LeetCode problems by topic, pick one, and solve it with AI-powered hints.
        </p>
        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems…"
            style={{
              background: '#1C1C1C',
              border: '1px solid #2E2E2E',
              borderRadius: 8,
              color: '#F8FAFC',
            }}
            className="w-full pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 placeholder-slate-500 transition-shadow"
          />
        </div>
      </div>

      {/* ── Main layout: sidebar + content ── */}
      <div className="flex flex-1 max-w-6xl mx-auto w-full gap-0 px-0 py-0">

        {/* ── LEFT: Topics Sidebar ── */}
        <aside
          style={{
            width: 220,
            minWidth: 180,
            background: '#141414',
            borderRight: '1px solid #2E2E2E',
            maxHeight: 'calc(100vh - 48px)',
            overflowY: 'auto',
          }}
          className="flex flex-col shrink-0 sticky top-0 self-start"
        >
          <div
            style={{ borderBottom: '1px solid #2E2E2E' }}
            className="px-4 py-3"
          >
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Topics</span>
          </div>
          <nav className="flex flex-col py-2">
            {TOPICS.map((topic) => {
              const active = topic.slug === activeTopic
              return (
                <button
                  key={topic.slug}
                  onClick={() => setActiveTopic(topic.slug)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors"
                  style={{
                    color: active ? '#8B5CF6' : '#94a3b8',
                    background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
                    borderLeft: active ? '3px solid #7c3aed' : '3px solid transparent',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {topic.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* ── RIGHT: Problem Table ── */}
        <main className="flex-1 min-w-0 flex flex-col">

          {/* Table header */}
          <div
            style={{ background: '#1C1C1C', borderBottom: '1px solid #2E2E2E' }}
            className="flex items-center px-5 py-3 gap-4 shrink-0 sticky top-0 z-10"
          >
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest" style={{ width: 48 }}>#</span>
            <span className="flex-1 text-xs font-semibold text-slate-500 uppercase tracking-widest">Title</span>
            <div className="flex items-center gap-4 shrink-0">
              {['Easy', 'Medium', 'Hard'].map((d) => (
                <span
                  key={d}
                  className="text-xs font-semibold"
                  style={{
                    color: d === 'Easy' ? '#22C55E' : d === 'Medium' ? '#F59E0B' : '#EF4444',
                  }}
                >
                  {counts[d]} {d}
                </span>
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest shrink-0" style={{ width: 64, textAlign: 'right' }}>
              Difficulty
            </span>
          </div>

          {/* Problem rows */}
          <div className="flex-1">
            {error && (
              <div
                style={{ background: '#450a0a', border: '1px solid #7F1D1D', borderRadius: 8, margin: 16 }}
                className="p-4 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            {!error && filtered.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
                <span className="text-3xl">🔍</span>
                <p className="text-sm">No problems found{search ? ` for "${search}"` : ''}.</p>
              </div>
            )}

            {filtered.map((problem, i) => (
              <ProblemRow key={problem.titleSlug} problem={problem} index={i} />
            ))}

            {loading && (
              <div className="flex items-center justify-center py-10 gap-2">
                <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-slate-400">Loading…</span>
              </div>
            )}

            {/* Load More */}
            {!loading && !search && problems.length < totalNum && (
              <div className="flex justify-center py-6">
                <button
                  onClick={handleLoadMore}
                  style={{
                    background: '#1C1C1C',
                    border: '1px solid #2E2E2E',
                    borderRadius: 8,
                    color: '#8B5CF6',
                  }}
                  className="px-6 py-2 text-sm font-medium hover:brightness-110 transition-all"
                >
                  Load More ({problems.length} / {totalNum})
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
