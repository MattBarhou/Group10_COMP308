'use client';

import AuthNavigation from './components/AuthNavigation';
import {useAuthContext} from './context/AuthContext';

export default function Home() {
    const {isAuthenticated, user, loading} = useAuthContext();

    return (
        <main>
            <AuthNavigation/>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Welcome to Our Community
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
                        A place where neighbors connect, share, and support each other
                    </p>

                    {loading ? (
                        <div className="mt-8 dark:text-white">Loading...</div>
                    ) : isAuthenticated ? (
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hello, {user?.username}!</h2>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">
                                {user?.role === 'resident' && 'Explore the latest in your community.'}
                                {user?.role === 'business_owner' && 'Manage your business listing and engage with customers.'}
                                {user?.role === 'community_organizer' && 'Create events and connect with volunteers.'}
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8">
                            <p className="mb-4 dark:text-white">Join our community to get started!</p>
                            <div className="space-x-4">
                                <a
                                    href="/auth/login"
                                    className="inline-block bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100
                                                            px-5 py-3 rounded-md font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    Sign In
                                </a>
                                <a
                                    href="/auth/register"
                                    className="inline-block bg-blue-600 text-white px-5 py-3 rounded-md font-medium
                                                            hover:bg-blue-700"
                                >
                                    Sign Up
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}