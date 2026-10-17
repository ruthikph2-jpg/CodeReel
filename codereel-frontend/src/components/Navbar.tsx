import { Link, useLocation } from 'react-router-dom'
import { Film, SplitSquareHorizontal, BookOpen, Github } from 'lucide-react'
import { clsx } from 'clsx'

const NAV_LINKS = [
  { to: '/workspace', label: 'Workspace', icon: BookOpen },
  { to: '/twinrun',   label: 'TwinRun',   icon: SplitSquareHorizontal },
]

export function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className="h-14 bg-surface-800 border-b border-surface-600 flex items-center px-6 gap-6 shrink-0">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 font-bold text-lg">
        <Film className="text-brand-500" size={22} />
        <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
          CodeReel
        </span>
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
              pathname.startsWith(to)
                ? 'bg-brand-500/20 text-brand-400 font-medium'
                : 'text-gray-400 hover:text-white hover:bg-surface-600'
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <a
          href="https://github.com/ruthikph2-jpg/CodeReel"
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
        >
          <Github size={16} />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  )
}
