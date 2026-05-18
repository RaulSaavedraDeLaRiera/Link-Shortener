//link crud service
import { http } from './http'

export const LinkService = {
  getAll: () => http('/links'),

  create: (originalUrl) => {
    if (!originalUrl?.trim()) throw new Error('url is required')
    return http('/links', { method: 'POST', body: { originalUrl } })
  },

  remove: (linkId) => http(`/links/${linkId}`, { method: 'DELETE' })
}
