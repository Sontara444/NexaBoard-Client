'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import TaskCard from '@/components/TaskCard';
import { Search, Filter } from 'lucide-react';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        let result = tasks;

        if (searchTerm) {
            result = result.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            result = result.filter(task => task.status === filterStatus);
        }

        setFilteredTasks(result);
    }, [tasks, searchTerm, filterStatus]);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks');
            setTasks(data);
            setFilteredTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${id}`);
                setTasks(tasks.filter(t => t._id !== id));
            } catch (error) {
                console.error('Failed to delete task', error);
            }
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            const { data } = await api.put(`/tasks/${id}`, { status });
            setTasks(tasks.map(t => t._id === id ? data : t));
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    // Placeholder for edit - ideally navigate to edit page or open modal
    const handleEdit = (task) => {
        // For now, let's just log or maybe implement a simple prompt or navigate
        // Since we have a create page, maybe we can reuse it or just add an edit page
        // The plan mentioned [id]/page.jsx, let's assume we'll navigate there
        // But for simplicity in this step, I'll just leave it or maybe use window.location
        // Actually, I should use router.push
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
                <Link href="/dashboard/tasks/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto text-center">
                    + New Task
                </Link>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-48">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No tasks found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map(task => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onDelete={handleDelete}
                            onStatusChange={handleStatusChange}
                            onEdit={() => { }} // Placeholder
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
