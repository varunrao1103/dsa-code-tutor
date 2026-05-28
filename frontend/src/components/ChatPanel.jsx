import { useState, useEffect, useRef } from 'react'
import { askDSA } from '../api'

/** Strip HTML tags so plain text is sent to the API */
function htmlToText(html) {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent ?? ''
  } catch {
    return html.replace(/<[^>]+>/g, ' ')
  }
}

/**
 * Convert the local messages array into the llm_history format the backend
 * expects so the LLM receives real conversational context on every turn.
 */
function buildLLMHistory(messages) {
  return messages.map((msg) => {
    if (msg.role === 'user') {
      return {
        role: 'user',
        content: `Prompt: ${msg.prompt}\n\nCode:\n${msg.code}`,
      }
    }
    const parts = [msg.response]
    if (msg.explanation) parts.push(`Explanation: ${msg.explanation}`)
    if (msg.code_suggestion) parts.push(`Code suggestion:\n${msg.code_suggestion}`)
    return { role: 'assistant', content: parts.join('\n\n') }
  })
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function UserMessage({ msg }) {
  const [codeOpen, setCodeOpen] = useState(false)
  return (
    <div className="flex flex-col items-end gap-1 mb-5">
      <div
        style={{ background: '#2d2040', border: '1px solid #4c2d7a', borderRadius: '12px 12px 2px 12px', maxWidth: '85%' }}
        className="px-3.5 py-2.5 text-sm text-slate-200 leading-relaxed"
      >
        {msg.prompt}
      </div>
      {msg.code && (
        <button
          onClick={() => setCodeOpen((v) => !v)}
          className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-400 transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
          {codeOpen ? 'Hide code' : 'Code attached'}
        </button>
      )}
      {codeOpen && msg.code && (
        <pre
          style={{ background: '#0d0d0d', border: '1px solid #2E2E2E', borderRadius: 6, maxWidth: '85%', overflowX: 'auto' }}
          className="text-xs text-slate-300 p-3 font-mono whitespace-pre-wrap"
        >
          {msg.code}
        </pre>
      )}
    </div>
  )
}

function AssistantMessage({ msg }) {
  return (
    <div className="flex flex-col items-start gap-2 mb-5">
      <div
        style={{ background: '#141420', border: '1px solid #2E2E2E', borderRadius: '12px 12px 12px 2px', maxWidth: '92%' }}
        className="px-3.5 py-2.5 text-sm text-slate-200 leading-relaxed"
      >
        {msg.response}
      </div>

      {msg.explanation && (
        <p style={{ maxWidth: '92%' }} className="text-xs text-slate-400 px-1 leading-relaxed">
          {msg.explanation}
        </p>
      )}

      {msg.user_misunderstanding && (
        <div
          style={{ background: '#451a03', border: '1px solid #92400e', borderRadius: 6, maxWidth: '92%' }}
          className="px-3 py-2 text-xs text-amber-300 leading-relaxed"
        >
          <span className="font-semibold">Note: </span>{msg.user_misunderstanding}
        </div>
      )}

      {msg.code_suggestion && (
        <pre
          style={{ background: '#0d1a0d', border: '1px solid #1a3a1a', borderRadius: 6, maxWidth: '92%', overflowX: 'auto' }}
          className="text-xs text-green-300 p-3 font-mono whitespace-pre-wrap"
        >
          {msg.code_suggestion}
        </pre>
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 mb-4 px-1">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6, height: 6, borderRadius: '50%', background: '#7c3aed',
              animation: 'bounce 1.2s infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <span className="text-xs text-slate-500">Thinking…</span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ChatPanel({ problemContent, code, onClose }) {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Reset chat when the user navigates to a different problem
  useEffect(() => {
    setMessages([])
    setInputText('')
  }, [problemContent])

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(promptText) {
    const trimmed = promptText.trim()
    if (!trimmed || loading) return

    const userMsg = { role: 'user', prompt: trimmed, code }
    const history = buildLLMHistory(messages)
    const optimisticMessages = [...messages, userMsg]

    setMessages(optimisticMessages)
    setInputText('')
    setLoading(true)

    try {
      const question = htmlToText(problemContent)
      const result = await askDSA(question, code, trimmed, history)
      setMessages([...optimisticMessages, { role: 'assistant', ...result }])
    } catch (e) {
      setMessages([
        ...optimisticMessages,
        {
          role: 'assistant',
          response: `Something went wrong: ${e.message}`,
          code_suggestion: null,
          explanation: null,
          user_misunderstanding: null,
        },
      ])
    } finally {
      setLoading(false)
      // Re-focus input after response
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(inputText)
    }
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#1C1C1C' }}>

      {/* ── Header ── */}
      <div
        style={{ background: '#141414', borderBottom: '1px solid #2E2E2E' }}
        className="flex items-center justify-between px-4 py-2.5 shrink-0"
      >
        <div className="flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Code with AI</span>
        </div>
        <button
          onClick={onClose}
          title="Close chat"
          className="text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 pb-10">
            <div style={{ background: '#1e1030', border: '1px solid #4c2d7a', borderRadius: '50%', padding: 16 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">Ask anything about your code</p>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Your current code is automatically<br />attached to every message.
              </p>
            </div>
            <div className="flex gap-2 mt-1">
              <span style={{ background: '#1e1030', border: '1px solid #3b1f5e', borderRadius: 6 }} className="text-xs text-violet-400 px-2.5 py-1">
                ✦ Get solution
              </span>
              <span style={{ background: '#1c1408', border: '1px solid #78350f', borderRadius: 6 }} className="text-xs text-amber-400 px-2.5 py-1">
                💡 Get hints
              </span>
            </div>
          </div>
        )}

        {messages.map((msg, i) =>
          msg.role === 'user'
            ? <UserMessage key={i} msg={msg} />
            : <AssistantMessage key={i} msg={msg} />
        )}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* ── Quick-action shortcuts ── */}
      <div
        style={{ borderTop: '1px solid #2E2E2E' }}
        className="px-3 pt-2.5 pb-1 shrink-0 flex items-center gap-2"
      >
        <button
          onClick={() => send('Please provide the optimal solution with a detailed step-by-step explanation and complexity analysis.')}
          disabled={loading}
          style={{ background: '#1e1030', border: '1px solid #5b21b6', borderRadius: 6 }}
          className="text-xs text-violet-300 px-3 py-1.5 hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          ✦ Get Solution
        </button>
        <button
          onClick={() => send("Give me progressive hints to help me think through this problem. Don't reveal the full solution.")}
          disabled={loading}
          style={{ background: '#1c1408', border: '1px solid #92400e', borderRadius: 6 }}
          className="text-xs text-amber-400 px-3 py-1.5 hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          💡 Get Hints
        </button>
      </div>

      {/* ── Input area ── */}
      <div style={{ borderTop: '1px solid #2E2E2E' }} className="px-3 pt-2 pb-3 shrink-0">
        <div
          style={{ background: '#0d0d0d', border: '1px solid #2E2E2E', borderRadius: 8 }}
          className="flex items-end gap-2 px-3 py-2"
        >
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything… (⏎ send, ⇧⏎ new line)"
            disabled={loading}
            rows={1}
            style={{
              resize: 'none',
              minHeight: 20,
              maxHeight: 120,
              background: 'transparent',
              outline: 'none',
              color: '#e2e8f0',
              fontSize: 13,
            }}
            className="flex-1 placeholder-slate-600 leading-5 overflow-y-auto disabled:opacity-50"
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
          />
          <button
            onClick={() => send(inputText)}
            disabled={!inputText.trim() || loading}
            style={{
              background: inputText.trim() && !loading ? '#7c3aed' : '#2E2E2E',
              borderRadius: 6,
              padding: '5px 9px',
              flexShrink: 0,
              transition: 'background 0.15s',
            }}
            className="text-white disabled:cursor-not-allowed"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-1.5 px-0.5">Code attached automatically</p>
      </div>

      {/* Bounce keyframes for typing indicator */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
