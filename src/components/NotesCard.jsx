import { useState } from 'react'

const MAX_LENGTH = 500

export default function NotesCard() {
  const [notes, setNotes] = useState('')

  return (
    <section className="rounded-xl border border-[#00000040] border-line bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-heading">ملاحظات (اختياري)</h2>
      <div className="relative">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="اكتب ملاحظاتك هنا.."
          rows={7}
          className="w-full resize-none rounded-lg border border-[#00000040] bg-white p-4 pb-8 text-sm text-heading outline-none placeholder:text-body/60 focus:border-accent"
        />
        <span className="pointer-events-none absolute bottom-4 left-4 text-xs text-[#00000040]">
          {notes.length}/{MAX_LENGTH}
        </span>
      </div>
    </section>
  )
}
