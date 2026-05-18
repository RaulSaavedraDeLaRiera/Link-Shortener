import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaLink, FaEnvelope, FaCheckCircle } from 'react-icons/fa'
import { AuthService } from '../services/auth.service'

export default function ConfirmSignUp() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const email = state?.email || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await AuthService.confirm(email, code)
      navigate('/login', { state: { confirmed: true } })
    } catch (err) {
      setError(err.message || 'Confirmation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <FaLink className="logo-icon" />
          <h1>LinkShort</h1>
        </div>
        <p className="auth-subtitle">Check your email for a confirmation code</p>
        {email && <p className="auth-hint">Sent to <strong>{email}</strong></p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label><FaEnvelope /> Confirmation code</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="123456"
              required
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            <FaCheckCircle /> {loading ? 'Confirming...' : 'Confirm account'}
          </button>
        </form>
      </div>
    </div>
  )
}
