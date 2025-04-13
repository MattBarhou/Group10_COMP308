"use client";
import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaSearch,
} from "react-icons/fa";

const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      description
      date
      location
      organizer {
        id
        username
      }
      volunteers {
        id
        username
      }
    }
  }
`;

export default function Events() {
  const { loading, error, data } = useQuery(GET_EVENTS);
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter events based on search term
  const filteredEvents = data?.events
    ? data.events.filter((event) => {
        return (
          searchTerm === "" ||
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  // Sort events by date (upcoming first)
  const sortedEvents = [...(filteredEvents || [])].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.date) >= now
  );
  const pastEvents = sortedEvents.filter((event) => new Date(event.date) < now);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Community Events</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search events by title, description or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p>Error loading events: {error.message}</p>
        </div>
      ) : (
        <>
          {/* Upcoming Events */}
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>

          {upcomingEvents.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">
                No upcoming events found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {upcomingEvents.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col dark:bg-gray-800">
                    <div className="p-6 flex-grow">
                      <div className="flex items-center mb-3">
                        <FaCalendarAlt className="text-purple-500 h-5 w-5 mr-2" />
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                      </div>

                      <p className="text-gray-600 mb-4 dark:text-gray-400">
                        {event.description}
                      </p>

                      <div className="text-sm text-gray-500 space-y-2 dark:text-gray-400">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FaUser className="mr-2" />
                          <span>Organized by {event.organizer.username}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 px-6 py-3 dark:bg-purple-900">
                      <span className="text-sm font-medium">
                        {event.volunteers.length}{" "}
                        {event.volunteers.length === 1
                          ? "volunteer"
                          : "volunteers"}{" "}
                        signed up
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <Link href={`/events/${event.id}`} key={event.id}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col opacity-75 dark:bg-gray-800">
                      <div className="p-6 flex-grow">
                        <div className="flex items-center mb-3">
                          <FaCalendarAlt className="text-gray-500 h-5 w-5 mr-2" />
                          <h3 className="text-xl font-semibold">
                            {event.title}
                          </h3>
                        </div>

                        <p className="text-gray-600 mb-4 dark:text-gray-400">
                          {event.description}
                        </p>

                        <div className="text-sm text-gray-500 space-y-2 dark:text-gray-400">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center">
                            <FaUser className="mr-2" />
                            <span>Organized by {event.organizer.username}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 px-6 py-3 dark:bg-gray-700">
                        <span className="text-sm font-medium">
                          {event.volunteers.length}{" "}
                          {event.volunteers.length === 1
                            ? "volunteer"
                            : "volunteers"}{" "}
                          participated
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
