'use client';

import { useAuth } from '@/context/AuthContext';
import { Bell, ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '../ui/Button';

const serviceCategories = [
  'Electrical',
  'Plumbing',
  'Carpentry',
  'Painting',
  'AC Repair',
  'Mechanics',
  'Computer Repair',
];

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/technicians', label: 'Technicians' },
  { href: '/how-it-works', label: 'How It Works' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const dashboardHref =
    user?.role === 'admin' ? '/admin/dashboard' :
    user?.role === 'technician' ? '/dashboard/technician' :
    '/dashboard/customer';

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#1D234F] shadow-lg" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#FFD530] rounded-lg flex items-center justify-center">
              <span className="text-[#1D234F] font-black text-sm">FC</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">FundiConnect</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-[#FFD530]' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Services dropdown */}
            <div className="relative">
              <button
                onClick={() => setServicesOpen((o) => !o)}
                onBlur={() => setTimeout(() => setServicesOpen(false), 150)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  pathname === '/services' ? 'text-[#FFD530]' : 'text-gray-300 hover:text-white'
                }`}
                aria-haspopup="true"
                aria-expanded={servicesOpen}
              >
                Services
                <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  {serviceCategories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/technicians?search=${encodeURIComponent(cat)}`}
                      onClick={() => setServicesOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1C9AD6] transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/notifications" aria-label="Notifications">
                  <Bell className="w-5 h-5 text-gray-300 hover:text-white transition-colors" />
                </Link>
                <Link href={dashboardHref}>
                  <div className="flex items-center gap-2 text-white text-sm hover:text-[#FFD530] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#1C9AD6] flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:block">{user.name}</span>
                  </div>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}
                  className="border-gray-400 text-gray-200 hover:border-white hover:text-white hover:bg-transparent">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-gray-200 hover:text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="secondary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#161b3d] border-t border-white/10 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 ${pathname === link.href ? 'text-[#FFD530]' : 'text-gray-300'}`}>
              {link.label}
            </Link>
          ))}

          {/* Services in mobile */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Services</p>
            <div className="grid grid-cols-2 gap-1">
              {serviceCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/technicians?search=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-gray-300 hover:text-[#FFD530] py-1 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <hr className="border-white/10" />
          {user ? (
            <>
              <Link href={dashboardHref} onClick={() => setMobileOpen(false)}
                className="block text-sm text-white py-2">Dashboard</Link>
              <button onClick={handleLogout} className="block text-sm text-red-400 py-2 w-full text-left">Logout</button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full border-gray-400 text-gray-200">Login</Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
