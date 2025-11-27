'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import LandingTasks from '@/components/LandingTasks';

export default function Home() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
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

            <main className="px-6 py-20 text-center flex flex-col items-center justify-center min-h-screen bg-gray-50">
<div className="max-w-3xl mx-auto">
<h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
Manage your tasks smartly & stay productive.
</h1>
<p className="text-gray-600 mt-4 text-lg">
Clean dashboard. Secure authentication. Everything you need to stay on track.
</p>


<div className="mt-8 flex justify-center gap-4">
<Link
href={user ? '/dashboard' : '/login'}
className="px-8 py-3 rounded-2xl bg-blue-600 text-white text-lg font-semibold shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all"
>
{user ? 'Go to Dashboard' : 'Get Started'}
</Link>
</div>
</div>


{user && (
<section className="mt-20 w-full max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
<div className="flex justify-between items-center mb-6">
<h2 className="text-3xl font-bold text-gray-800">Your Tasks</h2>
<Link
href="/dashboard/tasks/create"
className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 hover:shadow-lg transition-all"
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
