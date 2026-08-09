import * as XLSX from 'xlsx'

const HEADERS = [
  'Tên sản phẩm *',
  'SKU *',
  'Thương hiệu *',
  'Danh mục *',
  'Phân khúc *',
  'Loại máy *',
  'Giá bán (VND) *',
  'Tồn kho *',
  'Mô tả',
  'Màu mặt đồng hồ',
  'Màu dây đeo',
  'Chất liệu dây',
  'Kích thước mặt (mm)',
]

const SAMPLES = [
  // 1. Rolex Submariner Date — 2 biến thể
  ['Rolex Submariner Date',      'RLX-SUB-002',     'Rolex',  'Đồng hồ nam',  'Luxury',    'AUTOMATIC', 320000000, 2,  'Đồng hồ lặn cơ automatic huyền thoại, chống nước 300m',         'Đen',        'Bạc',   'STAINLESS_STEEL', 41],
  ['Rolex Submariner Date',      'RLX-SUB-002',     'Rolex',  'Đồng hồ nam',  'Luxury',    'AUTOMATIC', 325000000, 2,  '',                                                               'Xanh dương', 'Bạc',   'STAINLESS_STEEL', 41],
  // 2. Rolex Datejust 36 — 1 biến thể
  ['Rolex Datejust 36',          'RLX-DJ36-001',    'Rolex',  'Đồng hồ nam',  'Luxury',    'AUTOMATIC', 180000000, 3,  'Đồng hồ lịch ngày cổ điển, mặt số trắng pha lê',               'Trắng',      'Vàng',  'STAINLESS_STEEL', 36],
  // 3. Rolex Day-Date 40 — 1 biến thể
  ['Rolex Day-Date 40',          'RLX-DD40-001',    'Rolex',  'Đồng hồ nam',  'Luxury',    'AUTOMATIC', 580000000, 1,  'Đồng hồ vàng 18k, hiển thị thứ và ngày, biểu tượng quyền lực', 'Vàng',       'Vàng',  'STAINLESS_STEEL', 40],
  // 4. Omega Seamaster 300 — 2 biến thể
  ['Omega Seamaster 300',        'OMG-SM300-001',   'Omega',  'Đồng hồ nam',  'Luxury',    'AUTOMATIC',  90000000, 5,  'Đồng hồ lặn co-axial master chronometer, chống nước 300m',      'Đen',        'Đen',   'STAINLESS_STEEL', 42],
  ['Omega Seamaster 300',        'OMG-SM300-001',   'Omega',  'Đồng hồ nam',  'Luxury',    'AUTOMATIC',  92000000, 4,  '',                                                               'Xanh dương', 'Đen',   'STAINLESS_STEEL', 42],
  // 5. Omega Speedmaster Moonwatch — 1 biến thể
  ['Omega Speedmaster Moonwatch','OMG-SPM-001',     'Omega',  'Đồng hồ nam',  'Luxury',    'MANUAL',    120000000, 3,  'Chronograph lên dây tay, đồng hồ từng lên Mặt Trăng năm 1969',  'Đen',        'Đen',   'LEATHER',         42],
  // 6. Omega Constellation — 1 biến thể
  ['Omega Constellation',        'OMG-CONST-001',   'Omega',  'Đồng hồ nữ',   'Luxury',    'QUARTZ',     80000000, 4,  'Đồng hồ nữ thanh lịch, nạm kim cương, dây tích hợp ôm cổ tay', 'Trắng',      'Vàng',  'STAINLESS_STEEL', 28],
  // 7. Casio G-Shock GA-100 — 2 biến thể
  ['Casio G-Shock GA-100',       'CAS-GA100-001',   'Casio',  'Đồng hồ nam',  'Bình dân',  'QUARTZ',     1800000,  20, 'Đồng hồ thể thao chống va đập, chịu nước 200m',                 'Đen',        'Đen',   'RUBBER',          48],
  ['Casio G-Shock GA-100',       'CAS-GA100-001',   'Casio',  'Đồng hồ nam',  'Bình dân',  'QUARTZ',     1800000,  15, '',                                                               'Trắng',      'Trắng', 'RUBBER',          48],
  // 8. Casio Edifice EFR-550 — 1 biến thể
  ['Casio Edifice EFR-550',      'CAS-EFR550-001',  'Casio',  'Đồng hồ nam',  'Trung cấp', 'QUARTZ',     4200000,  10, 'Chronograph thể thao, chống nước 100m, kính sapphire',          'Đen',        'Bạc',   'STAINLESS_STEEL', 45],
  // 9. Apple Watch Series 9 — 2 biến thể
  ['Apple Watch Series 9 45mm',  'APL-WS9-45-001',  'Apple',  'Smart Watch',  'Trung cấp', 'SMART',      9900000,  15, 'Đồng hồ thông minh chip S9, màn hình Always-On Retina',         'Xám',        'Đen',   'RUBBER',          45],
  ['Apple Watch Series 9 45mm',  'APL-WS9-45-001',  'Apple',  'Smart Watch',  'Trung cấp', 'SMART',      9900000,  12, '',                                                               'Bạc',        'Trắng', 'RUBBER',          45],
  // 10. Apple Watch Ultra 2 — 1 biến thể
  ['Apple Watch Ultra 2',        'APL-WU2-001',     'Apple',  'Smart Watch',  'Luxury',    'SMART',     19990000,  8,  'Đồng hồ thể thao đỉnh cao, GPS chính xác, pin 60h, titan',       'Đen',        'Đen',   'NYLON',           49],
]

const GUIDE_ROWS = [
  ['HƯỚNG DẪN NHẬP LIỆU'],
  [''],
  ['• Các cột có dấu * là BẮT BUỘC'],
  ['• 1 dòng = 1 biến thể (màu sắc / kích thước)'],
  ['• Cùng SKU = cùng sản phẩm → hệ thống tự ghép biến thể (xem ví dụ dòng 2-3)'],
  ['• Tên Thương hiệu / Danh mục / Phân khúc / Màu phải KHỚP ĐÚNG với hệ thống'],
  [''],
  ['Loại máy hợp lệ (cột F):'],
  ['  AUTOMATIC       — Cơ tự động'],
  ['  MANUAL          — Cơ lên dây'],
  ['  QUARTZ          — Điện tử (pin)'],
  ['  SOLAR           — Năng lượng mặt trời'],
  ['  SMART           — Đồng hồ thông minh'],
  [''],
  ['Chất liệu dây hợp lệ (cột L):'],
  ['  LEATHER         — Da'],
  ['  STAINLESS_STEEL — Thép không gỉ'],
  ['  RUBBER          — Cao su / silicone'],
  ['  NYLON           — Vải nylon / NATO'],
  ['  GOLD            — Dây vàng'],
  ['  TITANIUM        — Titanium'],
  ['  CERAMIC         — Ceramic'],
  ['  MESH            — Dây lưới kim loại'],
  [''],
  ['VÍ DỤ: Dòng 1 và 2 cùng SKU "RLX-SUB-002"'],
  ['→ Hệ thống tạo 1 sản phẩm "Rolex Submariner Date" với 2 biến thể màu mặt'],
]

const wb = XLSX.utils.book_new()

// Sheet 1: Template
const wsData = [HEADERS, ...SAMPLES]
const ws = XLSX.utils.aoa_to_sheet(wsData)
ws['!cols'] = [
  { wch: 30 }, { wch: 18 }, { wch: 16 }, { wch: 18 },
  { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 10 },
  { wch: 35 }, { wch: 18 }, { wch: 16 }, { wch: 18 }, { wch: 16 },
]
ws['!freeze'] = { xSplit: 0, ySplit: 1 }
XLSX.utils.book_append_sheet(wb, ws, 'Sản phẩm')

// Sheet 2: Hướng dẫn
const wsGuide = XLSX.utils.aoa_to_sheet(GUIDE_ROWS)
wsGuide['!cols'] = [{ wch: 70 }]
XLSX.utils.book_append_sheet(wb, wsGuide, 'Hướng dẫn')

XLSX.writeFile(wb, 'template_san_pham.xlsx')
console.log('✅ Đã tạo: template_san_pham.xlsx')
