import { useEffect, useState } from 'react'
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

function SupplierPendingDashboard() {
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState(null)

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

  if (profileError) {
    return <div className="sr-only" role="alert">تعذر تحميل بيانات الملف الشخصي.</div>
  }

  return (
    <div className="min-h-screen flex bg-[#F5F6F8]" dir="rtl">
      <Sidebar />

      <main className="flex flex-1 flex-col gap-4 pb-8 pl-14 pr-3 pt-16">
        <ProfileHeader profile={profile} onImageChange={handleProfileImageChange} />

        <div className="grid grid-cols-1 items-start gap-x-7 gap-y-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <ContactCard profile={profile} onSubmit={handleContactSubmit} />
          </div>
          <div className="flex flex-col gap-4">
            <DocumentsCard documents={profile.documents} onAction={handleDocumentAction} />
            <NotesCard />
          </div>
        </div>
      </main>
    </div>
  )
}

export default SupplierPendingDashboard
