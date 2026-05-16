import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        background: '#141414',
        borderBottom: '1px solid #2E2E2E',
        height: 48,
        flexShrink: 0,
        zIndex: 50,
      }}
      className="flex items-center justify-between px-5"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <div
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
            borderRadius: 8,
            boxShadow: '0 0 0 1px rgba(124,58,237,0.4), 0 0 16px rgba(124,58,237,0.3)',
          }}
          className="w-7 h-7 flex items-center justify-center text-white font-bold text-xs"
        >
          {'</>'}
        </div>
        <span className="font-semibold text-sm text-white tracking-wide">DSA Code Tutor</span>
      </Link>
    </nav>
  )
}
