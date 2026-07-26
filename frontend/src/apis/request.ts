async function describeNonJsonResponse(res: Response): Promise<string> {
  const contentType = res.headers.get('content-type') || 'no content-type'
  const text = await res.text().catch(() => '')
  const snippet = text.slice(0, 150).replace(/\s+/g, ' ').trim()
  return `content-type: ${contentType}${snippet ? `, body starts with: "${snippet}"` : ', empty body'}`
}

export async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  // 204 No Content (delete endpoints) has no body and no content-type by
  // design — that's a successful response, not a JSON-parsing failure.
  if (res.status === 204)
    return undefined as T

  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')

  if (!res.ok) {
    if (isJson) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message ?? `HTTP ${res.status}`)
    }
    const details = await describeNonJsonResponse(res)
    throw new Error(`HTTP ${res.status} — backend returned non-JSON response for ${url} (${details}). This usually means something between the browser and the backend (an ad-blocker, antivirus web-shield, or network filter) intercepted the request.`)
  }

  if (!isJson) {
    const details = await describeNonJsonResponse(res)
    throw new Error(`Backend returned non-JSON response for ${url} (${details}). This usually means something between the browser and the backend (an ad-blocker, antivirus web-shield, or network filter) intercepted the request.`)
  }

  return res.json()
}
