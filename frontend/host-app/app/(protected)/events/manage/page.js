"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../../lib/auth";
import { FaCalendarAlt, FaPlus, FaMapMarkerAlt, FaEye } from "react-icons/fa";

const GET_MY_EVENTS = gql`
  query GetMyEvents {
    events {
      id
      title
      description
      date
      location
      organizer {
        id
      }
    }
  }
`;

const CREATE_EVENT = gql`
  mutation CreateEvent(
    $title: String!
    $description: String!
    $date: String!
    $location: String!
  ) {
    createEvent(
      title: $title
      description: $description
      date: $date
      location: $location
    ) {
      id
      title
    }
  }
`;

export default function ManageEvents() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading, error, data, refetch } = useQuery(GET_MY_EVENTS);

  const [createEvent, { loading: createLoading }] = useMutation(CREATE_EVENT, {
    onCompleted: () => {
      setShowForm(false);
      reset();
      refetch();
    },
  });

  const onSubmit = (data) => {
    createEvent({
      variables: {
        title: data.title,
        description: data.description,
        date: new Date(data.date).toISOString(),
        location: data.location,
      },
    });
  };

  // Filter events organized by the current user
  const myEvents =
    data?.events.filter((event) => event.organizer.id === user?.id) || [];

  // Sort events by date
  const sortedEvents = [...myEvents].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Your Events</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          {showForm ? "Cancel" : "Create Event"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Event Title
                </label>
                <input
                  id="title"
                  type="text"
                  {...register("title", {
                    required: "Event title is required",
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows="3"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600"
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Date & Time
                </label>
                <input
                  id="date"
                  type="datetime-local"
                  {...register("date", { required: "Date is required" })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={createLoading}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {createLoading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      )}

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
          {sortedEvents.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-md text-center dark:bg-gray-800">
              <FaCalendarAlt className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Events Yet</h2>
              <p className="text-gray-600 mb-6 dark:text-gray-400">
                You haven't created any events yet. Create your first event to
                get started.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedEvents.map((event) => {
                const isPastEvent = new Date(event.date) < new Date();

                return (
                  <div
                    key={event.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 ${
                      isPastEvent ? "opacity-75" : ""
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-semibold">{event.title}</h2>
                        <Link
                          href={`/events/${event.id}`}
                          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                          <FaEye className="h-5 w-5" />
                        </Link>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2 dark:text-gray-400">
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
                      </div>
                    </div>

                    <div className="bg-gray-50 border-t px-6 py-4 dark:bg-gray-700 dark:border-gray-600">
                      <div className="flex justify-between">
                        <Link
                          href={`/events/${event.id}/edit`}
                          className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                          Edit Event
                        </Link>
                        <Link
                          href={`/events/${event.id}/volunteers`}
                          className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                          Manage Volunteers
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
