'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-primary-600 tracking-tight hover:text-primary-700 transition-colors"
        >
          JangaRoo
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-8">
          <Link
            href="/book"
            className="text-gray-700 font-medium hover:text-primary-600 transition-colors"
          >
            Book a Class
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-gray-700 font-medium hover:text-primary-600 transition-colors"
          >
            Admin
          </Link>
          <Link
            href="/book"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-200 ${
              menuOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-200 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-200 ${
              menuOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          <Link
            href="/book"
            className="text-gray-700 font-medium hover:text-primary-600 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Book a Class
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-gray-700 font-medium hover:text-primary-600 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </Link>
          <Link
            href="/book"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm text-center"
            onClick={() => setMenuOpen(false)}
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  )
}
