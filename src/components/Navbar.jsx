'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const Navbar = ({ toggleSidebar }) => {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6 justify-between z-10 relative">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="md:hidden text-gray-600">
                    <Menu size={24} />
                </button>

                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    NexaBoard
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 focus:outline-none"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-blue-700 transition-colors">
                                {user.avatar || user.username?.charAt(0).toUpperCase()}
                            </div>
                        </button>

                        {dropdownOpen && (
                            <>
                                {/* CLOSE WHEN CLICK OUTSIDE */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setDropdownOpen(false)}
                                ></div>

                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-20">

                                    <Link
                                        href="/dashboard/profile"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm flex items-center gap-2"
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
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>

                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                            Login
                        </Link>

                        <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
