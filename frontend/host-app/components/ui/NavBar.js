"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../lib/auth";
import {
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaStore,
  FaCalendarAlt,
  FaHandsHelping,
  FaBell,
  FaNewspaper,
} from "react-icons/fa";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                Community App
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white"
              >
                <FaHome className="mr-1" /> Home
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/businesses"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white"
                  >
                    <FaStore className="mr-1" /> Businesses
                  </Link>
                  <Link
                    href="/events"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white"
                  >
                    <FaCalendarAlt className="mr-1" /> Events
                  </Link>
                  <Link
                    href="/help-requests"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white"
                  >
                    <FaHandsHelping className="mr-1" /> Help
                  </Link>
                  <Link
                    href="/emergency-alerts"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white"
                  >
                    <FaBell className="mr-1" /> Alerts
                  </Link>
                  <Link
                    href="/posts"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white"
                  >
                    <FaNewspaper className="mr-1" /> Posts
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                  <FaUser className="h-6 w-6" />
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                  <FaSignOutAlt className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:hover:bg-gray-700"
              >
                <span className="sr-only">
                  {isMenuOpen ? "Close menu" : "Open menu"}
                </span>
                {isMenuOpen ? (
                  <FaTimes className="block h-6 w-6" />
                ) : (
                  <FaBars className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={toggleMenu}
          >
            <FaHome className="inline mr-2" /> Home
          </Link>
          {user && (
            <>
              <Link
                href="/dashboard"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
              <Link
                href="/businesses"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={toggleMenu}
              >
                <FaStore className="inline mr-2" /> Businesses
              </Link>
              <Link
                href="/events"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={toggleMenu}
              >
                <FaCalendarAlt className="inline mr-2" /> Events
              </Link>
              <Link
                href="/help-requests"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={toggleMenu}
              >
                <FaHandsHelping className="inline mr-2" /> Help Requests
              </Link>
              <Link
                href="/emergency-alerts"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={toggleMenu}
              >
                <FaBell className="inline mr-2" /> Alerts
              </Link>
              <Link
                href="/posts"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={toggleMenu}
              >
                <FaNewspaper className="inline mr-2" /> Posts
              </Link>
              <Link
                href="/profile"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={toggleMenu}
              >
                <FaUser className="inline mr-2" /> Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </>
          )}
          {!user && (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-1">
                <Link
                  href="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 bg-blue-50 text-blue-600 text-base font-medium dark:bg-blue-900 dark:text-blue-200"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
