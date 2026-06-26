import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'FundiConnect – Find Skilled Technicians Near You',
  description: 'Book verified electricians, plumbers, carpenters, painters, and more on demand across Tanzania.',
  keywords: 'fundi, technician, electrician, plumber, carpenter, Tanzania, home services',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </AuthProvider>
      </body>
    </html>
  );
}
