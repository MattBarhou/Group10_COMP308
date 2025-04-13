"use client";
import NavBar from "../components/ui/NavBar";
import Link from "next/link";
import { useAuth } from "../lib/auth";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            Welcome to the Community Engagement App
          </h1>
          <p className="text-xl mb-8">
            Connect with your neighborhood, support local businesses, and make a
            difference in your community.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
              <h2 className="text-xl font-semibold mb-3">Stay Connected</h2>
              <p className="mb-4">
                Share local news, join discussions, and stay informed about what
                matters in your area.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
              <h2 className="text-xl font-semibold mb-3">Support Local</h2>
              <p className="mb-4">
                Discover and support local businesses with reviews, deals, and
                promotions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
              <h2 className="text-xl font-semibold mb-3">Help & Get Help</h2>
              <p className="mb-4">
                Request assistance from neighbors or volunteer to help others in
                your community.
              </p>
            </div>
          </div>

          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 text-lg font-medium"
              >
                Join Your Community
              </Link>
              <Link
                href="/login"
                className="bg-transparent border border-blue-600 text-blue-600 py-3 px-6 rounded-md hover:bg-blue-50 text-lg font-medium dark:hover:bg-gray-700"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 text-lg font-medium"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </main>

      <footer className="bg-gray-100 py-6 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>
            © {new Date().getFullYear()} Community Engagement App. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
