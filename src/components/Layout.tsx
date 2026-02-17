import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import './Layout.css'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { apiFileUrl } from '../api/client'

export function Layout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-pill${isActive ? ' nav-pill-active' : ''}`

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">WisdomWeave</Link>
          <nav className="nav">
            <NavLink to="/" end className={navLinkClass}>
              <span className="nav-marker" aria-hidden />
              Posts
            </NavLink>
            {user ? (
              <>
                <NavLink to="/profile" className={navLinkClass}>
                  <span className="nav-marker" aria-hidden />
                  Profile
                </NavLink>
                {user.role === 'ADMIN' && (
                  <NavLink to="/admin" className={navLinkClass}>
                    <span className="nav-marker" aria-hidden />
                    Dashboard
                  </NavLink>
                )}
                <button type="button" onClick={handleLogout} className="btn-logout">
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  <span className="nav-marker" aria-hidden />
                  Log in
                </NavLink>
                <Link to="/register" className="btn-register">Sign up</Link>
              </>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </>
  )
}

export function Avatar({ url, alt, size = 40 }: { url: string | null; alt: string; size?: number }) {
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    setLoadFailed(false)
  }, [url])

  const Placeholder = () => (
    <span className="avatar-placeholder" style={{ width: size, height: size }}>
      {alt.slice(0, 1).toUpperCase()}
    </span>
  )

  if (!url || loadFailed) return <Placeholder />

  const src = url.startsWith('http') ? url : apiFileUrl(url)
  return (
    <img
      src={src}
      alt={alt}
      className="avatar avatar-circle"
      style={{ width: size, height: size }}
      width={size}
      height={size}
      onError={() => setLoadFailed(true)}
    />
  )
}
