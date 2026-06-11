'use client';

import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import {
  BarChart3, Bell, BookOpen, ChevronLeft, ChevronRight,
  Compass, CreditCard, Grid3X3, LayoutDashboard, MessageSquare,
  Settings, Star, User, Users, Wrench, X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const customerLinks = [
  { href: '/dashboard/customer',               icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/customer/bookings',      icon: BookOpen,        label: 'My Bookings' },
  { href: '/dashboard/customer/technicians',   icon: Compass,         label: 'Find Technicians' },
  { href: '/dashboard/customer/notifications', icon: Bell,            label: 'Notifications' },
  { href: '/dashboard/customer/profile',       icon: User,            label: 'Profile' },
];

const technicianLinks = [
  { href: '/dashboard/technician',               icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/technician/jobs',          icon: BookOpen,        label: 'My Jobs' },
  { href: '/dashboard/technician/wallet',        icon: CreditCard,      label: 'Wallet' },
  { href: '/dashboard/technician/earnings',      icon: BarChart3,       label: 'Earnings' },
  { href: '/dashboard/technician/reviews',       icon: Star,            label: 'Reviews' },
  { href: '/dashboard/technician/notifications', icon: Bell,            label: 'Notifications' },
  { href: '/dashboard/technician/profile',       icon: User,            label: 'Profile' },
];

const adminLinks = [
  { href: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/users',        icon: Users,           label: 'Users' },
  { href: '/admin/technicians',  icon: Wrench,          label: 'Technicians' },
  { href: '/admin/bookings',     icon: BookOpen,        label: 'Bookings' },
  { href: '/admin/categories',   icon: Grid3X3,         label: 'Categories' },
  { href: '/admin/reviews',      icon: Star,            label: 'Reviews' },
  { href: '/admin/complaints',   icon: MessageSquare,   label: 'Complaints' },
  { href: '/admin/revenue',      icon: BarChart3,       label: 'Revenue' },
  { href: '/admin/withdrawals',  icon: CreditCard,          label: 'Withdrawals' },
  { href: '/admin/settings',     icon: Settings,        label: 'Settings' },
];

function NavLinks({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  const { user } = useAuth();
  const pathname = usePathname();

  const links =
    user?.role === 'admin' ? adminLinks
    : user?.role === 'technician' ? technicianLinks
    : customerLinks;

  return (
    <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5" aria-label="Dashboard navigation">
      {!collapsed && (
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 px-3 mb-3">
          {user?.role === 'admin' ? 'Administration' : user?.role === 'technician' ? 'Technician Panel' : 'Customer Panel'}
        </p>
      )}
      {links.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href.length > 1 && pathname.startsWith(href + '/'));
        return (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150',
              collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5',
              active
                ? 'bg-[#FFD530] text-[#1D234F]'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-[#1D234F] text-white shrink-0 transition-all duration-300 border-r border-white/10',
          collapsed ? 'w-16' : 'w-56'
        )}
      >
        {/* Collapse toggle */}
        <div className="flex items-center justify-end px-2 py-2 border-b border-white/10">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        <NavLinks collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="absolute left-0 top-0 bottom-0 w-56 bg-[#1D234F] text-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <span className="text-white font-bold text-sm">Menu</span>
              <button onClick={onMobileClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close menu">
                <X className="w-4 h-4" />
              </button>
            </div>
            <NavLinks collapsed={false} onClose={onMobileClose} />
          </div>
        </div>
      )}
    </>
  );
}
