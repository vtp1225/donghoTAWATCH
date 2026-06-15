import { useEffect, useState } from 'react'
import { watchService, variantService, variantImageService } from '../../services/watchService'
import { brandService } from '../../services/brandService'
import { categoryService } from '../../services/categoryService'
import { segmentService } from '../../services/segmentService'
import { colorService } from '../../services/colorService'

function uniqueById(arr, idKey, nameKey) {
  const seen = new Map()
  arr.forEach((item) => {
    if (item[idKey] && !seen.has(item[idKey])) {
      seen.set(item[idKey], { id: item[idKey], name: item[nameKey] })
    }
  })
  return [...seen.values()]
}

const MOVEMENT_TYPES = ['AUTOMATIC', 'MANUAL', 'QUARTZ', 'SOLAR', 'SMART']

const GLASS_MATERIAL_TYPES = [
  { value: 'SAPPHIRE', label: 'Sapphire (chống xước cao cấp)' },
  { value: 'MINERAL', label: 'Mineral (kính khoáng phổ thông)' },
  { value: 'HARDLEX', label: 'Hardlex (Seiko, cứng hơn mineral)' },
  { value: 'ACRYLIC', label: 'Acrylic / Plexiglass (đồng hồ cổ)' },
  { value: 'SAPPHIRE_COATED', label: 'Sapphire phủ chống phản chiếu' },
]

const STRAP_MATERIAL_TYPES = [
  { value: 'STAINLESS_STEEL', label: 'Thép không gỉ' },
  { value: 'LEATHER', label: 'Da' },
  { value: 'RUBBER', label: 'Cao su / Silicone' },
  { value: 'NYLON', label: 'Vải Nylon / NATO strap' },
  { value: 'GOLD', label: 'Dây vàng' },
  { value: 'TITANIUM', label: 'Titanium' },
  { value: 'CERAMIC', label: 'Ceramic' },
  { value: 'MESH', label: 'Dây lưới kim loại (Milanese)' },
]

const WATCH_DEFAULTS = {
  sku: '',
  name: '',
  brandId: '',
  categoryId: '',
  segmentId: '',
  movementType: 'AUTOMATIC',
  description: '',
  glassMaterial: '',
  thicknessMm: '',
  waterResistanceAtm: '',
  powerReserveHours: '',
  batteryType: '',
  features: '',
  isActive: true,
}

const IMAGE_DEFAULT = {
  id: null,
  url: '',
  altText: '',
  isPrimary: true,
  isMainImage: false,
  file: null,
  preview: '',
}

const VARIANT_DEFAULT = {
  id: null,
  dialColorId: '',
  strapColorId: '',
  strapMaterial: '',
  caseSizeMm: '',
  price: '',
  stockQuantity: '',
  isActive: true,
  images: [{ ...IMAGE_DEFAULT }],
}

function buildWatchForm(watch) {
  if (!watch) return WATCH_DEFAULTS

  return {
    sku: watch.sku ?? '',
    name: watch.name ?? '',
    brandId: watch.brandId ? String(watch.brandId) : '',
    categoryId: watch.categoryId ? String(watch.categoryId) : '',
    segmentId: watch.segmentId ? String(watch.segmentId) : '',
    movementType: watch.movementType ?? 'AUTOMATIC',
    description: watch.description ?? '',
    glassMaterial: watch.glassMaterial ?? '',
    thicknessMm: watch.thicknessMm ?? '',
    waterResistanceAtm: watch.waterResistanceAtm ?? '',
    powerReserveHours: watch.powerReserveHours ?? '',
    batteryType: watch.batteryType ?? '',
    features: watch.features ?? '',
    isActive: watch.isActive ?? true,
  }
}

function buildImageRows(images) {
  if (!images?.length) return [{ ...IMAGE_DEFAULT }]

  const sorted = [...images].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  const hasPrimary = sorted.some((item) => item.isPrimary)

  return sorted.map((image, index) => ({
    id: image.id ?? null,
    url: image.url ?? '',
    altText: image.altText ?? '',
    isPrimary: hasPrimary ? Boolean(image.isPrimary) : index === 0,
    isMainImage: Boolean(image.isMainImage),
    file: null,
    preview: '',
  }))
}

function buildVariantForm(variant, images) {
  if (!variant) return { ...VARIANT_DEFAULT, images: [{ ...IMAGE_DEFAULT }] }

  return {
    id: variant.id,
    dialColorId: variant.dialColorId ? String(variant.dialColorId) : '',
    strapColorId: variant.strapColorId ? String(variant.strapColorId) : '',
    strapMaterial: variant.strapMaterial ?? '',
    caseSizeMm: variant.caseSizeMm ?? '',
    price: variant.price ?? '',
    stockQuantity: variant.stockQuantity ?? '',
    isActive: variant.isActive ?? true,
    images: buildImageRows(images),
  }
}

function normalizeImages(rows) {
  const filled = rows
    .map((row) => ({
      id: row.id ?? null,
      url: row.file ? '' : row.url.trim(),
      altText: row.altText.trim(),
      isPrimary: Boolean(row.isPrimary),
      isMainImage: Boolean(row.isMainImage),
      file: row.file || null,
    }))
    .filter((row) => row.url || row.file)

  if (filled.length === 0) return []

  const primaryIndex = filled.findIndex((row) => row.isPrimary)
  const resolvedPrimary = primaryIndex >= 0 ? primaryIndex : 0

  return filled.map((row, index) => ({
    id: row.id,
    url: row.url,
    altText: row.altText || undefined,
    isPrimary: index === resolvedPrimary,
    isMainImage: Boolean(row.isMainImage),
    file: row.file,
    sortOrder: index,
  }))
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">
        {label}{required && <span className="text-error ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

function ColorSelect({ value, onChange, colors, placeholder = '-- Chọn màu --' }) {
  const selected = colors.find((c) => String(c.id) === String(value))
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-transparent border-b border-outline-variant/30 focus:border-primary focus:outline-none py-2 pl-8 pr-4 font-body-md text-sm text-on-surface transition-colors cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {colors.map((c) => (
          <option key={c.id} value={String(c.id)}>{c.name}</option>
        ))}
      </select>
      {selected?.hexCode && (
        <span
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border border-white/20 shadow-sm"
          style={{ background: selected.hexCode }}
        />
      )}
    </div>
  )
}

const inputCls = 'bg-transparent border-b border-outline-variant/30 focus:border-primary focus:outline-none py-2 font-body-md text-sm text-on-surface placeholder:text-on-surface-variant/30 transition-colors w-full'
const selectCls = `${inputCls} appearance-none cursor-pointer`

export default function WatchModal({ open, onClose, onSuccess, watch }) {
  const [step, setStep] = useState(1)
  const [watchForm, setWatchForm] = useState(WATCH_DEFAULTS)
  const [variants, setVariants] = useState([{ ...VARIANT_DEFAULT, images: [{ ...IMAGE_DEFAULT }] }])
  const [loadedVariantIds, setLoadedVariantIds] = useState([])
  const [loadedImageIdsByVariant, setLoadedImageIdsByVariant] = useState({})
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [segments, setSegments] = useState([])
  const [colors, setColors] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isEditMode = Boolean(watch)

  useEffect(() => {
    if (!open) return

    let cancelled = false

    setStep(1)
    setError('')
    
    setSubmitting(false)
    setWatchForm(buildWatchForm(watch))
    setVariants([{ ...VARIANT_DEFAULT, images: [{ ...IMAGE_DEFAULT, isMainImage: true }] }])
    setLoadedVariantIds([])
    setLoadedImageIdsByVariant({})

    Promise.all([
      brandService.getAll().catch(() => []),
      watchService.getAllAdmin().catch(() => []),
      categoryService.getAll().catch(() => []),
      segmentService.getAll().catch(() => []),
      colorService.getAll(true).catch(() => []),
      watch ? variantService.getByWatch(watch.id).catch(() => []) : Promise.resolve([]),
    ]).then(async ([brandList, watchList, categoryList, segmentList, colorList, variantList]) => {
      if (cancelled) return

      setBrands(brandList)
      setColors(Array.isArray(colorList) ? colorList : [])

      if (categoryList.length > 0) {
        setCategories(categoryList.map((item) => ({ id: item.id, name: item.name })))
      } else {
        setCategories(uniqueById(watchList, 'categoryId', 'categoryName'))
      }

      if (segmentList.length > 0) {
        setSegments(segmentList.map((item) => ({ id: item.id, name: item.name })))
      } else {
        setSegments(uniqueById(watchList, 'segmentId', 'segmentName'))
      }

      if (!variantList?.length) return

      const imagesByVariant = await Promise.all(
        variantList.map((variant) => variantImageService.getByVariant(variant.id).catch(() => []))
      )

      if (cancelled) return

      const variantForms = variantList.map((variant, index) => buildVariantForm(variant, imagesByVariant[index]))
      setVariants(variantForms)
      setLoadedVariantIds(variantList.map((variant) => variant.id))

      const imageIds = {}
      variantList.forEach((variant, index) => {
        imageIds[variant.id] = imagesByVariant[index].map((img) => img.id).filter(Boolean)
      })
      setLoadedImageIdsByVariant(imageIds)
    })

    return () => {
      cancelled = true
    }
  }, [open, watch])

  function setWatch(field, value) {
    setWatchForm((prev) => ({ ...prev, [field]: value }))
  }

  function setVariant(variantIndex, field, value) {
    setVariants((prev) => prev.map((variant, index) => (index === variantIndex ? { ...variant, [field]: value } : variant)))
  }

  function addVariant() {
    setVariants((prev) => [...prev, { ...VARIANT_DEFAULT, images: [{ ...IMAGE_DEFAULT }] }])
  }

  function removeVariant(variantIndex) {
    setVariants((prev) => {
      const next = prev.filter((_, index) => index !== variantIndex)
      return next.length > 0 ? next : [{ ...VARIANT_DEFAULT, images: [{ ...IMAGE_DEFAULT }] }]
    })
  }

  function addImage(variantIndex) {
    setVariants((prev) => prev.map((variant, index) => {
      if (index !== variantIndex) return variant
      return {
        ...variant,
        images: [...variant.images, { ...IMAGE_DEFAULT, isPrimary: false }],
      }
    }))
  }

  function removeImage(variantIndex, imageIndex) {
    setVariants((prev) => prev.map((variant, index) => {
      if (index !== variantIndex) return variant

      const removed = variant.images[imageIndex]
      if (removed?.preview) URL.revokeObjectURL(removed.preview)

      const nextImages = variant.images.filter((_, idx) => idx !== imageIndex)
      if (nextImages.length === 0) {
        return { ...variant, images: [{ ...IMAGE_DEFAULT }] }
      }

      if (!nextImages.some((img) => img.isPrimary)) {
        nextImages[0] = { ...nextImages[0], isPrimary: true }
      }

      return { ...variant, images: nextImages }
    }))
  }

  function setImageField(variantIndex, imageIndex, field, value) {
    setVariants((prev) => prev.map((variant, index) => {
      if (index !== variantIndex) return variant
      return {
        ...variant,
        images: variant.images.map((image, idx) => (idx === imageIndex ? { ...image, [field]: value } : image)),
      }
    }))
  }

  function setPrimaryImage(variantIndex, imageIndex) {
    setVariants((prev) => prev.map((variant, index) => {
      if (index !== variantIndex) return variant
      return {
        ...variant,
        images: variant.images.map((image, idx) => ({ ...image, isPrimary: idx === imageIndex })),
      }
    }))
  }

  function setMainImage(variantIndex, imageIndex) {
    setVariants((prev) => prev.map((variant, vIdx) => ({
      ...variant,
      images: variant.images.map((image, iIdx) => ({
        ...image,
        isMainImage: vIdx === variantIndex && iIdx === imageIndex,
      })),
    })))
  }

  function handleFileChange(variantIndex, imageIndex, file) {
    if (!file) return
    const preview = URL.createObjectURL(file)
    setVariants((prev) => prev.map((variant, vIdx) => {
      if (vIdx !== variantIndex) return variant
      return {
        ...variant,
        images: variant.images.map((image, iIdx) => {
          if (iIdx !== imageIndex) return image
          if (image.preview) URL.revokeObjectURL(image.preview)
          return { ...image, file, preview, url: '' }
        }),
      }
    }))
  }

  function clearFile(variantIndex, imageIndex) {
    setVariants((prev) => prev.map((variant, vIdx) => {
      if (vIdx !== variantIndex) return variant
      return {
        ...variant,
        images: variant.images.map((image, iIdx) => {
          if (iIdx !== imageIndex) return image
          if (image.preview) URL.revokeObjectURL(image.preview)
          return { ...image, file: null, preview: '', url: '' }
        }),
      }
    }))
  }

  function validateStep1() {
    if (!watchForm.sku.trim()) return 'SKU không được để trống'
    if (!watchForm.name.trim()) return 'Tên sản phẩm không được để trống'
    if (!watchForm.brandId) return 'Vui lòng chọn thương hiệu'
    return ''
  }

  function validateStep2() {
    if (variants.length === 0) return 'Cần ít nhất một biến thể'

    for (let i = 0; i < variants.length; i += 1) {
      const variant = variants[i]
      if (!variant.dialColorId) return `Biến thể ${i + 1}: màu mặt không được để trống`
      if (!variant.strapMaterial.trim()) return `Biến thể ${i + 1}: chất liệu dây không được để trống`
      if (!variant.caseSizeMm) return `Biến thể ${i + 1}: kích thước case không được để trống`
      if (!variant.price) return `Biến thể ${i + 1}: giá không được để trống`
      if (!variant.stockQuantity) return `Biến thể ${i + 1}: tồn kho không được để trống`

      const normalized = normalizeImages(variant.images)
      if (normalized.length === 0) return `Biến thể ${i + 1}: cần ít nhất một ảnh`
    }

    return ''
  }

  function handleNext() {
    const err = validateStep1()
    if (err) {
      setError(err)
      return
    }

    setError('')
    setStep(2)
  }

  async function handleSubmit() {
    const err = validateStep2()
    if (err) {
      setError(err)
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const watchPayload = {
        sku: watchForm.sku.trim(),
        name: watchForm.name.trim(),
        brandId: Number(watchForm.brandId),
        categoryId: watchForm.categoryId ? Number(watchForm.categoryId) : undefined,
        segmentId: watchForm.segmentId ? Number(watchForm.segmentId) : undefined,
        movementType: watchForm.movementType,
        description: watchForm.description.trim() || undefined,
        glassMaterial: watchForm.glassMaterial.trim() || undefined,
        thicknessMm: watchForm.thicknessMm ? Number(watchForm.thicknessMm) : undefined,
        waterResistanceAtm: watchForm.waterResistanceAtm ? Number(watchForm.waterResistanceAtm) : undefined,
        powerReserveHours: watchForm.powerReserveHours ? Number(watchForm.powerReserveHours) : undefined,
        batteryType: watchForm.batteryType.trim() || undefined,
        features: watchForm.features.trim() || undefined,
        isActive: Boolean(watchForm.isActive),
      }

      const savedWatch = isEditMode
        ? await watchService.update(watch.id, watchPayload)
        : await watchService.create(watchPayload)

      const watchId = savedWatch?.id ?? watch?.id
      const keptVariantIds = []

      for (const variant of variants) {
        const normalizedImages = normalizeImages(variant.images)
        const primaryImage = normalizedImages.find((image) => image.isPrimary)?.url ?? normalizedImages[0]?.url

        const variantPayload = {
          watchId,
          dialColorId: variant.dialColorId ? Number(variant.dialColorId) : undefined,
          strapColorId: variant.strapColorId ? Number(variant.strapColorId) : undefined,
          strapMaterial: variant.strapMaterial.trim(),
          caseSizeMm: Number(variant.caseSizeMm),
          price: Number(variant.price),
          stockQuantity: Number(variant.stockQuantity),
          imageUrl: primaryImage,
          isActive: Boolean(variant.isActive),
        }

        const savedVariant = variant.id
          ? await variantService.update(variant.id, variantPayload)
          : await variantService.create(variantPayload)

        const variantId = savedVariant?.id ?? variant.id
        keptVariantIds.push(variantId)

        if (isEditMode && variant.id != null) {
          // Smart diff: only delete removed images, update changed ones
          const originalImageIds = loadedImageIdsByVariant[variant.id] ?? []
          const keptIds = new Set(normalizedImages.filter((img) => img.id != null).map((img) => img.id))
          const removedIds = originalImageIds.filter((id) => !keptIds.has(id))
          await Promise.all(removedIds.map((id) => variantImageService.deleteById(id).catch(() => {})))

          // Update existing images to apply any flag/altText changes
          const existingImages = normalizedImages.filter((img) => img.id != null && !img.file)
          for (const img of existingImages) {
            await variantImageService.update(img.id, {
              variantId,
              url: img.url,
              altText: img.altText || undefined,
              isPrimary: img.isPrimary,
              isMainImage: img.isMainImage,
              sortOrder: img.sortOrder,
            }).catch(() => {})
          }
        } else {
          // New product or new variant: safe to delete all then recreate
          await variantImageService.deleteByVariant(variantId).catch(() => {})
        }

        // Upload new file images (always new, never have an id)
        const fileImages = normalizedImages.filter((img) => img.file)
        for (const img of fileImages) {
          const fd = new FormData()
          fd.append('file', img.file)
          fd.append('variantId', String(variantId))
          if (img.altText) fd.append('altText', img.altText)
          fd.append('isPrimary', String(img.isPrimary))
          fd.append('isMainImage', String(img.isMainImage))
          fd.append('sortOrder', String(img.sortOrder ?? 0))
          await variantImageService.upload(fd)
        }

        // Create new URL images (those without an existing DB id)
        const newUrlImages = normalizedImages.filter((img) => !img.file && img.url && img.id == null)
        if (newUrlImages.length > 0) {
          await variantImageService.createBatch({
            variantId,
            images: newUrlImages.map(({ url, altText, isPrimary, isMainImage, sortOrder }) => ({
              url,
              altText: altText || undefined,
              isPrimary,
              isMainImage,
              sortOrder,
            })),
          })
        }
      }

      const removedIds = loadedVariantIds.filter((id) => !keptVariantIds.includes(id))
      await Promise.all(removedIds.map((id) => variantService.delete(id).catch(() => {})))

      onSuccess?.()
      onClose()
    } catch (submitError) {
      setError(submitError.message || (isEditMode ? 'Không thể cập nhật sản phẩm.' : 'Không thể tạo sản phẩm.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative ml-auto w-full max-w-4xl h-full bg-surface-container-low border-l border-outline-variant/20 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-10 py-8 border-b border-outline-variant/10">
          <div>
            <span className="font-label-caps text-[10px] text-primary tracking-[0.4em] block mb-1 uppercase">Vault Access</span>
            <h2 className="font-headline-sm text-headline-sm text-on-background">{isEditMode ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm'}</h2>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">close</button>
        </div>

        <div className="flex items-center gap-0 px-10 py-4 border-b border-outline-variant/10">
          {[
            { n: 1, label: 'Thông tin đồng hồ' },
            { n: 2, label: 'Biến thể và ảnh' },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center">
              {i > 0 && <div className={`w-16 h-px mx-2 transition-colors ${step >= n ? 'bg-primary' : 'bg-outline-variant/20'}`} />}
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-label-caps transition-colors ${step >= n ? 'bg-primary text-background' : 'border border-outline-variant/30 text-on-surface-variant/40'}`}>
                  {step > n ? '✓' : n}
                </div>
                <span className={`font-label-caps text-[10px] tracking-wider ${step >= n ? 'text-primary' : 'text-on-surface-variant/40'}`}>{label.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>

        {error && <div className="mx-10 mt-4 px-4 py-3 border border-error/30 bg-error/10 font-label-caps text-[10px] text-error tracking-widest">{error}</div>}

        <div className="flex-1 overflow-y-auto px-10 py-8">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <Field label="SKU" required>
                <input className={inputCls} placeholder="RLX-SUB-001" value={watchForm.sku} onChange={(e) => setWatch('sku', e.target.value)} />
              </Field>
              <Field label="Tên sản phẩm" required>
                <input className={inputCls} placeholder="Rolex Submariner" value={watchForm.name} onChange={(e) => setWatch('name', e.target.value)} />
              </Field>
              <Field label="Thương hiệu" required>
                <select className={selectCls} value={watchForm.brandId} onChange={(e) => setWatch('brandId', e.target.value)}>
                  <option value="">-- Chọn thương hiệu --</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </Field>
              <Field label="Loại máy" required>
                <select className={selectCls} value={watchForm.movementType} onChange={(e) => setWatch('movementType', e.target.value)}>
                  {MOVEMENT_TYPES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Danh mục">
                <select className={selectCls} value={watchForm.categoryId} onChange={(e) => setWatch('categoryId', e.target.value)}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Phân khúc">
                <select className={selectCls} value={watchForm.segmentId} onChange={(e) => setWatch('segmentId', e.target.value)}>
                  <option value="">-- Chọn phân khúc --</option>
                  {segments.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
              <Field label="Kính">
                <select className={selectCls} value={watchForm.glassMaterial} onChange={(e) => setWatch('glassMaterial', e.target.value)}>
                  <option value="">-- Chọn loại kính --</option>
                  {GLASS_MATERIAL_TYPES.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Chống nước (ATM)">
                <input className={inputCls} type="number" placeholder="30" value={watchForm.waterResistanceAtm} onChange={(e) => setWatch('waterResistanceAtm', e.target.value)} />
              </Field>
              <Field label="Độ dày (mm)">
                <input className={inputCls} type="number" step="0.1" placeholder="12.5" value={watchForm.thicknessMm} onChange={(e) => setWatch('thicknessMm', e.target.value)} />
              </Field>
              <Field label="Trữ cót (giờ)">
                <input className={inputCls} type="number" placeholder="48" value={watchForm.powerReserveHours} onChange={(e) => setWatch('powerReserveHours', e.target.value)} />
              </Field>
              <Field label="Loại pin">
                <input className={inputCls} placeholder="(để trống nếu không dùng pin)" value={watchForm.batteryType} onChange={(e) => setWatch('batteryType', e.target.value)} />
              </Field>
              <Field label="Tính năng">
                <input className={inputCls} placeholder="Chronograph, Date display" value={watchForm.features} onChange={(e) => setWatch('features', e.target.value)} />
              </Field>
              <div className="col-span-2">
                <Field label="Mô tả">
                  <textarea className={`${inputCls} resize-none h-24`} placeholder="Mô tả sản phẩm..." value={watchForm.description} onChange={(e) => setWatch('description', e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-headline-sm text-lg text-on-background">Biến thể và thư viện ảnh</p>
                  <p className="font-body-md text-sm text-on-surface-variant/70 mt-2">Mỗi biến thể cần tối thiểu 1 ảnh, có thể thêm nhiều ảnh phụ.</p>
                </div>
                <button type="button" onClick={addVariant} className="px-4 py-2 border border-primary text-primary font-label-caps text-[10px] tracking-[0.2em] uppercase hover:bg-primary hover:text-background transition-all duration-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Thêm biến thể
                </button>
              </div>

              {variants.map((variant, variantIndex) => (
                <div key={variant.id ?? `new-${variantIndex}`} className="border border-outline-variant/20 p-5 bg-surface-container/20 space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="font-label-caps text-xs text-primary tracking-widest uppercase">Biến thể {variantIndex + 1}</p>
                    <button type="button" onClick={() => removeVariant(variantIndex)} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors" title="Xoá biến thể">delete</button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Màu mặt" required>
                      <ColorSelect
                        value={variant.dialColorId}
                        onChange={(v) => setVariant(variantIndex, 'dialColorId', v)}
                        colors={colors}
                        placeholder="-- Chọn màu mặt --"
                      />
                    </Field>
                    <Field label="Màu dây">
                      <ColorSelect
                        value={variant.strapColorId}
                        onChange={(v) => setVariant(variantIndex, 'strapColorId', v)}
                        colors={colors}
                        placeholder="-- Chọn màu dây --"
                      />
                    </Field>
                    <Field label="Chất liệu dây" required>
                      <select className={selectCls} value={variant.strapMaterial} onChange={(e) => setVariant(variantIndex, 'strapMaterial', e.target.value)}>
                        <option value="">-- Chọn chất liệu --</option>
                        {STRAP_MATERIAL_TYPES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Case (mm)" required>
                      <input className={inputCls} type="number" step="0.1" value={variant.caseSizeMm} onChange={(e) => setVariant(variantIndex, 'caseSizeMm', e.target.value)} />
                    </Field>
                    <Field label="Giá" required>
                      <input className={inputCls} type="number" value={variant.price} onChange={(e) => setVariant(variantIndex, 'price', e.target.value)} />
                    </Field>
                    <Field label="Tồn kho" required>
                      <input className={inputCls} type="number" value={variant.stockQuantity} onChange={(e) => setVariant(variantIndex, 'stockQuantity', e.target.value)} />
                    </Field>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">Ảnh của biến thể</p>
                        <p className="font-label-caps text-[9px] text-on-surface-variant/40 mt-0.5">Ảnh chính: đại diện biến thể · Đại diện SP: thumbnail hiển thị toàn trang (chọn 1 trong tất cả biến thể)</p>
                      </div>
                      <button type="button" onClick={() => addImage(variantIndex)} className="px-3 py-2 border border-primary text-primary font-label-caps text-[10px] tracking-widest uppercase hover:bg-primary hover:text-background transition-colors">Thêm ảnh</button>
                    </div>

                    {variant.images.map((image, imageIndex) => (
                      <div key={imageIndex} className="border border-outline-variant/10 p-3">
                        <div className="flex gap-3 items-start">
                          {/* Thumbnail preview */}
                          <div className="shrink-0 w-16 h-16 border border-outline-variant/20 overflow-hidden bg-surface-container flex items-center justify-center">
                            {(image.preview || image.url) ? (
                              <img src={image.preview || image.url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                            ) : (
                              <span className="material-symbols-outlined text-on-surface-variant/20 text-2xl">image</span>
                            )}
                          </div>

                          {/* Fields */}
                          <div className="flex-1 space-y-2 min-w-0">
                            <div>
                              <label className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase block mb-1.5">
                                Ảnh <span className="text-error ml-1">*</span>
                              </label>
                              {image.file ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-body-md text-xs text-on-surface-variant truncate">{image.file.name}</span>
                                  <button type="button" onClick={() => clearFile(variantIndex, imageIndex)} className="shrink-0 text-[10px] font-label-caps tracking-widest uppercase text-error hover:text-error/70 transition-colors">
                                    × Xóa file
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <label htmlFor={`img-file-${variantIndex}-${imageIndex}`} className="shrink-0 px-2.5 py-1.5 border border-outline-variant/30 text-[10px] font-label-caps tracking-widest uppercase cursor-pointer hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm leading-none">upload</span>
                                    TẢI LÊN
                                  </label>
                                  <input type="file" accept="image/*" id={`img-file-${variantIndex}-${imageIndex}`} className="hidden" onChange={(e) => handleFileChange(variantIndex, imageIndex, e.target.files[0])} />
                                </div>
                              )}
                            </div>
                            <Field label="Alt text">
                              <input className={inputCls} placeholder="Mặt nghiêng của biến thể" value={image.altText} onChange={(e) => setImageField(variantIndex, imageIndex, 'altText', e.target.value)} />
                            </Field>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-col gap-1.5 shrink-0">
                            <button type="button" onClick={() => setPrimaryImage(variantIndex, imageIndex)} className={`px-2.5 py-1.5 text-[10px] font-label-caps tracking-widest uppercase border ${image.isPrimary ? 'border-primary text-primary bg-primary/10' : 'border-outline-variant/20 text-on-surface-variant hover:border-primary hover:text-primary'}`}>
                              {image.isPrimary ? 'ẢNH CHÍNH' : 'ĐẶT CHÍNH'}
                            </button>
                            <button type="button" onClick={() => setMainImage(variantIndex, imageIndex)} title="Đặt làm ảnh đại diện sản phẩm" className={`px-2.5 py-1.5 text-[10px] font-label-caps tracking-widest uppercase border transition-colors ${image.isMainImage ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-outline-variant/20 text-on-surface-variant hover:border-amber-500 hover:text-amber-500'}`}>
                              {image.isMainImage ? '★ ĐẠI DIỆN' : '☆ ĐẠI DIỆN'}
                            </button>
                            <button type="button" onClick={() => removeImage(variantIndex, imageIndex)} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors text-center text-xl">delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-10 py-6 border-t border-outline-variant/10 flex justify-between items-center">
          {step === 1 ? (
            <button type="button" onClick={onClose} className="font-label-caps text-xs text-on-surface-variant hover:text-primary tracking-widest transition-colors">HUỶ</button>
          ) : (
            <button type="button" onClick={() => { setStep(1); setError('') }} className="font-label-caps text-xs text-on-surface-variant hover:text-primary tracking-widest transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              QUAY LẠI
            </button>
          )}

          {step === 1 ? (
            <button type="button" onClick={handleNext} className="px-8 py-3 border border-primary text-primary font-label-caps text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-background transition-all duration-500 active:scale-95 flex items-center gap-2">
              TIẾP THEO
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting} className="px-8 py-3 bg-primary text-background font-label-caps text-xs tracking-[0.2em] uppercase hover:bg-primary-container transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">save</span>
              {submitting ? 'ĐANG LƯU...' : isEditMode ? 'LƯU THAY ĐỔI' : 'TẠO SẢN PHẨM'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
