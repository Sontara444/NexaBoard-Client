'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import LandingTasks from '@/components/LandingTasks';

export default function Home() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* HEADER */}
            <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    NexaBoard
                </div>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full text-lg font-semibold">
                            {user.avatar}
                        </span>

                        <Link href="/dashboard" className="text-blue-600 font-medium hover:underline">
                            Dashboard
                        </Link>

                        <button onClick={logout} className="text-red-600 hover:underline">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2">
                            Login
                        </Link>

                        <Link
                            href="/register"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </header>

            {/* HERO SECTION */}
            <main className="px-6 py-20 text-center">
                <h1 className="text-4xl font-bold text-gray-800">
                    Manage your tasks smartly & stay productive.
                </h1>
                <p className="text-gray-500 mt-3">
                    Clean dashboard. Secure authentication. Everything you need.
                </p>

                <div className="mt-6 flex justify-center gap-4">
                    <Link
                        href={user ? '/dashboard' : '/login'}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        {user ? 'Go to Dashboard' : 'Get Started'}
                    </Link>
                </div>

                {/* SHOW TASKS IF LOGGED IN */}
                {user && (
                    <section className="mt-20 w-full max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>

                            <Link
                                href="/dashboard/tasks/create"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                + New Task
                            </Link>
                        </div>

                        <LandingTasks />
                    </section>
                )}
            </main>
        </div>
    );
}
