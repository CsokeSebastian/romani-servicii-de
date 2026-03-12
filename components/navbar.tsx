import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Servicii Pentru Români"
              width={120}
              height={120}
              className="h-12 w-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition">
              Acasă
            </Link>
            <Link href="/adauga-afacere" className="text-gray-700 hover:text-gray-900 transition">
              Adaugă Afacere
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
