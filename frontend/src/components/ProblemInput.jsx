export default function ProblemInput({ value, onChange }) {
  return (
    <div className="flex flex-col h-full gap-0">
      <textarea
        style={{
          background: '#1C1C1C',
          border: '1px solid #2E2E2E',
          borderRadius: 8,
          color: '#F8FAFC',
          resize: 'none',
          flex: 1,
        }}
        className="w-full h-full p-3 text-sm leading-relaxed focus:outline-none
                   focus:ring-2 focus:ring-violet-600 placeholder-slate-500
                   transition-shadow"
        placeholder="Paste the DSA problem here…&#10;&#10;e.g. Given an array of integers nums and an integer target, return indices of the two numbers that add up to target."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
      <div className="flex justify-end pt-1.5">
        <span className="text-xs" style={{ color: '#64748B' }}>
          {value.length} chars
        </span>
      </div>
    </div>
  )
}
