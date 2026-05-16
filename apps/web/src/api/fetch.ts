const API_URL = process.env.API_URL ?? 'http://localhost:3333'

interface GetOptions {
  params?: Record<string, string>
  cache?: RequestCache
  revalidate?: number
}

export const http = {
  get: async <T>(path: string, options?: GetOptions): Promise<T> => {
    const url = buildUrl(path, options?.params)
    const response = await fetch(url, {
      method: 'GET',
      cache: options?.cache ?? 'no-store',
      next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
    })
    if (!response.ok) throw await asError(response)
    return (await response.json()) as T
  },

  post: async <T>(path: string, body: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) throw await asError(response)
    return (await response.json()) as T
  },
}

const buildUrl = (path: string, params?: Record<string, string>) => {
  const url = new URL(`${API_URL}${path}`)
  if (params) {
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
  }
  return url.toString()
}

const asError = async (response: Response) => {
  const text = await response.text()
  let message = `HTTP ${response.status}`
  try {
    const json = JSON.parse(text) as { message?: string | string[] }
    if (Array.isArray(json.message)) message = json.message.join(', ')
    else if (typeof json.message === 'string') message = json.message
  } catch {
    if (text) message = `${message}: ${text}`
  }
  return new Error(message)
}
