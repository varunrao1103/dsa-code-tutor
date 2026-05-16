import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProblemsPage from './pages/ProblemsPage'
import SolverPage from './pages/SolverPage'

export default function App() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<ProblemsPage />} />
          <Route path="/problem/:titleSlug" element={<SolverPage />} />
        </Routes>
      </div>
    </div>
  )
}
