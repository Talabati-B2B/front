import { useState } from 'react'
import { Phone } from 'lucide-react'

function PalestineFlag() {
  return (
    <svg viewBox="0 0 21 14" className="h-3.5 w-5 rounded-xs" aria-hidden="true">
      <rect width="21" height="14" fill="#fff" />
      <rect width="21" height="4.67" fill="#000" />
      <rect y="9.33" width="21" height="4.67" fill="#007a3d" />
      <path d="M0 0 L7.5 7 L0 14 Z" fill="#ce1126" />
    </svg>
  )
}

export default function ContactCard({ profile }) {
  const [phone, setPhone] = useState(profile.phone)
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp)

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#F10000BF] bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-heading">معلومات الاتصال</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-bold text-heading">
            رقم الهاتف <span className="text-accent text-[#F10000BF]">*</span>
          </label>
          <div className="flex items-center gap-2 rounded-full border border-line-dark bg-white px-4 py-2.5 focus-within:border-accent">
            <input
              id="phone"
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0590000000"
              className="w-full bg-transparent text-end text-sm text-heading outline-none placeholder:text-line-dark"
            />
            <Phone className="h-4 w-4 shrink-0 text-body" strokeWidth={2} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="whatsapp" className="text-sm font-bold text-heading">
            رقم الواتساب <span className="text-accent text-[#F10000BF]">*</span>
          </label>
          <div className="flex items-center overflow-hidden rounded-full border border-line-dark bg-white focus-within:border-accent">
            <input
              id="whatsapp"
              type="tel"
              dir="ltr"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="590000000"
              className="w-full bg-transparent px-4 py-2.5 text-end text-sm text-heading outline-none placeholder:text-line-dark"
            />
            <span
              dir="ltr"
              className="flex items-center gap-1.5 self-stretch border-s border-line-dark bg-gray-50 px-3 text-sm font-semibold text-heading"
            >
              <PalestineFlag />
              +970
            </span>
          </div>
        </div>

        <div className="mt-2 flex justify-center">
          <button
            type="submit"
            className="rounded-lg bg-[#F2762E] px-10 py-2.5 text-sm font-bold text-[#000000] transition-colors"
          >
            حفظ
          </button>
        </div>
      </form>
    </section>
  )
}
