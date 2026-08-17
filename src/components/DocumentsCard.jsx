import {
  FileText,
  FilePen,
  CheckCircle2,
  Eye,
  Download,
  AlertCircle,
  IdCard,
} from 'lucide-react'

const DOC_ICONS = {
  personal_identity: IdCard,
}

function DocumentRow({ doc }) {
  const DocIcon = DOC_ICONS[doc.id] ?? FilePen

  return (
    <div
      className={
        doc.uploaded
          ? 'flex items-center gap-3 rounded-lg border border-[#00000040] border-line px-4 py-3'
          : 'flex items-center gap-3 rounded-lg border border-red-200 px-4 py-3'
      }
    >
      <DocIcon className="h-6 w-6 shrink-0 text-heading" strokeWidth={1.75} />

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-bold text-heading">{doc.title}</span>
        {doc.fileName && (
          <span dir="ltr" className="truncate text-start text-xs text-body">
            {doc.fileName}
          </span>
        )}
      </div>

      {doc.uploaded ? (
        <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-success">
          تم التحقق
        </span>
      ) : (
        <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-body">
          غير مرفوع
        </span>
      )}

      <button
        type="button"
        aria-label={doc.uploaded ? `عرض ${doc.title}` : `رفع ${doc.title}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-body transition-colors hover:text-heading"
      >
        {doc.uploaded ? (
          <Eye className="h-4 w-4" strokeWidth={2} />
        ) : (
          <Download className="h-4 w-4" strokeWidth={2} />
        )}
      </button>

      {doc.uploaded ? (
        <CheckCircle2 className="h-6 w-6 shrink-0 text-success" strokeWidth={2} />
      ) : (
        <AlertCircle className="h-6 w-6 shrink-0 text-amber-400" strokeWidth={2} />
      )}
    </div>
  )
}

export default function DocumentsCard({ documents }) {
  return (
    <section className="rounded-xl border border-[#00000040] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-center gap-2">
        <FileText className="h-6 w-6 text-[#F2762E] text-accent" strokeWidth={2} />
        <h2 className="text-lg font-bold text-heading">المستندات المرفوعة</h2>
      </div>
      <div className="flex flex-col gap-3">
        {documents.map((doc) => (
          <DocumentRow key={doc.id} doc={doc} />
        ))}
      </div>
    </section>
  )
}
