//reusable HTTP service with automatic cognito token injection
import { authStore } from '../utils/authStore'

const parse = async (res) => {
  if (res.status === 204) return null
  const text = await res.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return text }
}

export const http = async (path, { method = 'GET', body } = {}) => {
  const token = await authStore.getToken()
  const apiUrl = import.meta.env.VITE_API_URL || ''

  const res = await fetch(`${apiUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await parse(res)

  if (!res.ok) {
    const message = (data && (data.err || data.message)) || `Error ${res.status}`
    throw new Error(message)
  }

  return data
}
