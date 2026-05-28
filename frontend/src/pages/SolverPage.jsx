import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
<<<<<<< HEAD
import { getHints, getSolution, runCode, getLeetCodeProblem } from '../api'
import { DEFAULT_LANGUAGE } from '../languages'
import ProblemDisplay from '../components/ProblemDisplay'
import CodeEditor from '../components/CodeEditor'
import HintsPanel from '../components/HintsPanel'
import SolutionPanel from '../components/SolutionPanel'
=======
import { runCode, getLeetCodeProblem } from '../api'
import { DEFAULT_LANGUAGE } from '../languages'
import ProblemDisplay from '../components/ProblemDisplay'
import CodeEditor from '../components/CodeEditor'
import ChatPanel from '../components/ChatPanel'
>>>>>>> 2d4e634 (shifting ai tech from langGraph to langchain and adding chat UI)
import LanguageSelector from '../components/LanguageSelector'
import OutputPanel from '../components/OutputPanel'


<<<<<<< HEAD
function Spinner() {
  return (
    <div className="flex items-center gap-2 py-6 px-4">
      <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
      <span className="text-sm text-slate-400">Thinking…</span>
    </div>
  )
}

/** Strip HTML tags and return plain text for AI API calls */
function htmlToText(html) {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent ?? ''
  } catch {
    return html.replace(/<[^>]+>/g, ' ')
  }
}

=======
>>>>>>> 2d4e634 (shifting ai tech from langGraph to langchain and adding chat UI)
export default function SolverPage() {
  const { titleSlug } = useParams()

  // Problem loaded from LeetCode
  const [problemTitle, setProblemTitle] = useState('')
  const [problemDifficulty, setProblemDifficulty] = useState('')
  const [problemContent, setProblemContent] = useState('')  // HTML
  const [problemLoading, setProblemLoading] = useState(true)
  const [problemError, setProblemError] = useState(null)

  // Editor state
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE)
  const [code, setCode] = useState(DEFAULT_LANGUAGE.defaultCode)

<<<<<<< HEAD
  // AI state
  const [hintsData, setHintsData] = useState(null)
  const [solutionData, setSolutionData] = useState(null)
  const [runResult, setRunResult] = useState(null)
  const [loadingHints, setLoadingHints] = useState(false)
  const [loadingSolution, setLoadingSolution] = useState(false)
  const [loadingRun, setLoadingRun] = useState(false)
  const [hintsError, setHintsError] = useState(null)
  const [solutionError, setSolutionError] = useState(null)
  const [activeTab, setActiveTab] = useState('hints')
=======
  // Run state
  const [runResult, setRunResult] = useState(null)
  const [loadingRun, setLoadingRun] = useState(false)

  // Chat panel
  const [isChatOpen, setIsChatOpen] = useState(false)
>>>>>>> 2d4e634 (shifting ai tech from langGraph to langchain and adding chat UI)

  // Load problem from LeetCode on mount
  useEffect(() => {
    if (!titleSlug) return
    setProblemLoading(true)
    setProblemError(null)
    getLeetCodeProblem(titleSlug)
      .then((data) => {
        setProblemTitle(data.title ?? '')
        setProblemDifficulty(data.difficulty ?? '')
        setProblemContent(data.content ?? '')
      })
      .catch((e) => setProblemError(e.message))
      .finally(() => setProblemLoading(false))
  }, [titleSlug])

<<<<<<< HEAD
  // Auto-switch tabs when data arrives
  useEffect(() => { if (hintsData) setActiveTab('hints') }, [hintsData])
  useEffect(() => { if (solutionData) setActiveTab('solution') }, [solutionData])

=======
>>>>>>> 2d4e634 (shifting ai tech from langGraph to langchain and adding chat UI)
  function handleLanguageChange(lang) {
    setLanguage(lang)
    setCode(lang.defaultCode)
    setRunResult(null)
  }

  function handleResetCode() {
    setCode(language.defaultCode)
    setRunResult(null)
  }

  async function handleRun() {
    setRunResult(null)
    setLoadingRun(true)
    try {
      const result = await runCode(language.id, code)
      setRunResult(result)
    } catch (e) {
      setRunResult({ stdout: '', stderr: e.message, exitCode: 1 })
    } finally {
      setLoadingRun(false)
    }
  }

<<<<<<< HEAD
  async function handleGetHints() {
    setHintsError(null)
    setHintsData(null)
    setLoadingHints(true)
    setActiveTab('hints')
    try {
      const questionText = htmlToText(problemContent)
      const result = await getHints(questionText, code)
      setHintsData(result)
    } catch (e) {
      setHintsError(e.message)
    } finally {
      setLoadingHints(false)
    }
  }

  async function handleGetSolution() {
    setSolutionError(null)
    setSolutionData(null)
    setLoadingSolution(true)
    setActiveTab('solution')
    try {
      const questionText = htmlToText(problemContent)
      const result = await getSolution(questionText)
      setSolutionData(result)
    } catch (e) {
      setSolutionError(e.message)
    } finally {
      setLoadingSolution(false)
    }
  }

  const canAI = !problemLoading && !!problemContent && !problemError

=======
>>>>>>> 2d4e634 (shifting ai tech from langGraph to langchain and adding chat UI)
  // ── Resizable columns ──
  const [leftWidth, setLeftWidth] = useState(340)
  const [rightWidth, setRightWidth] = useState(380)
  const dragRef = useRef(null) // { side: 'left'|'right', startX, startWidth }

  const handleDragStart = useCallback((side, e) => {
    e.preventDefault()
    dragRef.current = {
      side,
      startX: e.clientX,
      startWidth: side === 'left' ? leftWidth : rightWidth,
    }

    function onMouseMove(ev) {
      const { side, startX, startWidth } = dragRef.current
      const delta = ev.clientX - startX
      if (side === 'left') {
        setLeftWidth(Math.max(220, startWidth + delta))
      } else {
        setRightWidth(Math.max(260, startWidth - delta))
      }
    }

    function onMouseUp() {
      dragRef.current = null
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [leftWidth, rightWidth])

  return (
    <div style={{ background: '#0D0D0D' }} className="flex flex-col h-full overflow-hidden text-slate-100">

      {/* ── Header ── */}
      <header
        style={{ background: '#141414', borderBottom: '1px solid #2E2E2E' }}
        className="flex items-center justify-between px-5 h-11 shrink-0 z-10"
      >
        <div className="flex items-center gap-3">
          {/* Back link */}
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Problems
          </Link>

          <span style={{ color: '#2E2E2E' }} className="text-xs">|</span>

          {problemTitle && (
            <span className="text-sm text-slate-300 font-medium truncate max-w-xs">{problemTitle}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <kbd
            style={{ background: '#1C1C1C', border: '1px solid #2E2E2E', borderRadius: 4 }}
            className="text-xs text-slate-400 px-1.5 py-0.5 font-mono"
          >
            ⌘↵
          </kbd>
          <span className="text-xs text-slate-500 ml-1">Run</span>
        </div>
      </header>

      {/* ── 3-column body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Problem panel ── */}
        <aside
          style={{
            width: leftWidth,
            minWidth: 220,
            background: '#1C1C1C',
            borderRight: 'none',
          }}
          className="flex flex-col overflow-hidden shrink-0"
        >
          {/* panel header */}
          <div
            style={{ borderBottom: '1px solid #2E2E2E' }}
            className="px-4 py-2.5 shrink-0"
          >
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Problem Statement
            </span>
          </div>

          {problemError ? (
            <div
              style={{ background: '#450a0a', border: '1px solid #7F1D1D', borderRadius: 8, margin: 16 }}
              className="p-3 text-sm text-red-300"
            >
              {problemError}
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <ProblemDisplay
                title={problemTitle}
                difficulty={problemDifficulty}
                content={problemContent}
                loading={problemLoading}
              />
            </div>
          )}
        </aside>

        {/* ── LEFT drag handle ── */}
        <div
          onMouseDown={(e) => handleDragStart('left', e)}
          style={{
            width: 5,
            cursor: 'col-resize',
            background: '#2E2E2E',
            flexShrink: 0,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#7c3aed' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#2E2E2E' }}
        />

        {/* ── MIDDLE: Editor + Output ── */}
        <main className="flex flex-col flex-1 overflow-hidden min-w-0">

          {/* editor toolbar */}
          <div
            style={{ background: '#141414', borderBottom: '1px solid #2E2E2E' }}
            className="flex items-center justify-between px-4 py-2 shrink-0 gap-3"
          >
            <LanguageSelector value={language} onChange={handleLanguageChange} />
            <button
              onClick={handleResetCode}
              style={{ color: '#94a3b8' }}
              className="flex items-center gap-1.5 text-xs hover:text-slate-200 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              Reset Code
            </button>
          </div>

          {/* Monaco editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor value={code} onChange={setCode} language={language.monaco} />
          </div>

          {/* action buttons */}
          <div
            style={{ background: '#141414', borderTop: '1px solid #2E2E2E', borderBottom: '1px solid #2E2E2E' }}
            className="flex items-center gap-2 px-4 py-2.5 shrink-0"
          >
            <button
              onClick={handleRun}
              disabled={!code.trim() || loadingRun}
              style={{ background: '#2cbb5d' }}
              className="flex items-center gap-1.5 px-5 py-1.5 rounded text-sm font-semibold text-white
                         hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              {loadingRun ? 'Running…' : 'Run'}
            </button>
            <button
<<<<<<< HEAD
              onClick={handleGetHints}
              disabled={!canAI || !code.trim() || loadingHints}
              style={{ background: '#92400e', border: '1px solid #d97706' }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-semibold text-amber-300
                         hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              💡 {loadingHints ? 'Analysing…' : 'Get Hints'}
            </button>
            <button
              onClick={handleGetSolution}
              disabled={!canAI || loadingSolution}
              style={{ background: '#4c1d95', border: '1px solid #7c3aed' }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-semibold text-violet-300
                         hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ✦ {loadingSolution ? 'Fetching…' : 'Get Solution'}
            </button>


          </div>
=======
              onClick={() => setIsChatOpen((v) => !v)}
              style={{
                background: isChatOpen ? '#3b1f72' : '#1e1030',
                border: `1px solid ${isChatOpen ? '#7c3aed' : '#4c2d7a'}`,
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-semibold text-violet-300
                         hover:brightness-110 transition-all"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Code with AI
            </button></div>
>>>>>>> 2d4e634 (shifting ai tech from langGraph to langchain and adding chat UI)

          {/* Output panel */}
          <div style={{ height: 180, background: '#141414', borderTop: '1px solid #2E2E2E' }} className="shrink-0 overflow-hidden flex flex-col">
            <div
              style={{ borderBottom: '1px solid #2E2E2E' }}
              className="flex items-center justify-between px-4 py-1.5 shrink-0"
            >
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Output</span>
              {runResult && (
                <button
                  onClick={() => setRunResult(null)}
                  className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                  Clear
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              <OutputPanel result={runResult} loading={loadingRun} />
            </div>
          </div>
        </main>

<<<<<<< HEAD
        {/* ── RIGHT drag handle ── */}
        <div
          onMouseDown={(e) => handleDragStart('right', e)}
          style={{
            width: 5,
            cursor: 'col-resize',
            background: '#2E2E2E',
            flexShrink: 0,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#7c3aed' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#2E2E2E' }}
        />

        {/* ── RIGHT: Hints / Solution panel ── */}
        <aside
          style={{
            width: rightWidth,
            minWidth: 260,
            background: '#1C1C1C',
            borderLeft: 'none',
          }}
          className="flex flex-col overflow-hidden shrink-0"
        >
          {/* tab bar */}
          <div
            style={{ background: '#141414', borderBottom: '1px solid #2E2E2E' }}
            className="flex shrink-0"
          >
            {['hints', 'solution'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-5 py-2.5 text-sm font-medium capitalize transition-colors"
                style={{ color: activeTab === tab ? '#F8FAFC' : '#64748B' }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: '#7c3aed' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* tab content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'hints' && (
              <>
                {loadingHints && <Spinner />}
                {hintsError && (
                  <div style={{ background: '#450a0a', border: '1px solid #7F1D1D', borderRadius: 8 }} className="p-3 text-sm text-red-300">
                    {hintsError}
                  </div>
                )}
                {hintsData && <HintsPanel data={hintsData} />}
                {!loadingHints && !hintsData && !hintsError && (
                  <div className="flex flex-col items-center justify-center h-40 text-center gap-2">
                    <span className="text-2xl">💡</span>
                    <p className="text-sm text-slate-500">Write your code and click <span className="text-amber-400 font-medium">Get Hints</span></p>
                  </div>
                )}
              </>
            )}
            {activeTab === 'solution' && (
              <>
                {loadingSolution && <Spinner />}
                {solutionError && (
                  <div style={{ background: '#450a0a', border: '1px solid #7F1D1D', borderRadius: 8 }} className="p-3 text-sm text-red-300">
                    {solutionError}
                  </div>
                )}
                {solutionData && <SolutionPanel data={solutionData} />}
                {!loadingSolution && !solutionData && !solutionError && (
                  <div className="flex flex-col items-center justify-center h-40 text-center gap-2">
                    <span className="text-2xl">✦</span>
                    <p className="text-sm text-slate-500">Click <span className="text-violet-400 font-medium">Get Solution</span> to see the optimal approach</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Stuck? card */}
          {activeTab === 'hints' && !solutionData && (
            <div className="shrink-0 p-3">
              <div
                style={{
                  background: 'linear-gradient(135deg, #2d1b69 0%, #1a0f3e 100%)',
                  border: '1px solid #4c1d95',
                  borderRadius: 12,
                }}
                className="p-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎓</span>
                  <span className="font-semibold text-white text-sm">Stuck?</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Get the complete solution with explanation.
                </p>
                <button
                  onClick={handleGetSolution}
                  disabled={!canAI || loadingSolution}
                  style={{ background: '#7c3aed' }}
                  className="w-full py-2 rounded-lg text-sm font-semibold text-white
                             hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Get Solution
                </button>
              </div>
            </div>
          )}
        </aside>
=======
        {/* ── RIGHT: Chat panel (conditionally rendered) ── */}
        {isChatOpen && (
          <>
            <div
              onMouseDown={(e) => handleDragStart('right', e)}
              style={{
                width: 5,
                cursor: 'col-resize',
                background: '#2E2E2E',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#7c3aed' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#2E2E2E' }}
            />
            <aside
              style={{
                width: rightWidth,
                minWidth: 300,
                background: '#1C1C1C',
              }}
              className="flex flex-col overflow-hidden shrink-0"
            >
              <ChatPanel
                problemContent={problemContent}
                code={code}
                onClose={() => setIsChatOpen(false)}
              />
            </aside>
          </>
        )}
>>>>>>> 2d4e634 (shifting ai tech from langGraph to langchain and adding chat UI)
      </div>
    </div>
  )
}
