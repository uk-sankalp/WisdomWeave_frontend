import { trackRequest } from '../serverWakeStore'

const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('token')
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: HeadersInit = {
    ...((options.headers as Record<string, string>) ?? {}),
  }
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json'
  } else {
    delete (headers as Record<string, string>)['Content-Type']
  }

  return trackRequest(async () => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'same-origin',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  const text = await res.text()
  if (!text || text.trim() === '') return undefined as T
  return JSON.parse(text) as T
  })
}

/** Build full URL for a file. Handles various backend formats: "/api/files/xxx", "uploads/avatars/xxx", "xxx". */
export function apiFileUrl(path: string): string {
  if (!path || typeof path !== 'string') return ''
  const trimmed = path.replace(/^\/+/, '').trim()
  let filename = trimmed
  if (trimmed.includes('/')) {
    filename = trimmed.split('/').pop() ?? trimmed
  }
  if (!filename) return ''
  const pathPart = `${API_BASE}/files/${encodeURIComponent(filename)}`
  if (typeof window !== 'undefined') {
    return window.location.origin + pathPart
  }
  return pathPart
}
