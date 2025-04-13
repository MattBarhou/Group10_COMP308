"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../lib/auth";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";

const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
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
      suggestedTime
    }
  }
`;

const VOLUNTEER_FOR_EVENT = gql`
  mutation VolunteerForEvent($eventId: ID!) {
    volunteerForEvent(eventId: $eventId) {
      id
      volunteers {
        id
        username
      }
    }
  }
`;

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const { loading, error, data, refetch } = useQuery(GET_EVENT, {
    variables: { id },
  });

  const [volunteer, { loading: volunteerLoading }] = useMutation(
    VOLUNTEER_FOR_EVENT,
    {
      onCompleted: () => {
        refetch();
      },
    }
  );

  const handleVolunteer = () => {
    volunteer({
      variables: {
        eventId: id,
      },
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p>Error loading event: {error.message}</p>
        </div>
      </div>
    );
  }

  const event = data?.event;

  if (!event) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p>Event not found.</p>
        </div>
      </div>
    );
  }

  const isOrganizer = user?.id === event.organizer.id;
  const isVolunteer = event.volunteers.some((v) => v.id === user?.id);
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 dark:bg-gray-800">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          <p className="text-gray-600 mb-6 dark:text-gray-400">
            {event.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg dark:bg-purple-900">
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-purple-600 mr-2 dark:text-purple-300" />
                <h3 className="font-semibold">Date & Time</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {formatDate(event.date)}
              </p>

              {event.suggestedTime && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">AI Suggested Time:</span>{" "}
                  {formatDate(event.suggestedTime)}
                </div>
              )}
            </div>

            <div className="bg-purple-50 p-4 rounded-lg dark:bg-purple-900">
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-purple-600 mr-2 dark:text-purple-300" />
                <h3 className="font-semibold">Location</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {event.location}
              </p>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <FaUser className="text-gray-500 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">
              Organized by{" "}
              <span className="font-medium">{event.organizer.username}</span>
            </span>
          </div>

          {!isOrganizer && !isPastEvent && (
            <div className="mb-6">
              <button
                onClick={handleVolunteer}
                disabled={isVolunteer || volunteerLoading}
                className={`flex items-center py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                  ${
                    isVolunteer
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                  }`}
              >
                <FaUserPlus className="mr-2" />
                {isVolunteer
                  ? "You are volunteering"
                  : volunteerLoading
                  ? "Signing up..."
                  : "Volunteer for this event"}
              </button>
            </div>
          )}

          {isPastEvent && (
            <div className="bg-gray-100 p-4 rounded-lg mb-6 dark:bg-gray-700">
              <p className="text-gray-600 dark:text-gray-300">
                This event has already taken place.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Volunteers Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 dark:bg-gray-800">
        <div className="border-b px-6 py-4 dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            Volunteers ({event.volunteers.length})
          </h2>
        </div>

        <div className="p-6">
          {event.volunteers.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No volunteers yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {event.volunteers.map((volunteer) => (
                <div
                  key={volunteer.id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-700"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center dark:bg-purple-900">
                    <FaUser className="text-purple-600 dark:text-purple-300" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {volunteer.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
