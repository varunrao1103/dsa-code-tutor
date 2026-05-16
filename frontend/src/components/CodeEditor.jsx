import Editor from '@monaco-editor/react'

export default function CodeEditor({ value, onChange, language = 'python', readOnly = false, height }) {
  return (
    <div style={{ height: height ?? '100%', background: '#141414' }} className="overflow-hidden">
      <Editor
        height={height ?? '100%'}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={readOnly ? undefined : onChange}
        options={{
          readOnly,
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: readOnly ? 'none' : 'line',
          padding: { top: 12, bottom: 12 },
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          contextmenu: false,
          lineDecorationsWidth: 8,
        }}
      />
    </div>
  )
}
