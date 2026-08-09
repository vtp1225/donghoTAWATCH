import { useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import * as XLSX from 'xlsx'
import { brandService } from '../../services/brandService'
import { categoryService } from '../../services/categoryService'
import { segmentService } from '../../services/segmentService'
import { colorService } from '../../services/colorService'
import { watchService, variantService } from '../../services/watchService'

const VALID_MOVEMENT = ['AUTOMATIC', 'MANUAL', 'QUARTZ', 'SOLAR', 'SMART']
const VALID_STRAP    = ['STAINLESS_STEEL', 'LEATHER', 'RUBBER', 'NYLON', 'GOLD', 'TITANIUM', 'CERAMIC', 'MESH']

const COL_IDX = {
  name: 0, sku: 1, brand: 2, category: 3, segment: 4, movement: 5,
  price: 6, stock: 7, description: 8, dialColor: 9, strapColor: 10,
  strapMaterial: 11, caseSize: 12,
}

function cell(row, idx) {
  const v = row[idx]
  return v != null ? String(v).trim() : ''
}

function numCell(row, idx) {
  const v = row[idx]
  return v != null && v !== '' ? Number(v) : null
}

async function downloadTemplate() {
  let colors = []
  try { colors = await colorService.getAll() } catch { /* skip if API unavailable */ }

  const HEADERS = [
    'Tên sản phẩm *', 'SKU *', 'Thương hiệu *', 'Danh mục *', 'Phân khúc *',
    'Loại máy *', 'Giá bán (VND) *', 'Tồn kho *', 'Mô tả',
    'Màu mặt đồng hồ', 'Màu dây đeo', 'Chất liệu dây', 'Kích thước mặt (mm)',
  ]

  const SAMPLES = [
    ['Seiko Presage Cocktail Time', 'SKO-PRESAGE-001', 'Seiko', 'Đồng hồ nam', 'Tầm trung', 'AUTOMATIC', 5200000, 8, 'Đồng hồ cơ automatic', '', '', 'LEATHER', 40.5],
    ['Seiko Presage Cocktail Time', 'SKO-PRESAGE-001', 'Seiko', 'Đồng hồ nam', 'Tầm trung', 'AUTOMATIC', 5200000, 3, '',                       '', '', 'LEATHER', 40.5],
    ['Citizen Eco-Drive Axiom',     'CTZ-AXIOM-001',   'Citizen', 'Đồng hồ nam', 'Tầm trung', 'SOLAR',    4800000, 5, 'Năng lượng ánh sáng',   '', '', 'STAINLESS_STEEL', 42],
  ]
  const GUIDE = [
    ['HƯỚNG DẪN NHẬP LIỆU'],
    [''],
    ['• Các cột có dấu * là BẮT BUỘC'],
    ['• 1 dòng = 1 biến thể (màu sắc / kích thước)'],
    ['• Cùng SKU = cùng sản phẩm → hệ thống tự ghép biến thể (xem ví dụ dòng 2-3)'],
    ['• Tên Thương hiệu / Danh mục / Phân khúc / Màu phải KHỚP ĐÚNG với hệ thống'],
    ['• Xem sheet "Danh sách màu" để biết tên màu hợp lệ'],
    [''],
    ['Loại máy hợp lệ (cột F):'],
    ['  AUTOMATIC — Cơ tự động'], ['  MANUAL — Cơ lên dây'],
    ['  QUARTZ — Điện tử (pin)'], ['  SOLAR — Năng lượng mặt trời'], ['  SMART — Đồng hồ thông minh'],
    [''],
    ['Chất liệu dây hợp lệ (cột L):'],
    ['  LEATHER — Da'], ['  STAINLESS_STEEL — Thép không gỉ'], ['  RUBBER — Cao su'],
    ['  NYLON — Vải nylon'], ['  GOLD — Dây vàng'], ['  TITANIUM — Titanium'],
    ['  CERAMIC — Ceramic'], ['  MESH — Dây lưới kim loại'],
  ]
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...SAMPLES])
  ws['!cols'] = [
    { wch: 30 }, { wch: 18 }, { wch: 16 }, { wch: 18 }, { wch: 14 },
    { wch: 14 }, { wch: 16 }, { wch: 10 }, { wch: 35 }, { wch: 18 },
    { wch: 16 }, { wch: 18 }, { wch: 16 },
  ]
  XLSX.utils.book_append_sheet(wb, ws, 'Sản phẩm')
  const wsGuide = XLSX.utils.aoa_to_sheet(GUIDE)
  wsGuide['!cols'] = [{ wch: 70 }]
  XLSX.utils.book_append_sheet(wb, wsGuide, 'Hướng dẫn')

  if (colors.length > 0) {
    const colorRows = [
      ['Tên màu (dùng trong cột Màu mặt / Màu dây)'],
      [''],
      ...colors.map((c) => [c.name]),
    ]
    const wsColors = XLSX.utils.aoa_to_sheet(colorRows)
    wsColors['!cols'] = [{ wch: 30 }]
    XLSX.utils.book_append_sheet(wb, wsColors, 'Danh sách màu')
  }

  XLSX.writeFile(wb, 'template_san_pham.xlsx')
}

async function loadLookups() {
  const [brands, categories, segments, colors] = await Promise.all([
    brandService.getAll(),
    categoryService.getAll(),
    segmentService.getAll(),
    colorService.getAll(),
  ])
  const toMap = (arr, key = 'name') => {
    const m = new Map()
    arr.forEach((item) => m.set(item[key]?.trim().toLowerCase(), item.id))
    return m
  }
  return {
    brands:     toMap(brands),
    categories: toMap(categories),
    segments:   toMap(segments),
    colors:     toMap(colors),
  }
}

function parseAndValidate(rows, lookups) {
  const groups = new Map()

  rows.forEach((row, idx) => {
    const rowNum = idx + 2 // 1-indexed, header is row 1
    const errors = []

    const name      = cell(row, COL_IDX.name)
    const sku       = cell(row, COL_IDX.sku)
    const brandName = cell(row, COL_IDX.brand)
    const catName   = cell(row, COL_IDX.category)
    const segName   = cell(row, COL_IDX.segment)
    const movement  = cell(row, COL_IDX.movement).toUpperCase()
    const price     = numCell(row, COL_IDX.price)
    const stock     = numCell(row, COL_IDX.stock)
    const desc      = cell(row, COL_IDX.description)
    const dialName  = cell(row, COL_IDX.dialColor)
    const strapName = cell(row, COL_IDX.strapColor)
    const strapMat  = cell(row, COL_IDX.strapMaterial).toUpperCase()
    const caseSize  = numCell(row, COL_IDX.caseSize)

    if (!name)  errors.push('Thiếu tên sản phẩm')
    if (!sku)   errors.push('Thiếu SKU')
    if (!brandName) errors.push('Thiếu thương hiệu')
    if (!catName)   errors.push('Thiếu danh mục')
    if (!segName)   errors.push('Thiếu phân khúc')
    if (!movement)  errors.push('Thiếu loại máy')
    else if (!VALID_MOVEMENT.includes(movement)) errors.push(`Loại máy không hợp lệ: "${movement}"`)
    if (price == null || isNaN(price) || price <= 0) errors.push('Giá bán phải > 0')
    if (stock == null || isNaN(stock) || stock < 0)  errors.push('Tồn kho phải >= 0')

    const brandId    = lookups.brands.get(brandName.toLowerCase())
    const categoryId = lookups.categories.get(catName.toLowerCase())
    const segmentId  = lookups.segments.get(segName.toLowerCase())

    if (brandName && !brandId)    errors.push(`Thương hiệu "${brandName}" không tìm thấy trong hệ thống`)
    if (catName && !categoryId)   errors.push(`Danh mục "${catName}" không tìm thấy trong hệ thống`)
    if (segName && !segmentId)    errors.push(`Phân khúc "${segName}" không tìm thấy trong hệ thống`)

    const dialColorId  = dialName  ? lookups.colors.get(dialName.toLowerCase())  : null
    const strapColorId = strapName ? lookups.colors.get(strapName.toLowerCase()) : null

    if (dialName && !dialColorId)  errors.push(`Màu mặt "${dialName}" không tìm thấy`)
    if (strapName && !strapColorId) errors.push(`Màu dây "${strapName}" không tìm thấy`)
    if (strapMat && !VALID_STRAP.includes(strapMat)) errors.push(`Chất liệu dây không hợp lệ: "${strapMat}"`)

    const variant = {
      rowNum,
      price: price ?? 0,
      stockQuantity: stock ?? 0,
      dialColorId:   dialColorId  || null,
      strapColorId:  strapColorId || null,
      strapMaterial: VALID_STRAP.includes(strapMat) ? strapMat : null,
      caseSizeMm:    caseSize     || null,
      variantErrors: errors.filter(e =>
        e.includes('Giá') || e.includes('Tồn') || e.includes('Màu') || e.includes('Chất liệu')
      ),
      label: [
        dialName  && `Mặt ${dialName}`,
        strapName && `Dây ${strapName}`,
        caseSize  && `${caseSize}mm`,
      ].filter(Boolean).join(' / ') || 'Mặc định',
    }

    if (!groups.has(sku)) {
      groups.set(sku, {
        sku,
        name,
        brandName, brandId,
        categoryName: catName, categoryId,
        segmentName: segName,  segmentId,
        movementType: movement,
        description: desc,
        watchErrors: errors.filter(e =>
          !e.includes('Giá') && !e.includes('Tồn') && !e.includes('Màu') && !e.includes('Chất liệu')
        ),
        variants: [],
      })
    } else {
      // Variant-level errors only for subsequent rows of same SKU
      variant.variantErrors = [...variant.variantErrors]
    }

    // Attach all row errors to variant for display
    variant.rowErrors = errors
    groups.get(sku).variants.push(variant)
  })

  return [...groups.values()].map((g) => ({
    ...g,
    hasErrors: g.watchErrors.length > 0 || g.variants.some((v) => v.rowErrors.length > 0),
  }))
}

// ─── Status badge ────────────────────────────────────────────────────────────
function StatusIcon({ status }) {
  if (status === 'pending')  return <span className="material-symbols-outlined text-base text-on-surface-variant/40 animate-pulse">hourglass_empty</span>
  if (status === 'ok')       return <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
  if (status === 'error')    return <span className="material-symbols-outlined text-base text-error">cancel</span>
  if (status === 'skipped')  return <span className="material-symbols-outlined text-base text-amber-400">warning</span>
  return <span className="material-symbols-outlined text-base text-on-surface-variant/20">radio_button_unchecked</span>
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ImportExcelModal({ open, onClose, onSuccess }) {
  const [step, setStep]             = useState('upload') // upload | preview | importing | done
  const [dragging, setDragging]     = useState(false)
  const [groups, setGroups]         = useState([])
  const [lookups, setLookups]       = useState(null)
  const [lookupErr, setLookupErr]   = useState(null)
  const [parsing, setParsing]       = useState(false)
  const [parseErr, setParseErr]     = useState(null)
  const [importLog, setImportLog]   = useState([]) // { sku, watchStatus, variants:[{label,status,error}] }
  const [expanded, setExpanded]     = useState(new Set())
  const fileRef = useRef()

  const reset = useCallback(() => {
    setStep('upload')
    setDragging(false)
    setGroups([])
    setLookups(null)
    setLookupErr(null)
    setParsing(false)
    setParseErr(null)
    setImportLog([])
    setExpanded(new Set())
  }, [])

  function handleClose() {
    reset()
    onClose()
  }

  async function processFile(file) {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['xlsx', 'xls'].includes(ext)) {
      setParseErr('Chỉ hỗ trợ file .xlsx hoặc .xls')
      return
    }
    setParsing(true)
    setParseErr(null)
    try {
      let lk = lookups
      if (!lk) {
        try { lk = await loadLookups() } catch {
          setLookupErr('Không thể tải dữ liệu hệ thống. Vui lòng thử lại.')
          setParsing(false)
          return
        }
        setLookups(lk)
        setLookupErr(null)
      }

      const buf  = await file.arrayBuffer()
      const wb   = XLSX.read(buf, { type: 'array' })
      const ws   = wb.Sheets[wb.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })

      // Skip header row
      const rows = data.slice(1).filter((r) => r.some((c) => c !== ''))
      if (rows.length === 0) {
        setParseErr('File không có dữ liệu.')
        setParsing(false)
        return
      }

      const parsed = parseAndValidate(rows, lk)
      setGroups(parsed)
      setStep('preview')
    } catch {
      setParseErr('Không thể đọc file. Vui lòng kiểm tra lại định dạng.')
    } finally {
      setParsing(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  function onFileInput(e) {
    processFile(e.target.files[0])
    e.target.value = ''
  }

  function toggleExpand(sku) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(sku) ? next.delete(sku) : next.add(sku)
      return next
    })
  }

  const validGroups  = groups.filter((g) => !g.hasErrors)
  const invalidCount = groups.filter((g) => g.hasErrors).length

  async function runImport() {
    if (validGroups.length === 0) return
    setStep('importing')
    const log = validGroups.map((g) => ({
      sku: g.sku,
      name: g.name,
      watchStatus: 'pending',
      watchError: null,
      variants: g.variants.map((v) => ({ label: v.label, status: 'idle', error: null })),
    }))
    setImportLog([...log])

    for (let gi = 0; gi < validGroups.length; gi++) {
      const g = validGroups[gi]

      // Create watch
      log[gi].watchStatus = 'pending'
      setImportLog([...log])

      let watchId
      try {
        const created = await watchService.create({
          sku:          g.sku,
          name:         g.name,
          brandId:      g.brandId,
          categoryId:   g.categoryId,
          segmentId:    g.segmentId,
          movementType: g.movementType,
          description:  g.description || null,
        })
        watchId = created.id
        log[gi].watchStatus = 'ok'
      } catch (err) {
        log[gi].watchStatus = 'error'
        log[gi].watchError  = err?.message || 'Lỗi tạo sản phẩm'
        log[gi].variants.forEach((v) => { v.status = 'skipped' })
        setImportLog([...log])
        continue
      }
      setImportLog([...log])

      // Create variants
      for (let vi = 0; vi < g.variants.length; vi++) {
        const v = g.variants[vi]
        log[gi].variants[vi].status = 'pending'
        setImportLog([...log])

        try {
          await variantService.create({
            watchId,
            price:         v.price,
            stockQuantity: v.stockQuantity,
            dialColorId:   v.dialColorId   || null,
            strapColorId:  v.strapColorId  || null,
            strapMaterial: v.strapMaterial || null,
            caseSizeMm:    v.caseSizeMm    || null,
          })
          log[gi].variants[vi].status = 'ok'
        } catch (err) {
          log[gi].variants[vi].status = 'error'
          log[gi].variants[vi].error  = err?.message || 'Lỗi tạo biến thể'
        }
        setImportLog([...log])
      }
    }

    setStep('done')
    onSuccess?.()
  }

  const doneOk  = importLog.reduce((s, g) => s + (g.watchStatus === 'ok' ? 1 : 0), 0)
  const doneFail = importLog.reduce((s, g) => s + (g.watchStatus === 'error' ? 1 : 0), 0)

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={step === 'importing' ? undefined : handleClose} />

      <div className="relative bg-surface-container-low border border-outline-variant/20 w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-outline-variant/15">
          <div>
            <p className="font-label-caps text-[10px] text-primary tracking-widest uppercase mb-1">Excel Import</p>
            <h3 className="font-headline-sm text-headline-sm text-on-background">
              {step === 'upload'    && 'Nhập sản phẩm từ Excel'}
              {step === 'preview'   && `Xem trước — ${groups.length} sản phẩm`}
              {step === 'importing' && 'Đang nhập dữ liệu...'}
              {step === 'done'      && 'Hoàn tất nhập liệu'}
            </h3>
          </div>
          {step !== 'importing' && (
            <button onClick={handleClose} className="p-2 text-on-surface-variant/50 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex px-8 pt-4 pb-0 gap-6">
          {[['upload','1','Tải file'],['preview','2','Xem trước'],['importing','3','Nhập liệu']].map(([s, num, label]) => {
            const done = (s === 'upload' && ['preview','importing','done'].includes(step))
                      || (s === 'preview' && ['importing','done'].includes(step))
                      || (s === 'importing' && step === 'done')
            const active = step === s || (s === 'importing' && step === 'done')
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold border transition-colors ${
                  done   ? 'bg-primary border-primary text-background' :
                  active ? 'border-primary text-primary' :
                           'border-outline-variant/30 text-on-surface-variant/30'
                }`}>
                  {done ? '✓' : num}
                </div>
                <span className={`font-label-caps text-[10px] tracking-widest ${active || done ? 'text-primary' : 'text-on-surface-variant/30'}`}>{label.toUpperCase()}</span>
              </div>
            )
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">

          {/* ── Step: Upload ── */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Download template */}
              <div className="flex items-center justify-between p-4 border border-outline-variant/20 bg-surface-container-highest/30">
                <div>
                  <p className="font-label-caps text-xs text-on-background mb-1">File mẫu Excel</p>
                  <p className="text-[11px] text-on-surface-variant/60">Tải về và điền dữ liệu theo đúng định dạng</p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-5 py-2 border border-outline-variant/30 text-on-surface-variant font-label-caps text-[10px] tracking-widest hover:border-primary hover:text-primary transition-all"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  TẢI TEMPLATE
                </button>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-none transition-all cursor-pointer flex flex-col items-center justify-center py-16 gap-4 ${
                  dragging
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-highest/20'
                }`}
              >
                {parsing ? (
                  <>
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                    <p className="font-label-caps text-[11px] text-on-surface-variant tracking-widest">ĐANG ĐỌC FILE...</p>
                  </>
                ) : (
                  <>
                    <span className={`material-symbols-outlined text-4xl ${dragging ? 'text-primary' : 'text-on-surface-variant/30'}`}>upload_file</span>
                    <div className="text-center">
                      <p className="font-label-caps text-xs text-on-background mb-1">Kéo thả file Excel vào đây</p>
                      <p className="text-[11px] text-on-surface-variant/50">hoặc nhấn để chọn file (.xlsx, .xls)</p>
                    </div>
                  </>
                )}
                <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={onFileInput} />
              </div>

              {lookupErr && (
                <p className="text-[11px] text-error flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {lookupErr}
                </p>
              )}
              {parseErr && (
                <p className="text-[11px] text-error flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {parseErr}
                </p>
              )}
            </div>
          )}

          {/* ── Step: Preview ── */}
          {step === 'preview' && (
            <div className="space-y-4">
              {/* Summary bar */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Tổng sản phẩm', val: groups.length, icon: 'inventory_2', color: 'text-on-background' },
                  { label: 'Hợp lệ', val: validGroups.length, icon: 'check_circle', color: 'text-emerald-400' },
                  { label: 'Có lỗi', val: invalidCount, icon: 'cancel', color: invalidCount > 0 ? 'text-error' : 'text-on-surface-variant/40' },
                ].map(({ label, val, icon, color }) => (
                  <div key={label} className="border border-outline-variant/15 p-4 bg-surface-container-highest/20">
                    <span className={`material-symbols-outlined text-lg ${color} mb-2 block`}>{icon}</span>
                    <p className={`font-headline-sm text-headline-sm ${color}`}>{val}</p>
                    <p className="font-label-caps text-[10px] text-on-surface-variant/50 tracking-widest mt-1">{label.toUpperCase()}</p>
                  </div>
                ))}
              </div>

              {/* Groups list */}
              <div className="space-y-2">
                {groups.map((g) => (
                  <div key={g.sku} className={`border transition-colors ${g.hasErrors ? 'border-error/30' : 'border-outline-variant/15'}`}>
                    <button
                      onClick={() => toggleExpand(g.sku)}
                      className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-surface-container-highest/20 transition-colors"
                    >
                      <StatusIcon status={g.hasErrors ? 'error' : 'ok'} />
                      <div className="flex-1 min-w-0">
                        <p className="font-label-caps text-xs text-on-background truncate">{g.name}</p>
                        <p className="text-[10px] text-on-surface-variant/50 mt-0.5">{g.sku} · {g.variants.length} biến thể</p>
                      </div>
                      <span className="material-symbols-outlined text-sm text-on-surface-variant/40 transition-transform" style={{ transform: expanded.has(g.sku) ? 'rotate(180deg)' : '' }}>expand_more</span>
                    </button>

                    {expanded.has(g.sku) && (
                      <div className="px-5 pb-4 border-t border-outline-variant/10 space-y-2 pt-3">
                        {/* Watch-level errors */}
                        {g.watchErrors.length > 0 && (
                          <div className="space-y-1 mb-3">
                            {g.watchErrors.map((e, i) => (
                              <p key={i} className="text-[10px] text-error flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">error</span>{e}
                              </p>
                            ))}
                          </div>
                        )}
                        {/* Watch info */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[10px] text-on-surface-variant/60 mb-3">
                          <span>Thương hiệu: <span className="text-on-background">{g.brandName}</span></span>
                          <span>Danh mục: <span className="text-on-background">{g.categoryName}</span></span>
                          <span>Phân khúc: <span className="text-on-background">{g.segmentName}</span></span>
                          <span>Loại máy: <span className="text-on-background">{g.movementType}</span></span>
                        </div>
                        {/* Variants */}
                        <div className="space-y-1">
                          {g.variants.map((v, vi) => (
                            <div key={vi} className={`flex items-start gap-2 p-2 rounded ${v.rowErrors.length > 0 ? 'bg-error/5' : 'bg-surface-container-highest/30'}`}>
                              <StatusIcon status={v.rowErrors.length > 0 ? 'error' : 'ok'} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-on-background">Dòng {v.rowNum} · {v.label}</p>
                                <p className="text-[10px] text-on-surface-variant/50">
                                  {v.price.toLocaleString('vi-VN')} ₫ · Tồn: {v.stockQuantity}
                                </p>
                                {v.rowErrors.filter(e => !g.watchErrors.includes(e)).map((e, ei) => (
                                  <p key={ei} className="text-[10px] text-error mt-0.5">{e}</p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step: Importing / Done ── */}
          {(step === 'importing' || step === 'done') && (
            <div className="space-y-3">
              {step === 'done' && (
                <div className={`flex items-center gap-3 p-4 border mb-6 ${doneFail === 0 ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-amber-400/30 bg-amber-400/5'}`}>
                  <span className={`material-symbols-outlined text-2xl ${doneFail === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {doneFail === 0 ? 'check_circle' : 'warning'}
                  </span>
                  <div>
                    <p className="font-label-caps text-xs text-on-background">
                      {doneOk}/{importLog.length} sản phẩm nhập thành công
                    </p>
                    {doneFail > 0 && <p className="text-[10px] text-amber-400 mt-0.5">{doneFail} sản phẩm thất bại</p>}
                  </div>
                </div>
              )}

              {importLog.map((g) => (
                <div key={g.sku} className="border border-outline-variant/15">
                  <div className="flex items-center gap-3 px-5 py-3">
                    <StatusIcon status={g.watchStatus} />
                    <div className="flex-1 min-w-0">
                      <p className="font-label-caps text-xs text-on-background truncate">{g.name}</p>
                      <p className="text-[10px] text-on-surface-variant/50">{g.sku}</p>
                      {g.watchError && <p className="text-[10px] text-error mt-0.5">{g.watchError}</p>}
                    </div>
                  </div>
                  {g.watchStatus !== 'error' && (
                    <div className="px-5 pb-3 border-t border-outline-variant/10 pt-2 space-y-1">
                      {g.variants.map((v, vi) => (
                        <div key={vi} className="flex items-center gap-2">
                          <StatusIcon status={v.status} />
                          <p className="text-[10px] text-on-surface-variant/70 flex-1">{v.label}</p>
                          {v.error && <p className="text-[10px] text-error">{v.error}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-outline-variant/15">
          {step === 'upload' && (
            <p className="text-[10px] text-on-surface-variant/40 tracking-wide">Hỗ trợ .xlsx, .xls</p>
          )}
          {step === 'preview' && (
            <p className="text-[10px] text-on-surface-variant/40">
              {invalidCount > 0 ? `${invalidCount} sản phẩm có lỗi sẽ bị bỏ qua` : 'Tất cả hợp lệ'}
            </p>
          )}
          {(step === 'importing' || step === 'done') && <div />}

          <div className="flex gap-3 ml-auto">
            {step === 'upload' && (
              <button onClick={handleClose} className="px-6 py-2.5 border border-outline-variant/30 text-on-surface-variant font-label-caps text-[10px] tracking-widest hover:border-primary hover:text-primary transition-all">
                HUỶ
              </button>
            )}
            {step === 'preview' && (
              <>
                <button onClick={() => { setStep('upload'); setGroups([]) }} className="px-6 py-2.5 border border-outline-variant/30 text-on-surface-variant font-label-caps text-[10px] tracking-widest hover:border-primary hover:text-primary transition-all">
                  QUAY LẠI
                </button>
                <button
                  onClick={runImport}
                  disabled={validGroups.length === 0}
                  className="px-6 py-2.5 bg-primary text-background font-label-caps text-[10px] tracking-widest hover:bg-primary/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  NHẬP {validGroups.length} SẢN PHẨM
                </button>
              </>
            )}
            {step === 'done' && (
              <button onClick={handleClose} className="px-6 py-2.5 bg-primary text-background font-label-caps text-[10px] tracking-widest hover:bg-primary/80 transition-all">
                ĐÓNG
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
