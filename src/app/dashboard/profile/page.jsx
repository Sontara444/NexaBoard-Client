'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import FormInput from '@/components/FormInput';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Profile() {
    const router = useRouter();
    const { updateUser } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                setFormData({
                    username: data.username,
                    email: data.email,
                    password: '',
                });
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.type === 'password' ? 'password' : e.target.type === 'email' ? 'email' : 'username']: e.target.value });
    };

    // Correct handler for FormInput which doesn't pass name
    const updateField = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const updateData = {
                username: formData.username,
                email: formData.email,
            };
            if (formData.password) {
                updateData.password = formData.password;
            }

            const { data } = await api.patch('/auth/profile', updateData);
            setFormData({ ...formData, password: '' });
            setMessage('Profile updated successfully');

            // Update context immediately
            updateUser(data);

            if (data.token) {
                Cookies.set('token', data.token, { expires: 30 });
            }

            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        }
    };

    if (loading) return <div>Loading profile...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>

            {message && (
                <div className="bg-green-50 text-green-700 p-4 rounded mb-4">
                    {message}
                </div>
            )}
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Username"
                    type="text"
                    value={formData.username}
                    onChange={updateField('username')}
                />
                <FormInput
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={updateField('email')}
                />
                <FormInput
                    label="New Password (leave blank to keep current)"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={updateField('password')}
                />

                <button
                    type="submit"
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
}
