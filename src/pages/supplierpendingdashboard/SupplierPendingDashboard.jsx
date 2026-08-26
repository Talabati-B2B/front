import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  fetchUserProfile,
  toViewModel,
  updateProfileContact,
  viewProfileDocument,
  downloadProfileDocument,
  uploadProfileDocument,
  uploadProfileImage,
} from '../../services/profileService/profile'
import Sidebar from '../../components/Sidebar' // بدل Sidebar الجديد
import ProfileHeader from '../../components/ProfileHeader'
import DocumentsCard from '../../components/DocumentsCard'
import ContactCard from '../../components/ContactCard'
import NotesCard from '../../components/NotesCard'
import {
  ACCOUNT_STATUS,
  getAccountStatusForUser,
  resubmitApprovalAccountByEmail,
} from '../../services/accountApproval.mock'

function SupplierPendingDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState(null)
  const [approvalStatus, setApprovalStatus] = useState(
    () => getAccountStatusForUser(user) || ACCOUNT_STATUS.PENDING,
  )

  useEffect(() => {
    let active = true

    fetchUserProfile()
      .then((res) => {
        if (active) setProfile(toViewModel(res))
      })
      .catch((error) => {
        if (active) setProfileError(error)
      })

    return () => {
      active = false
    }
  }, [])

  const handleContactSubmit = (contact) => updateProfileContact(contact)

  const handleDocumentAction = (action, document, file) => {
    if (action === 'view') return viewProfileDocument(document)
    if (action === 'download') return downloadProfileDocument(document)
    return uploadProfileDocument(document, file)
  }

  const handleProfileImageChange = (file) => uploadProfileImage(file)

  if (profileError) {
    return <div className="sr-only" role="alert">تعذر تحميل بيانات الملف الشخصي.</div>
  }

  if (!profile) return null

  if (approvalStatus === ACCOUNT_STATUS.APPROVED) {
    return <Navigate to="/supplier-dashboard" replace />
  }

  const statusLabel =
    approvalStatus === ACCOUNT_STATUS.NEEDS_CHANGES
      ? 'تحتاج تعديلات'
      : 'قيد المراجعة'

  const displayProfile = {
    ...profile,
    fullName:
      `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || profile.fullName,
    initial: user?.firstName?.charAt(0) || profile.initial,
    email: user?.email || profile.email,
    statusLabel,
  }

  const handleResubmit = () => {
    const updated = resubmitApprovalAccountByEmail(displayProfile.email)
    if (updated) setApprovalStatus(updated.status)
  }

  return (
    <div className="min-h-screen flex bg-[#F5F6F8]" dir="rtl">
      <Sidebar />

      <main className="flex flex-1 flex-col gap-4 pb-8 pl-14 pr-3 pt-16">
        {approvalStatus === ACCOUNT_STATUS.NEEDS_CHANGES ? (
          <section className="flex flex-col gap-3 rounded-xl border border-[#F2C8AD] bg-[#FFF8F3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[14px] font-bold text-[#8A4318]">الحساب يحتاج إلى تعديلات</h2>
              <p className="mt-1 text-[12px] leading-6 text-[#8A664F]">
                حدّث البيانات أو المستندات المطلوبة ثم أعد إرسال الحساب للمراجعة.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResubmit}
              className="h-10 shrink-0 rounded-xl bg-[#F2762E] px-5 text-[12px] font-bold text-white transition hover:bg-[#DC6826]"
            >
              إعادة الإرسال للمراجعة
            </button>
          </section>
        ) : null}

        <ProfileHeader profile={displayProfile} onImageChange={handleProfileImageChange} />

        <div className="grid grid-cols-1 items-start gap-x-7 gap-y-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <ContactCard profile={displayProfile} onSubmit={handleContactSubmit} />
          </div>
          <div className="flex flex-col gap-4">
            <DocumentsCard documents={displayProfile.documents} onAction={handleDocumentAction} />
            <NotesCard />
          </div>
        </div>
      </main>
    </div>
  )
}

export default SupplierPendingDashboard
