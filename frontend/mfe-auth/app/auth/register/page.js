'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import RegisterForm from '@/app/components/RegisterForm';
import {useAuthContext} from '@/app/context/AuthContext';

export default function RegisterPage() {
    const {isAuthenticated, loading} = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && !loading) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create a new account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <RegisterForm/>
            </div>
        </div>
    );
}