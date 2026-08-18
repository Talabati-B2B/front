// Mock of: Route::get('/user/profile', [UserProfileController::class, 'show']);
// Swap fetchUserProfile's body for a real fetch('/user/profile') call when the API is wired up.
const response = {
  status: 'success',
  data: {
    user: {
      id: 15,
      first_name: 'احمد',
      last_name: 'محمد اسامة',
      email: 'ahmedmohammed@gmail.com',
      email_verified_at: '2026-07-07T13:45:30.000000Z',
      phone: null,
      mobile: '555587',
      whatsapp: null,
      personal_identity: null,
      approved_by: null,
      approved_at: null,
      status: 'pending',
      ID_number: '963258',
      created_at: '2026-07-07T13:45:31.000000Z',
      updated_at: '2026-07-07T13:45:31.000000Z',
      roles: [{ name: 'store' }],
      store: {
        id: 3,
        store_name: 'شاورما فهد',
        store_location: 'غزة الرمال',
        commercial_register: 'uploads/store/commercial_register.jpg',
      },
    },
    current_status: 'pending',
  },
}

export function fetchUserProfile() {
  return Promise.resolve(response)
}

const STATUS_LABELS = {
  pending: 'قيد المراجعة',
  approved: 'تم الاعتماد',
  rejected: 'مرفوض',
}

const ROLE_LABELS = {
  store: 'شركة',
}

// Latin digits with Arabic month names -> "07 يوليو 2026"
const dateFormatter = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

export function toViewModel({ data }) {
  const { user } = data
  const role = user.roles?.[0]?.name

  return {
    fullName: `${user.first_name} ${user.last_name}`,
    initial: user.first_name?.charAt(0) ?? '',
    email: user.email,
    statusLabel: STATUS_LABELS[data.current_status] ?? data.current_status,
    submissionDate: dateFormatter.format(new Date(user.created_at)),
    supplierType: ROLE_LABELS[role] ?? role,
    location: user.store?.store_location ?? '—',
    phone: user.phone ?? '',
    whatsapp: user.whatsapp ?? '',
    documents: [
      {
        id: 'commercial_register',
        title: 'سجل تجاري',
        fileName: user.store?.commercial_register?.split('/').pop() ?? null,
        uploaded: Boolean(user.store?.commercial_register),
      },
      {
        id: 'proof_of_ownership',
        title: 'إثبات ملكية',
        fileName: null,
        uploaded: false,
      },
      {
        id: 'personal_identity',
        title: 'الهوية الشخصية',
        fileName: user.personal_identity?.split('/').pop() ?? null,
        uploaded: Boolean(user.personal_identity),
      },
    ],
  }
}

// Local-only state boundaries for the pending-profile UI.
// Replace these implementations with the confirmed Supplier API later.
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

export function viewProfileDocument(document) {
  return Promise.resolve({
    ok: false,
    code: 'API_NOT_CONNECTED',
    action: 'view',
    document,
  })
}

export function downloadProfileDocument(document) {
  return Promise.resolve({
    ok: false,
    code: 'API_NOT_CONNECTED',
    action: 'download',
    document,
  })
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
