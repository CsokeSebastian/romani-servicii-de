import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Servicii Pentru Români"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm">
              Directorul de servicii pentru comunitatea română din Germania
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Link-uri Rapide</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-gray-400 transition">
                  Acasă
                </Link>
              </li>
              <li>
                <Link href="/categorii" className="hover:text-gray-400 transition">
                  Categorii
                </Link>
              </li>
              <li>
                <Link href="/servicii" className="hover:text-gray-400 transition">
                  Toate Serviciile
                </Link>
              </li>
              <li>
                <Link href="/adauga-afacere" className="hover:text-gray-400 transition">
                  Adaugă Afacere
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Informații</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-gray-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="hover:text-gray-400 transition">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-gray-400 transition">
                  Datenschutzerklärung
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@serviciipentruromani.de</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Servicii Pentru Români. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
}
