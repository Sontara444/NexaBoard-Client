'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { Search, Edit2, Trash2, Calendar } from 'lucide-react';

export default function Tasks() {
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        let result = tasks;

        if (searchTerm) {
            result = result.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (filterStatus !== 'all') {
            result = result.filter(task => task.status === filterStatus);
        }

        if (filterPriority !== 'all') {
            result = result.filter(task => task.priority === filterPriority);
        }

        setFilteredTasks(result);
    }, [tasks, searchTerm, filterStatus, filterPriority]);

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

    const handleEdit = (taskId) => {
        router.push(`/dashboard/tasks/${taskId}`);
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'in-progress':
                return 'bg-blue-100 text-blue-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700';
            case 'low':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterPriority('all');
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                <Link
                    href="/dashboard/tasks/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-2"
                >
                    + New Task
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full text-gray-500 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative w-full md:w-48">
                        <select
                            className="w-full text-gray-700 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white text-sm"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Priority Filter */}
                    <div className="relative w-full md:w-48">
                        <select
                            className="w-full text-gray-500 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white text-sm"
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <option value="all">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* Clear Button */}
                    {(searchTerm || filterStatus !== 'all' || filterPriority !== 'all') && (
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Tasks List */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                        ? 'No tasks found matching your filters.'
                        : 'No tasks yet. Create your first task!'}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTasks.map(task => (
                        <div
                            key={task._id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-4">
                                {/* Left: Task Info */}
                                <div className="flex-1 min-w-0">
                                    {/* Title and Badges */}
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <h3 className="text-base font-semibold text-gray-900">
                                            {task.title}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeColor(task.status)}`}>
                                            {task.status === 'in-progress' ? 'pending' : task.status}
                                        </span>
                                        {task.priority && (
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {task.description && (
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                                            {task.description}
                                        </p>
                                    )}

                                    {/* Date and Category */}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        {task.dueDate && (
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                <span>Due {formatDate(task.dueDate)}</span>
                                            </div>
                                        )}
                                        {task.category && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                {task.category}
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                                            work
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(task._id)}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Edit task"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Delete task"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
