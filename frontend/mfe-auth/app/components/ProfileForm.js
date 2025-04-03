'use client';

import {useState, useEffect} from 'react';
import {useMutation} from '@apollo/client';
import {UPDATE_USER_MUTATION} from '@/lib/auth';
import {useAuthContext} from '@/app/context/AuthContext';

export default function ProfileForm() {
    const {user, updateUser} = useAuthContext();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        location: '',
    });
    const [message, setMessage] = useState({type: '', text: ''});

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || '',
                location: user.location || '',
            });
        }
    }, [user]);

    const [updateUserProfile, {loading}] = useMutation(UPDATE_USER_MUTATION, {
        onCompleted: (data) => {
            updateUser(data.updateUser);
            setMessage({
                type: 'success',
                text: 'Profile updated successfully!',
            });

            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage({type: '', text: ''});
            }, 3000);
        },
        onError: (error) => {
            setMessage({
                type: 'error',
                text: error.message,
            });
        },
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({type: '', text: ''});

        try {
            await updateUserProfile({
                variables: {
                    input: formData,
                },
            });
        } catch (err) {
            // Error handling is already done in onError callback
        }
    };

    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6">Edit Profile</h1>

            {message.text && (
                <div
                    className={`p-3 rounded mb-4 ${
                        message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                    }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="bio" className="block mb-2 text-sm font-medium">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="location" className="block mb-2 text-sm font-medium">
                        Location
                    </label>
                    <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                    {loading ? 'Saving changes...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
}