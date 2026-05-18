import { useState } from 'react'
import { FaTimes, FaLink, FaPlus } from 'react-icons/fa'
import { LinkService } from '../services/link.service'

export default function CreateLinkModal({ onClose, onCreated }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const link = await LinkService.create(url)
      onCreated(link)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2><FaLink /> Shorten a link</h2>
          <button className="btn-close" onClick={onClose}><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="field">
            <label>Destination URL</label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              autoFocus
              required
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <FaPlus /> {loading ? 'Creating...' : 'Create short link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
