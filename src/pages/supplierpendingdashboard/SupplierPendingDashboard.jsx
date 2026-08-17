import { useEffect, useState } from 'react'
import { fetchUserProfile, toViewModel } from '../../services/profileService/profile'
import Sidebar from '../../components/Sidebar' // بدل Sidebar الجديد
import ProfileHeader from '../../components/ProfileHeader'
import DocumentsCard from '../../components/DocumentsCard'
import ContactCard from '../../components/ContactCard'
import NotesCard from '../../components/NotesCard'

function SupplierPendingDashboard() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    fetchUserProfile().then((res) => setProfile(toViewModel(res)))
  }, [])

  if (!profile) return null

  return (
    <div className="min-h-screen bg-page flex">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-6 p-8">
        <ProfileHeader profile={profile} />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <ContactCard profile={profile} />
            <NotesCard />
          </div>
          <div className="flex flex-col gap-6">
            <DocumentsCard documents={profile.documents} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default SupplierPendingDashboard