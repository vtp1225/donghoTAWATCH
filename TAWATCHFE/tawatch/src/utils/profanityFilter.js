/**
 * Chuẩn hóa chuỗi văn bản: chuyển thành chữ thường, xóa dấu tiếng Việt, và xóa khoảng trắng dư thừa
 * @param {string} text - Chuỗi văn bản cần chuẩn hóa
 * @returns {string} Chuỗi văn bản đã được chuẩn hóa
 */
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

/**
 * Loại bỏ cách viết thay thế chữ cái bằng số/kí tự đặc biệt (leet-speak)
 * @param {string} text - Chuỗi văn bản có thể chứa leet-speak
 * @returns {string} Chuỗi văn bản đã chuyển đổi kí tự leet-speak về chữ cái thường
 */
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

/**
 * Kiểm tra xem chuỗi văn bản có chứa các từ ngữ nhạy cảm/không phù hợp hay không
 * @param {string} text - Chuỗi văn bản cần kiểm tra
 * @returns {boolean} True nếu chứa từ ngữ không phù hợp, ngược lại False
 */
export function containsProfanity(text) {
  if (!text || typeof text !== 'string') return false
  const cleaned = normalize(deLeet(text))
  return BANNED_WORDS.some((word) => {
    const normalizedWord = normalize(word)
    const regex = new RegExp(`(?:^|\\s)${normalizedWord}(?:\\s|$)`)
    return regex.test(cleaned) || cleaned.includes(normalizedWord)
  })
}

/**
 * Trả về thông báo lỗi khi phát hiện có từ ngữ không phù hợp
 * @returns {string} Thông báo lỗi
 */
export function filterMessage() {
  return 'Đánh giá chứa nội dung không phù hợp. Vui lòng chỉnh sửa trước khi gửi.'
}
