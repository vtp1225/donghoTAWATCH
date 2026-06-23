const store = new Map()

export function cached(key, fetcher, ttlMs = 300_000) {
  const entry = store.get(key)
  if (entry && Date.now() < entry.exp) return Promise.resolve(entry.val)
  return fetcher().then(val => {
    store.set(key, { val, exp: Date.now() + ttlMs })
    return val
  })
}

export function invalidate(...keys) {
  keys.forEach(k => store.delete(k))
}
