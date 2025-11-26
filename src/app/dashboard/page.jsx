'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { CheckSquare, TrendingUp, Clock, AlertCircle, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('/tasks');
                const total = data.length;
                const completed = data.filter(t => t.status === 'completed').length;
                const pending = data.filter(t => t.status === 'pending').length;

                const now = new Date();
                const overdue = data.filter(t => {
                    if (t.status === 'completed') return false;
                    if (!t.dueDate) return false;
                    return new Date(t.dueDate) < now;
                }).length;

                setStats({ total, completed, pending, overdue });

                setRecentTasks(data.slice(0, 5));
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Welcome back, {user?.name || user?.username || 'user'}!
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Here's what's happening with your tasks today.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/tasks/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap"
                    >
                        + New Task
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Tasks" value={stats.total} icon={<CheckSquare size={20} />} bg="bg-blue-50" iconColor="text-blue-600" />
                <StatCard label="Completed" value={stats.completed} icon={<TrendingUp size={20} />} bg="bg-green-50" iconColor="text-green-600" />
                <StatCard label="Pending" value={stats.pending} icon={<Clock size={20} />} bg="bg-yellow-50" iconColor="text-yellow-600" />
                <StatCard label="Overdue" value={stats.overdue} icon={<AlertCircle size={20} />} bg="bg-red-50" iconColor="text-red-600" />
            </div>

            {/* Recent Tasks Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
                    <Link href="/dashboard/tasks" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View all
                    </Link>
                </div>

                {recentTasks.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center">No tasks yet. Create your first task!</p>
                ) : (
                    <div className="space-y-4">
                        {recentTasks.map((task) => (
                            <div
                                key={task._id}
                                className="p-4 border rounded-lg hover:bg-gray-50 transition-all flex justify-between items-center"
                            >
                                {/* LEFT SIDE */}
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{task.title}</h3>

                                    {/* STATUS & PRIORITY */}
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${task.status === 'completed'
                                                ? 'bg-green-100 text-green-700'
                                                : task.status === 'in-progress'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {task.status}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${task.priority === 'high'
                                                ? 'bg-red-100 text-red-700'
                                                : task.priority === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>

                                {/* RIGHT SIDE DATE */}
                                {task.dueDate && (
                                    <div className="flex items-center gap-1 text-xs text-gray-600 ml-4">
                                        <CalendarDays size={18} />
                                        <span>
                                            {new Date(task.dueDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, bg, iconColor }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
                <div className={`p-2 ${bg} rounded-lg`}>
                    <div className={iconColor}>{icon}</div>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}
