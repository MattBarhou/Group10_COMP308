"use client";
import { useAuth } from "../../../lib/auth";
import Link from "next/link";
import {
  FaNewspaper,
  FaHandsHelping,
  FaBell,
  FaCalendarAlt,
  FaStore,
  FaUser,
} from "react-icons/fa";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.username || "User"}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.role === "resident"
            ? "Resident"
            : user?.role === "business_owner"
            ? "Business Owner"
            : "Community Organizer"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Feature Cards */}
        <Link
          href="/posts"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800"
        >
          <div className="flex items-center mb-4">
            <FaNewspaper className="h-8 w-8 text-blue-500" />
            <h2 className="ml-3 text-xl font-semibold">
              Local News & Discussions
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with what's happening in your community.
          </p>
        </Link>

        <Link
          href="/help-requests"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800"
        >
          <div className="flex items-center mb-4">
            <FaHandsHelping className="h-8 w-8 text-green-500" />
            <h2 className="ml-3 text-xl font-semibold">Help Requests</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Request help or offer assistance to neighbors in need.
          </p>
        </Link>

        <Link
          href="/emergency-alerts"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800"
        >
          <div className="flex items-center mb-4">
            <FaBell className="h-8 w-8 text-red-500" />
            <h2 className="ml-3 text-xl font-semibold">Emergency Alerts</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Get notified about urgent issues in your area.
          </p>
        </Link>

        <Link
          href="/events"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800"
        >
          <div className="flex items-center mb-4">
            <FaCalendarAlt className="h-8 w-8 text-purple-500" />
            <h2 className="ml-3 text-xl font-semibold">Community Events</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and participate in local events and activities.
          </p>
        </Link>

        <Link
          href="/businesses"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800"
        >
          <div className="flex items-center mb-4">
            <FaStore className="h-8 w-8 text-amber-500" />
            <h2 className="ml-3 text-xl font-semibold">Local Businesses</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Support businesses in your community and find local deals.
          </p>
        </Link>

        <Link
          href="/profile"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800"
        >
          <div className="flex items-center mb-4">
            <FaUser className="h-8 w-8 text-indigo-500" />
            <h2 className="ml-3 text-xl font-semibold">Your Profile</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your profile and account settings.
          </p>
        </Link>

        {/* Role-specific cards */}
        {user?.role === "business_owner" && (
          <Link
            href="/businesses/manage"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800"
          >
            <div className="flex items-center mb-4">
              <FaStore className="h-8 w-8 text-blue-500" />
              <h2 className="ml-3 text-xl font-semibold">
                Manage Your Business
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Update your business profile, create deals, and respond to
              reviews.
            </p>
          </Link>
        )}

        {user?.role === "community_organizer" && (
          <Link
            href="/events/manage"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800"
          >
            <div className="flex items-center mb-4">
              <FaCalendarAlt className="h-8 w-8 text-blue-500" />
              <h2 className="ml-3 text-xl font-semibold">Manage Events</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage community events and activities.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
