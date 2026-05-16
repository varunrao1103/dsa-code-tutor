import CodeEditor from './CodeEditor'

/**
 * Renders SolutionSchema response:
 *   { explanation, code, time_complexity, space_complexity }
 */
export default function SolutionPanel({ data }) {
  if (!data) return null

  return (
    <div className="flex flex-col gap-3">

      {/* Complexity badges */}
      <div className="flex gap-2 flex-wrap">
        <div
          style={{ background: '#1C1C1C', border: '1px solid #2E2E2E', borderRadius: 8 }}
          className="flex items-center gap-2 px-3 py-1.5"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>Time</span>
          <code className="font-mono text-sm" style={{ color: '#8B5CF6' }}>{data.time_complexity}</code>
        </div>
        <div
          style={{ background: '#1C1C1C', border: '1px solid #2E2E2E', borderRadius: 8 }}
          className="flex items-center gap-2 px-3 py-1.5"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>Space</span>
          <code className="font-mono text-sm" style={{ color: '#8B5CF6' }}>{data.space_complexity}</code>
        </div>
      </div>

      {/* Explanation */}
      <div
        style={{ background: '#1C1C1C', border: '1px solid #2E2E2E', borderRadius: 12 }}
        className="p-4"
      >
        <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{data.explanation}</p>
      </div>

      {/* Solution code — read-only Monaco */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>Solution Code</span>
        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #2E2E2E' }}>
          <CodeEditor value={data.code} readOnly height="280px" />
        </div>
      </div>
    </div>
  )
}
