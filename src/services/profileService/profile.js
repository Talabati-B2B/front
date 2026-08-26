import { api } from '../api'

// GET /api/user/profile — يرجّع { data: { user, role, current_status } }
// حيث user يحمل علاقة store (مع نوعه) أو supplier (مع تصنيفاته) والسجل التجاري.
export async function fetchUserProfile() {
  const res = await api.get('/api/user/profile')
  return res.data
}

const STATUS_LABELS = {
  pending: 'قيد المراجعة',
  under_review: 'قيد المراجعة',
  need_changes: 'تحتاج تعديلات',
  approved: 'تم الاعتماد',
  rejected: 'مرفوض',
}

const ROLE_LABELS = {
  store: 'متجر',
  supplier: 'مورد',
}

// أرقام لاتينية بأسماء أشهر عربية -> "07 يوليو 2026"
const dateFormatter = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

function fileNameFrom(path) {
  return path ? path.split('/').pop() : null
}

/**
 * تحويل رد السيرفر لشكل تقرأه بطاقات الملف الشخصي.
 * المتجر والمورد جدولان بأسماء أعمدة مختلفة، فنوحّدهما هنا مرة واحدة.
 */
export function toViewModel({ data }) {
  const user = data?.user ?? {}
  const role = data?.role ?? user.roles?.[0]?.name
  const isSupplier = role === 'supplier'
  const profile = (isSupplier ? user.supplier : user.store) ?? {}

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim()

  // نوع النشاط: نوع المتجر للمتاجر، وتصنيفات البضاعة للموردين
  const businessType = isSupplier
    ? (profile.categories ?? []).map((category) => category.name).join('، ')
    : profile.store_type?.name

  const status = data?.current_status ?? user.status

  return {
    fullName: fullName || '—',
    initial: (user.first_name ?? '').charAt(0),
    email: user.email ?? '',
    role,
    roleLabel: ROLE_LABELS[role] ?? role,
    status,
    statusLabel: STATUS_LABELS[status] ?? status,
    submissionDate: formatDate(user.created_at),

    businessName: (isSupplier ? profile.company_name : profile.store_name) || fullName || '—',
    location: (isSupplier ? profile.company_location : profile.store_location) || '—',

    // ProfileHeader يقرأ supplierType وصفحة انتظار المتجر تقرأ storeType
    supplierType: businessType || ROLE_LABELS[role] || '—',
    storeType: businessType || ROLE_LABELS[role] || '—',

    phone: user.phone ?? '',
    whatsapp: user.whatsapp ?? '',
    mobile: user.mobile ?? '',
    idNumber: user.ID_number ?? '',

    // ملاحظات الإدارة المحفوظة على سجل المتجر/المورد
    needChangesReason: profile.need_changes_reasons ?? null,
    rejectionReason: profile.rejected_reasons ?? null,

    documents: [
      {
        id: 'commercial_register',
        title: 'سجل تجاري',
        fileName: fileNameFrom(profile.commercial_register),
        url: profile.commercial_register_url ?? null,
        uploaded: Boolean(profile.commercial_register),
      },
      {
        id: 'personal_identity',
        title: 'الهوية الشخصية',
        fileName: fileNameFrom(user.personal_identity),
        url: null,
        uploaded: Boolean(user.personal_identity),
      },
    ],
  }
}

// ما زالت هذه العمليات بلا مسار مكتمل على السيرفر: مسار
// PUT /api/user/profile/update يشترط رفع الهوية الشخصية (وبيانات النشاط
// كاملة في حالة need_changes)، وهو نموذج تعديل مستقل لم يُبنَ بعد.
// نُبقيها محلية وصريحة بدل إيهام المستخدم بأن التعديل وصل للإدارة.
let localContact = { phone: '', whatsapp: '' }

export function updateProfileContact(contact) {
  localContact = { ...contact }
  return Promise.resolve({
    ok: true,
    persisted: false,
    source: 'local',
    data: { ...localContact },
  })
}

// عرض/تنزيل السجل التجاري يعملان فعلياً عبر الرابط القادم من السيرفر
export function viewProfileDocument(document) {
  if (!document?.url) {
    return Promise.resolve({ ok: false, code: 'NO_DOCUMENT', action: 'view', document })
  }

  window.open(document.url, '_blank', 'noopener,noreferrer')

  return Promise.resolve({ ok: true, action: 'view', document })
}

export function downloadProfileDocument(document) {
  return viewProfileDocument(document)
}

export function uploadProfileDocument(document, file) {
  return Promise.resolve({
    ok: false,
    code: 'API_NOT_CONNECTED',
    action: 'upload',
    document,
    file,
  })
}

export function uploadProfileImage(file) {
  return Promise.resolve({
    ok: false,
    code: 'API_NOT_CONNECTED',
    action: 'profile-image',
    file,
  })
}
