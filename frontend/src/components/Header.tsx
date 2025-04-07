
"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-black text-white py-4 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-10 shadow-md">
      
      <Link href="/" className="text-2xl font-bold hover:text-gray-300 transition-colors">
        Keep Notes
      </Link>

      <nav className="flex items-center space-x-6">
        <Link href="/about" className="hover:text-gray-300 transition-colors">
          About
        </Link>
        <Link href="/notes" className="hover:text-gray-300 transition-colors">
          Notes
        </Link>
        <Link href="/account" className="hover:text-gray-300 transition-colors">
          Account
        </Link>
        {isAuthenticated ? (
          <button
            onClick={logout}
            className="hover:text-gray-300 transition-colors focus:outline-none"
          >
            Logout
          </button>
        ) : (
          <Link href="/login" className="hover:text-gray-300 transition-colors">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}