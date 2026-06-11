'use client';

import DashboardSidebar from '@/components/layout/DashboardSidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { Bell, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function DashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const dashboardHref =
    user?.role === 'admin' ? '/admin/dashboard' :
    user?.role === 'technician' ? '/dashboard/technician' :
    '/dashboard/customer';

  const notifHref =
    user?.role === 'technician' ? '/dashboard/technician/notifications' :
    '/dashboard/customer/notifications';

  return (
    <header className="h-16 bg-[#1D234F] flex items-center px-4 gap-4 shrink-0 z-40 shadow-md">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 bg-[#FFD530] rounded-lg flex items-center justify-center">
          <span className="text-[#1D234F] font-black text-sm">FC</span>
        </div>
        <span className="text-white font-bold text-lg hidden sm:block">FundiConnect</span>
      </Link>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <Link href={notifHref} aria-label="Notifications"
          className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5" />
        </Link>

        <Link href={dashboardHref} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1C9AD6] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {(user?.avatar_url || user?.avatar) ? (
              <img src={user.avatar_url || user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-white text-xs font-semibold leading-tight">{user?.name}</p>
            <p className="text-gray-400 text-[11px] capitalize">{user?.role}</p>
          </div>
        </Link>

        <button
          onClick={async () => { await logout(); router.push('/'); }}
          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push('/auth/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (isLoading) return <LoadingSpinner fullPage />;
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Top header — full width */}
      <DashboardHeader onMenuClick={() => setMobileOpen(true)} />

      {/* Sidebar + content row */}
      <div className="flex flex-1 min-h-0">
        <DashboardSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
