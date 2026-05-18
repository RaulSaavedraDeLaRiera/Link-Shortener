import { useState } from 'react'
import { FaCopy, FaCheck, FaTrash, FaMousePointer, FaExternalLinkAlt } from 'react-icons/fa'

export default function LinkCard({ link, onDelete }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(link.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const domain = (() => {
    try { return new URL(link.originalUrl).hostname } catch { return link.originalUrl }
  })()

  return (
    <div className="link-card">
      <div className="link-card-top">
        <div className="link-info">
          <a href={link.shortUrl} target="_blank" rel="noreferrer" className="short-url">
            {link.shortUrl} <FaExternalLinkAlt className="link-ext-icon" />
          </a>
          <span className="original-url" title={link.originalUrl}>{domain}</span>
        </div>
        <div className="link-actions">
          <button className="btn-copy" onClick={copy}>
            {copied ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy</>}
          </button>
          <button className="btn-delete" onClick={() => onDelete(link.linkId)}>
            <FaTrash />
          </button>
        </div>
      </div>
      <div className="link-card-bottom">
        <span className="link-stat">
          <FaMousePointer /> <strong>{link.clicks}</strong> click{link.clicks !== 1 ? 's' : ''}
        </span>
        <span className="link-date">
          {new Date(link.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}
