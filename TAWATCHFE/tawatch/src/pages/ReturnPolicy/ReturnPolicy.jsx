import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'

const POLICIES = [
  {
    icon: 'published_with_changes',
    title: '1 Đổi 1 Trong 7 Ngày',
    desc: 'Đổi mới miễn phí 100% đối với các sản phẩm có lỗi từ nhà sản xuất hoặc hư hỏng trong quá trình vận chuyển.',
  },
  {
    icon: 'verified_user',
    title: 'Bảo Hành Chính Hãng',
    desc: 'Cam kết 100% đồng hồ chính hãng với gói bảo hành từ 2 đến 5 năm tại trung tâm kỹ thuật TAWatch.',
  },
  {
    icon: 'local_shipping',
    title: 'Hỗ Trợ Ship 2 Chiều',
    desc: 'TAWatch chịu hoàn toàn chi phí vận chuyển 2 chiều đối với các trường hợp sản phẩm bị lỗi hoặc giao sai mẫu.',
  },
  {
    icon: 'currency_exchange',
    title: 'Hoàn Tiền Rõ Ràng',
    desc: 'Hoàn trả lại 100% tiền qua hình thức chuyển khoản ngân hàng nếu không có sản phẩm thay thế phù hợp.',
  },
]

const STEPS = [
  {
    step: '01',
    title: 'Gửi yêu cầu đổi trả',
    desc: 'Điền form đăng ký trực tuyến bên dưới hoặc liên hệ Hotline/Zalo chăm sóc khách hàng của TAWatch.',
    icon: 'edit_note',
  },
  {
    step: '02',
    title: 'Xác nhận & Hướng dẫn',
    desc: 'Chuyên viên kỹ thuật sẽ kiểm tra thông tin và hướng dẫn bạn đóng gói gửi sản phẩm về showroom.',
    icon: 'support_agent',
  },
  {
    step: '03',
    title: 'Gửi hàng về TAWatch',
    desc: 'Bạn gửi đồng hồ kèm đầy đủ phụ kiện, hộp sổ, thẻ bảo hành và hóa đơn mua hàng về địa chỉ cửa hàng.',
    icon: 'markunread_mailbox',
  },
  {
    step: '04',
    title: 'Thực hiện Đổi/Hoàn tiền',
    desc: 'Sau khi thẩm định (trong 24-48h), TAWatch sẽ tiến hành giao đồng hồ mới hoặc hoàn tiền cho bạn.',
    icon: 'task_alt',
  },
]

const FAQS = [
  {
    q: 'Thời gian áp dụng chính sách đổi trả là bao lâu?',
    a: 'Bạn có thể yêu cầu đổi hàng trong vòng 7 ngày kể từ ngày nhận hàng được xác nhận trên hệ thống vận chuyển.',
  },
  {
    q: 'Điều kiện để sản phẩm được chấp nhận đổi trả là gì?',
    a: 'Sản phẩm còn nguyên tem mác, seal bảo vệ, đầy đủ hộp sổ phụ kiện, thẻ bảo hành và không có dấu hiệu bị trầy xước, va đập hoặc tự ý tháo mở máy.',
  },
  {
    q: 'Tôi mua đồng hồ làm quà tặng có được đổi mẫu khác không?',
    a: 'Có. TAWatch hỗ trợ đổi mẫu đồng giá hoặc có giá trị cao hơn (bù phần chênh lệch) trong vòng 7 ngày kể từ khi nhận hàng.',
  },
  {
    q: 'Phí vận chuyển khi đổi trả được tính như thế nào?',
    a: 'Nếu do lỗi sản phẩm hoặc giao sai đơn, TAWatch miễn phí 100% ship. Trường hợp đổi theo nhu cầu cá nhân (đổi màu/size), khách hàng vui lòng thanh toán phí ship 2 chiều.',
  },
  {
    q: 'Thời gian xử lý hoàn tiền mất bao lâu?',
    a: 'Sau khi nhận và kiểm định hàng trả về đúng điều kiện, TAWatch sẽ hoàn tiền vào tài khoản ngân hàng của bạn trong vòng 24 đến 48 giờ làm việc.',
  },
]

export default function ReturnPolicy() {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx)
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="pt-24 pb-section-gap-desktop">
        {/* Header Hero */}
        <section className="relative flex flex-col justify-center border-b border-outline-variant/10 px-8 py-16 md:px-[80px]">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative mx-auto w-full max-w-7xl">
            <p className="mb-2 font-label-caps text-[10px] tracking-[0.35em] text-primary uppercase">
              Hỗ Trợ Khách Hàng
            </p>
            <h1 className="font-headline-md text-3xl md:text-4xl tracking-[0.1em] uppercase text-on-surface">
              Chính Sách Đổi Trả & Bảo Hành
            </h1>
            <p className="mt-4 max-w-2xl font-body-md text-sm text-on-surface-variant leading-relaxed">
              Cam kết mang đến trải nghiệm an tâm tuyệt đối khi mua sắm tại TAWatch. Mọi sản phẩm đều được áp dụng chính sách đổi trả minh bạch và quyền lợi bảo hành cao cấp.
            </p>
            <div className="mt-6 h-px w-20 bg-gradient-to-r from-primary to-transparent" />
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-8 md:px-[80px]">

          {/* Highlights Grid */}
          <section className="py-16">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {POLICIES.map((p) => (
                <div
                  key={p.title}
                  className="group border border-outline-variant/10 bg-surface-container-low p-6 transition-all duration-300 hover:border-primary/40 hover:bg-surface-container"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center border border-outline-variant/20 group-hover:border-primary/40 group-hover:bg-primary/10">
                    <span className="material-symbols-outlined text-2xl text-primary">{p.icon}</span>
                  </div>
                  <h3 className="mb-2 font-label-caps text-xs tracking-[0.15em] uppercase text-on-surface">
                    {p.title}
                  </h3>
                  <p className="font-body-md text-xs leading-relaxed text-on-surface-variant">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Process 4 Steps */}
          <section className="border-t border-outline-variant/10 py-16">
            <div className="mb-12">
              <p className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-primary">
                Quy Trình 4 Bước
              </p>
              <h2 className="mt-2 font-headline-sm text-2xl uppercase tracking-[0.1em] text-on-surface">
                Hướng Dẫn Đổi Trả Dễ Dàng
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <div key={s.step} className="relative border border-outline-variant/10 bg-surface-container-low p-6">
                  <span className="absolute right-4 top-4 font-headline-md text-3xl text-outline-variant/20 font-bold">
                    {s.step}
                  </span>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center border border-primary/30 bg-primary/10">
                    <span className="material-symbols-outlined text-lg text-primary">{s.icon}</span>
                  </div>
                  <h4 className="mb-2 font-label-caps text-xs tracking-[0.15em] uppercase text-on-surface">
                    {s.title}
                  </h4>
                  <p className="font-body-md text-xs leading-relaxed text-on-surface-variant">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Detailed Conditions & Rules */}
          <section className="grid grid-cols-1 gap-12 border-t border-outline-variant/10 py-16 lg:grid-cols-2">
            <div className="border border-outline-variant/10 bg-surface-container-low p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-primary">check_circle</span>
                <h3 className="font-label-caps text-sm tracking-[0.2em] uppercase text-on-surface">
                  Trường Hợp Đã Được Đổi Trả
                </h3>
              </div>
              <ul className="space-y-4 font-body-md text-xs text-on-surface-variant leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm text-primary">done</span>
                  <span>Sản phẩm bị lỗi kỹ thuật từ nhà sản xuất (hỏng máy, lệch kim, đứt dây khóa...).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm text-primary">done</span>
                  <span>Sản phẩm bị nứt vỡ, trầy xước trong quá trình giao hàng.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm text-primary">done</span>
                  <span>Giao sai model, sai màu sắc hoặc kích thước so với đơn đặt hàng.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm text-primary">done</span>
                  <span>Khách hàng có nhu cầu đổi sang mẫu khác có giá trị bằng hoặc cao hơn trong 7 ngày.</span>
                </li>
              </ul>
            </div>

            <div className="border border-outline-variant/10 bg-surface-container-low p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-red-400">cancel</span>
                <h3 className="font-label-caps text-sm tracking-[0.2em] uppercase text-on-surface">
                  Trường Hợp Không Áp Dụng Đổi Trả
                </h3>
              </div>
              <ul className="space-y-4 font-body-md text-xs text-on-surface-variant leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm text-red-400 font-bold">close</span>
                  <span>Quá thời hạn 7 ngày kể từ khi nhận hàng.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm text-red-400 font-bold">close</span>
                  <span>Sản phẩm bị mất seal, tem mác, trầy xước do va đập hoặc va chạm trong quá trình sử dụng.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm text-red-400 font-bold">close</span>
                  <span>Không còn nguyên vẹn hộp, phụ kiện, thẻ bảo hành chính hãng đi kèm.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm text-red-400 font-bold">close</span>
                  <span>Sản phẩm bị can thiệp, tự ý tháo mở hoặc sửa chữa tại đơn vị ngoài.</span>
                </li>
              </ul>
            </div>
          </section>



          {/* FAQ Accordion */}
          <section className="border-t border-outline-variant/10 py-16">
            <div className="mb-10 text-center">
              <p className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-primary">
                GIẢI ĐÁP THẮC MẮC
              </p>
              <h3 className="mt-2 font-headline-sm text-2xl uppercase tracking-[0.1em] text-on-surface">
                Câu Hỏi Thường Gặp
              </h3>
            </div>

            <div className="mx-auto max-w-3xl space-y-4">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div
                    key={faq.q}
                    className="border border-outline-variant/10 bg-surface-container-low transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="flex w-full items-center justify-between p-5 text-left font-label-caps text-xs tracking-[0.1em] text-on-surface"
                    >
                      <span>{faq.q}</span>
                      <span className="material-symbols-outlined text-primary text-lg">
                        {isOpen ? 'remove' : 'add'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-outline-variant/10 p-5 font-body-md text-xs text-on-surface-variant leading-relaxed bg-surface-container-lowest">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Direct contact CTA */}
          <section className="mt-8 border border-primary/30 bg-primary/5 p-8 text-center">
            <h4 className="font-headline-sm text-xl uppercase tracking-[0.1em] text-on-surface">
              Cần Hỗ Trợ Đổi Trả Trực Tiếp?
            </h4>
            <p className="mt-2 font-body-md text-xs text-on-surface-variant">
              Hotline CSKH: <strong className="text-primary">+84 (028) 3822 1234</strong> | Email: <strong className="text-primary">support@tawatch.vn</strong>
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                to="/lien-he"
                className="border border-primary px-6 py-2.5 font-label-caps text-[9px] tracking-[0.2em] uppercase text-primary hover:bg-primary hover:text-background transition-colors"
              >
                Trang Liên Hệ
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
