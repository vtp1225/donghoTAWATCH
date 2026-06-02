import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import AdminTopBar from '../components/admin/AdminTopBar'

export default function AdminLayout() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-surface-container-highest/20 rounded-full blur-[100px]" />
      </div>

      <Sidebar />
      <AdminTopBar />
      <Outlet />
    </div>
  )
}
