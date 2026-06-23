// Normalize: lowercase + remove Vietnamese diacritics + collapse spaces
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Common leet-speak substitutions before normalizing
function deLeet(text) {
  return text
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/\$/g, 's')
    .replace(/@/g, 'a')
}

const BANNED_WORDS = [
  // Tiếng Việt
  'dit', 'dich', 'lon', 'cac', 'buoi', 'dai', 'ngu', 'khon', 'cho', 'tron', 'chet',
  'mat', 'du', 'dm', 'dcm', 'dkm', 'dmm', 'vcl', 'vkl', 'vl', 'clm', 'đm', 'đcm',
  'lol', 'cc', 'cu', 'cai lon', 'cai buoi', 'chet di', 'con cho', 'thang cho',
  'do ngu', 'do dien', 'may dien', 'an c', 'đít', 'địt', 'lồn', 'cặc', 'bướm',
  'dâm', 'dam', 'phang', 'chich', 'dit me', 'dit ba', 'fuck', 'shit', 'bitch',
  'asshole', 'bastard', 'cunt', 'dick', 'pussy', 'motherfucker',
]

export function containsProfanity(text) {
  if (!text || typeof text !== 'string') return false
  const cleaned = normalize(deLeet(text))
  return BANNED_WORDS.some((word) => {
    const normalizedWord = normalize(word)
    const regex = new RegExp(`(?:^|\\s)${normalizedWord}(?:\\s|$)`)
    return regex.test(cleaned) || cleaned.includes(normalizedWord)
  })
}

export function filterMessage() {
  return 'Đánh giá chứa nội dung không phù hợp. Vui lòng chỉnh sửa trước khi gửi.'
}
