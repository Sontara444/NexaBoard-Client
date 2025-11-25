'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import FormInput from '@/components/FormInput';

export default function EditTask({ params }) {
    const router = useRouter();
    const { id } = params;
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        dueDate: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const { data } = await api.get(`/tasks`);
                // Since we don't have a get single task endpoint in the controller (wait, I did create getTasks but not getTaskById? Let me check controller)
                // Checking taskController.js...
                // I created: getTasks (all), createTask, updateTask, deleteTask.
                // I did NOT create getTaskById.
                // I should probably add it or filter from the list. 
                // Filtering from list is inefficient but works for small apps.
                // Better to add getTaskById.
                // But for now, I'll filter from the list if I can't change backend easily (I can, but let's see).
                // Actually, I can just use the update endpoint.
                // Wait, I need to fetch the task to show it.
                // I'll filter from the list for now to save time, or add the endpoint.
                // Adding the endpoint is better.

                // Let's check taskController.js content I wrote.
                // const getTasks = asyncHandler(async (req, res) => { const tasks = await Task.find({ user: req.user._id }); res.json(tasks); });
                // No get single task.

                // I'll update the controller to include getTaskById.
                // But first let's write this file assuming I'll fix the backend or use the filter method.
                // Filter method:
                const task = data.find(t => t._id === id);
                if (task) {
                    setFormData({
                        title: task.title,
                        description: task.description || '',
                        status: task.status,
                        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                    });
                } else {
                    setError('Task not found');
                }
            } catch (err) {
                setError('Failed to load task');
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    const updateField = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await api.put(`/tasks/${id}`, formData);
            router.push('/dashboard/tasks');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update task');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading task...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Task</h1>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Task Title"
                    type="text"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={updateField('title')}
                    required
                />

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Description
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200"
                        rows="4"
                        placeholder="Enter task description"
                        value={formData.description}
                        onChange={updateField('description')}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Status
                        </label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 bg-white"
                            value={formData.status}
                            onChange={updateField('status')}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Due Date
                        </label>
                        <input
                            type="date"
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                            value={formData.dueDate}
                            onChange={updateField('dueDate')}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
