'use client';

import {useState} from 'react';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {LOGIN_MUTATION} from '@/lib/auth';
import {useAuthContext} from '@/app/context/AuthContext';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const {login} = useAuthContext();

    const [loginUser, {loading}] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            login(data.login.token, data.login.user);
            router.push('/');
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await loginUser({
                variables: {
                    input: {
                        email,
                        password,
                    },
                },
            });
        } catch (err) {
            // Error handling is already done in onError callback
        }
    };

    return (
        <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">Login</h1>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium dark:text-gray-200">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium dark:text-gray-200">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="mt-4 text-center">
                    <p className="text-sm dark:text-gray-300">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}