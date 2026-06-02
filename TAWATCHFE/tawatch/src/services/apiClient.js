const DEFAULT_API_BASE_URL = ''

function getBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
}

function buildUrl(path) {
  const baseUrl = getBaseUrl().replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''

  if (response.status === 204) {
    return null
  }

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function getAuthHeader() {
  const token = localStorage.getItem('auth_access_token')
  if (!token) return {}
  const tokenType = localStorage.getItem('auth_token_type') || 'Bearer'
  return { Authorization: `${tokenType} ${token}` }
}

export async function request(path, options = {}) {
  const { headers: optionHeaders, ...restOptions } = options
  const response = await fetch(buildUrl(path), {
    headers: {
      Accept: 'application/json',
      ...getAuthHeader(),
      ...optionHeaders,
    },
    ...restOptions,
  })

  const data = await parseResponse(response)

  if (!response.ok) {
    const errorMessage =
      data && typeof data === 'object'
        ? data.message || data.error || response.statusText
        : response.statusText

    const error = new Error(errorMessage || 'Request failed')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}
