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

function DocumentRow({ doc, onAction }) {
  const DocIcon = DOC_ICONS[doc.id] ?? FilePen

  return (
    <div
      className={
        doc.uploaded
          ? 'flex min-h-20 items-center gap-3 rounded-2xl border border-[#C4C6D0] px-4 py-3'
          : 'flex min-h-20 items-center gap-3 rounded-2xl border border-red-200 px-4 py-3'
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

      {doc.uploaded ? (
  <button
    type="button"
    aria-label={`عرض ${doc.title}`}
    onClick={() => onAction?.('view', doc)}
    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-body transition-colors hover:text-heading"
  >
    <Eye className="h-4 w-4" strokeWidth={2} />
  </button>
) : (
  <>
    <input
      id={`document-upload-${doc.id}`}
      type="file"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) {
          onAction?.('upload', doc, file)
        }
      }}
    />

    <button
      type="button"
      aria-label={`رفع ${doc.title}`}
      onClick={() =>
        document.getElementById(`document-upload-${doc.id}`)?.click()
      }
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-body transition-colors hover:text-heading"
    >
      <Download className="h-4 w-4" strokeWidth={2} />
    </button>
  </>
)}

      {doc.uploaded ? (
        <CheckCircle2 className="h-6 w-6 shrink-0 text-success" strokeWidth={2} />
      ) : (
        <AlertCircle className="h-6 w-6 shrink-0 text-amber-400" strokeWidth={2} />
      )}
    </div>
  )
}

export default function DocumentsCard({ documents, onAction }) {
  return (
    <section className="rounded-[20px] border border-[#00000040] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-center gap-2">
        <FileText className="h-6 w-6 text-[#F2762E] text-accent" strokeWidth={2} />
        <h2 className="text-lg font-bold text-heading">المستندات المرفوعة</h2>
      </div>
      <div className="flex flex-col gap-3">
        {documents.map((doc) => (
          <DocumentRow key={doc.id} doc={doc} onAction={onAction} />
        ))}
      </div>
    </section>
  )
}
