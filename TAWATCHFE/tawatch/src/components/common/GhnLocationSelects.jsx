import { useEffect, useState } from 'react'
import { ghnService } from '../../services/ghnService.js'

const selectClass =
  'w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm text-on-surface outline-none transition-colors focus:border-primary disabled:opacity-40 disabled:cursor-not-allowed'

/**
 * GHN cascading dropdowns: Province → District → Ward
 *
 * Props:
 *  onChange(fields) — called with a subset of:
 *    { province, district, ward, ghnDistrictId, ghnWardCode }
 *
 *  initialProvince / initialDistrict / initialWard — text values already saved
 *  (shown as placeholder text; user must re-select to get GHN IDs)
 *
 *  labelClass — optional override for label className
 */
export default function GhnLocationSelects({ onChange, initialProvince, initialDistrict, initialWard, labelClass }) {
  const [provinces, setProvinces]           = useState([])
  const [districts, setDistricts]           = useState([])
  const [wards, setWards]                   = useState([])
  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingWards, setLoadingWards]         = useState(false)
  const [error, setError]                   = useState('')

  // Selected IDs (for cascading)
  const [selectedProvinceId, setSelectedProvinceId] = useState('')
  const [selectedDistrictId, setSelectedDistrictId] = useState('')

  useEffect(() => {
    setLoadingProvinces(true)
    ghnService.getProvinces()
      .then((list) => {
        setProvinces(Array.isArray(list) && list.length > 0 ? list : [])
        if (!list || list.length === 0) setError('Không thể tải danh sách tỉnh thành.')
      })
      .catch(() => setError('Không thể tải danh sách tỉnh thành. Kiểm tra kết nối backend.'))
      .finally(() => setLoadingProvinces(false))
  }, [])

  const handleProvinceChange = async (e) => {
    const opt = e.target.options[e.target.selectedIndex]
    const provinceId   = Number(opt.value)
    const provinceName = opt.text
    setSelectedProvinceId(provinceId)
    setSelectedDistrictId('')
    setDistricts([])
    setWards([])
    onChange({ province: provinceName, district: '', ward: '', ghnDistrictId: null, ghnWardCode: '' })
    setLoadingDistricts(true)
    const list = await ghnService.getDistricts(provinceId).catch(() => [])
    setDistricts(Array.isArray(list) ? list : [])
    setLoadingDistricts(false)
  }

  const handleDistrictChange = async (e) => {
    const opt = e.target.options[e.target.selectedIndex]
    const districtId   = Number(opt.value)
    const districtName = opt.text
    setSelectedDistrictId(districtId)
    setWards([])
    onChange({ district: districtName, ward: '', ghnDistrictId: districtId, ghnWardCode: '' })
    setLoadingWards(true)
    const list = await ghnService.getWards(districtId).catch(() => [])
    setWards(Array.isArray(list) ? list : [])
    setLoadingWards(false)
  }

  const handleWardChange = (e) => {
    const opt = e.target.options[e.target.selectedIndex]
    onChange({ ward: opt.text, ghnWardCode: opt.value })
  }

  const lbl = labelClass ?? 'mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase'

  if (error) {
    return (
      <div className="col-span-2 rounded border border-red-400/30 bg-red-400/5 px-4 py-3">
        <p className="font-body-md text-xs text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <>
      <div>
        <label className={lbl}>Tỉnh / Thành phố <span className="text-primary">*</span></label>
        <select
          value={selectedProvinceId}
          onChange={handleProvinceChange}
          disabled={loadingProvinces}
          className={selectClass}
        >
          <option value="" disabled>
            {loadingProvinces ? 'Đang tải...' : initialProvince ? `${initialProvince} (chọn lại)` : 'Chọn tỉnh / thành phố'}
          </option>
          {provinces.map((p) => (
            <option key={p.provinceId} value={p.provinceId}>{p.provinceName}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={lbl}>Quận / Huyện <span className="text-primary">*</span></label>
        <select
          value={selectedDistrictId}
          onChange={handleDistrictChange}
          disabled={districts.length === 0 || loadingDistricts}
          className={selectClass}
        >
          <option value="" disabled>
            {loadingDistricts ? 'Đang tải...' : initialDistrict && !selectedProvinceId ? `${initialDistrict} (chọn lại)` : 'Chọn quận / huyện'}
          </option>
          {districts.map((d) => (
            <option key={d.districtId} value={d.districtId}>{d.districtName}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={lbl}>Phường / Xã <span className="text-primary">*</span></label>
        <select
          onChange={handleWardChange}
          defaultValue=""
          disabled={wards.length === 0 || loadingWards}
          className={selectClass}
        >
          <option value="" disabled>
            {loadingWards ? 'Đang tải...' : initialWard && !selectedDistrictId ? `${initialWard} (chọn lại)` : 'Chọn phường / xã'}
          </option>
          {wards.map((w) => (
            <option key={w.wardCode} value={w.wardCode}>{w.wardName}</option>
          ))}
        </select>
      </div>
    </>
  )
}
