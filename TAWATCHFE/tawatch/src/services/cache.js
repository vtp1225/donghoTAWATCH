const store = new Map()

/**
 * Lấy dữ liệu từ bộ nhớ cache hoặc gọi hàm fetcher nếu cache không tồn tại / hết hạn
 * @param {string} key - Khóa lưu trữ trong cache
 * @param {Function} fetcher - Hàm gọi API hoặc lấy dữ liệu khi cache bị lỗi/hết hạn
 * @param {number} ttlMs - Thời gian sống của cache tính bằng ms (mặc định 300,000ms = 5 phút)
 * @returns {Promise<any>} Dữ liệu trả về
 */
export function cached(key, fetcher, ttlMs = 300_000) {
  const entry = store.get(key)
  if (entry && Date.now() < entry.exp) return Promise.resolve(entry.val)
  return fetcher().then(val => {
    store.set(key, { val, exp: Date.now() + ttlMs })
    return val
  })
}

/**
 * Xóa một hoặc nhiều cache theo khóa
 * @param {...string} keys - Các khóa cache cần xóa
 */
export function invalidate(...keys) {
  keys.forEach(k => store.delete(k))
}
