import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { WorkspacePage } from '@/pages/WorkspacePage'
import { TwinRunPage } from '@/pages/TwinRunPage'
import { SharedSnippetPage } from '@/pages/SharedSnippetPage'
import { LandingPage } from '@/pages/LandingPage'

export default function App() {
  return (
    <div className="min-h-screen bg-surface-900 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/twinrun" element={<TwinRunPage />} />
          <Route path="/share/:token" element={<SharedSnippetPage />} />
        </Routes>
      </main>
    </div>
  )
}
