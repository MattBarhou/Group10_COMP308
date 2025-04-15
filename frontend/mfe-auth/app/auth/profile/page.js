'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import ProfileForm from '@/app/components/ProfileForm';
import {useAuthContext} from '@/app/context/AuthContext';

export default function ProfilePage() {
    const {isAuthenticated, loading} = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return null; // Will redirect to login
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Your Profile
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <ProfileForm/>
            </div>
        </div>
    );
}