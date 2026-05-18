import { FaLink, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="layout">
      <header className="navbar">
        <div className="navbar-brand">
          <FaLink className="logo-icon" />
          <span>LinkShort</span>
        </div>
        <div className="navbar-right">
          <span className="navbar-user">{user?.username}</span>
          <button className="btn-ghost" onClick={logout}>
            <FaSignOutAlt /> Sign out
          </button>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
