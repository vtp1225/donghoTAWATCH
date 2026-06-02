import { useState } from 'react'
import Navbar from '../../components/layout/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'

const INFO_ITEMS = [
  { icon: 'location_on', label: 'Địa chỉ', value: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh' },
  { icon: 'call', label: 'Điện thoại', value: '+84 (028) 3822 1234' },
  { icon: 'mail', label: 'Email', value: 'contact@tawatch.vn' },
  { icon: 'schedule', label: 'Giờ làm việc', value: 'Thứ Hai – Thứ Bảy: 9:00 – 20:00' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative flex h-52 items-end border-b border-outline-variant/10 px-8 pb-10 md:px-[80px]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-low/60" />
          <div className="relative mx-auto w-full max-w-7xl">
            <p className="mb-2 font-label-caps text-[10px] tracking-[0.35em] text-on-surface-variant/60 uppercase">
              Kết nối với chúng tôi
            </p>
            <h1 className="font-headline-md text-3xl tracking-[0.12em] uppercase text-on-surface">
              Liên Hệ
            </h1>
            <div className="mt-4 h-px w-16 bg-gradient-to-r from-primary to-transparent" />
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-8 py-16 md:px-[80px] lg:grid-cols-2">
          {/* Left — Info */}
          <div className="space-y-12">
            <div>
              <p className="font-body-md text-sm leading-relaxed text-on-surface-variant">
                Đội ngũ TAWatch luôn sẵn sàng hỗ trợ bạn. Hãy ghé thăm showroom hoặc liên hệ
                qua các kênh dưới đây để được tư vấn bởi chuyên gia đồng hồ của chúng tôi.
              </p>
            </div>

            <div className="space-y-8">
              {INFO_ITEMS.map((item) => (
                <div key={item.icon} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-outline-variant/20">
                    <span className="material-symbols-outlined text-[18px] text-primary">{item.icon}</span>
                  </div>
                  <div>
                    <p className="mb-1 font-label-caps text-[9px] tracking-[0.3em] uppercase text-on-surface-variant/50">
                      {item.label}
                    </p>
                    <p className="font-body-md text-sm text-on-surface">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Gold divider */}
            <div className="h-px bg-gradient-to-r from-primary/30 to-transparent" />

            <p className="font-label-caps text-[10px] tracking-[0.22em] uppercase text-on-surface-variant/50">
              Phản hồi trong vòng 24 giờ làm việc
            </p>
          </div>

          {/* Right — Form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center border border-primary/40">
                  <span className="material-symbols-outlined text-3xl text-primary">check</span>
                </div>
                <div>
                  <p className="font-label-caps text-sm tracking-[0.15em] uppercase text-on-surface">
                    Đã gửi thành công
                  </p>
                  <p className="mt-2 font-body-md text-sm text-on-surface-variant">
                    Chúng tôi sẽ liên hệ lại với bạn sớm nhất.
                  </p>
                </div>
                <button
                  type="button"
                  className="border border-outline-variant/30 px-6 py-2.5 font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface/60 transition-all hover:border-primary/40 hover:text-primary"
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }) }}
                >
                  Gửi thêm
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { name: 'name', label: 'Họ và tên', type: 'text', required: true },
                  { name: 'email', label: 'Email', type: 'email', required: true },
                  { name: 'phone', label: 'Số điện thoại', type: 'tel', required: false },
                ].map((field) => (
                  <div key={field.name} className="group relative">
                    <label className="mb-2 block font-label-caps text-[9px] tracking-[0.3em] uppercase text-on-surface-variant/60">
                      {field.label}{field.required && <span className="ml-1 text-primary">*</span>}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      required={field.required}
                      className="w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm text-on-surface outline-none transition-colors duration-200 placeholder:text-on-surface-variant/30 focus:border-primary"
                      placeholder={field.label}
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-2 block font-label-caps text-[9px] tracking-[0.3em] uppercase text-on-surface-variant/60">
                    Nội dung <span className="text-primary">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full resize-none border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm text-on-surface outline-none transition-colors duration-200 placeholder:text-on-surface-variant/30 focus:border-primary"
                    placeholder="Nhập nội dung cần tư vấn..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 border border-primary/40 py-3.5 font-label-caps text-[11px] tracking-[0.22em] uppercase text-primary transition-all duration-300 hover:bg-primary hover:text-background disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      Gửi tin nhắn
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
