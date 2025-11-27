'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef, useState } from 'react';

const Navbar = ({ toggleSidebar }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6 justify-between z-20 relative">

      
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Menu size={24} />
        </button>

        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          NexaBoard
        </Link>
      </div>

      {/* RIGHT: User or Auth Links */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-3 focus:outline-none hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
            >
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">{user.username || user.name || 'user'}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {user.avatar || user.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
              </div>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl py-2 border border-gray-100 animate-fade-in z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.username || user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm flex items-center gap-2 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User size={16} />
                  Update Profile
                </Link>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                    router.push('/login');
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm flex items-center gap-2 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
