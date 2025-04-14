'use client';

import Link from 'next/link';
import {useAuthContext} from '@/app/context/AuthContext';

export default function AuthNavigation() {
    const {isAuthenticated, user, logout} = useAuthContext();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/frontend/mfe-auth/public" className="font-bold text-xl text-blue-600">
                                Community App
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  Welcome, {user?.username}
                </span>
                                <Link
                                    href="/frontend/mfe-auth/app/pages/profile"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/frontend/mfe-auth/app/pages/login"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/frontend/mfe-auth/app/pages/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}