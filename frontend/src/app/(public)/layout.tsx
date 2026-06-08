import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 pb-12">{children}</main>
      <Footer />
    </div>
  );
}
