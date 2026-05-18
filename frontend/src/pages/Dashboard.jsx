import { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import Layout from '../components/Layout'
import LinkCard from '../components/LinkCard'
import CreateLinkModal from '../components/CreateLinkModal'
import { LinkService } from '../services/link.service'

export default function Dashboard() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')

  const loadLinks = async () => {
    try {
      const data = await LinkService.getAll()
      setLinks(data.links)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadLinks() }, [])

  const handleDelete = async (linkId) => {
    try {
      await LinkService.remove(linkId)
      setLinks(prev => prev.filter(l => l.linkId !== linkId))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCreated = (link) => {
    setLinks(prev => [link, ...prev])
  }

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0)

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h2>Your links</h2>
            <p className="dashboard-stats">
              {links.length} link{links.length !== 1 ? 's' : ''} · {totalClicks} total click{totalClicks !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> New link
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : links.length === 0 ? (
          <div className="empty-state">
            <p>No links yet.</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              Create your first link
            </button>
          </div>
        ) : (
          <div className="link-list">
            {links.map(link => (
              <LinkCard key={link.linkId} link={link} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateLinkModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </Layout>
  )
}
