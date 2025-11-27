'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import FormInput from '@/components/FormInput';

export default function EditTask() {
    const params = useParams();      
    const id = params.id;
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const { data } = await api.get('/tasks'); 
                const task = data.find(t => t._id === id); 

                if (task) {
                    setFormData({
                        title: task.title,
                        description: task.description || '',
                        status: task.status,
                        priority: task.priority || 'medium',
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                            Priority
                        </label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 bg-white"
                            value={formData.priority}
                            onChange={updateField('priority')}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
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
