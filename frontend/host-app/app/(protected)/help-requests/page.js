"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";
import { FaHandsHelping, FaSearch, FaPlus } from "react-icons/fa";

const GET_HELP_REQUESTS = gql`
  query GetHelpRequests {
    helpRequests {
      id
      title
      description
      requester {
        id
        username
      }
      status
      createdAt
      matchedVolunteers {
        id
        username
      }
    }
  }
`;

const CREATE_HELP_REQUEST = gql`
  mutation CreateHelpRequest($title: String!, $description: String!) {
    createHelpRequest(title: $title, description: $description) {
      id
      title
    }
  }
`;

const VOLUNTEER_FOR_HELP_REQUEST = gql`
  mutation VolunteerForHelpRequest($requestId: ID!) {
    volunteerForHelpRequest(requestId: $requestId) {
      id
      status
      matchedVolunteers {
        id
        username
      }
    }
  }
`;

export default function HelpRequests() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_HELP_REQUESTS);

  const [createHelpRequest, { loading: createLoading }] = useMutation(
    CREATE_HELP_REQUEST,
    {
      onCompleted: () => {
        setShowForm(false);
        setTitle("");
        setDescription("");
        refetch();
      },
    }
  );

  const [volunteerForHelpRequest, { loading: volunteerLoading }] = useMutation(
    VOLUNTEER_FOR_HELP_REQUEST,
    {
      onCompleted: () => {
        refetch();
      },
    }
  );

  const handleCreateRequest = (e) => {
    e.preventDefault();
    createHelpRequest({
      variables: {
        title,
        description,
      },
    });
  };

  const handleVolunteer = (requestId) => {
    volunteerForHelpRequest({
      variables: {
        requestId,
      },
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter help requests based on search term and status
  const filteredRequests = data?.helpRequests
    ? data.helpRequests.filter((request) => {
        const matchesSearch =
          searchTerm === "" ||
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "" || request.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Neighborhood Help Requests</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          {showForm ? "Cancel" : "Ask for Help"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">
            Request Help from Neighbors
          </h2>
          <form onSubmit={handleCreateRequest}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="e.g. Need help moving furniture"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Describe what you need help with..."
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createLoading}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {createLoading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search help requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="md:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p>Error loading help requests: {error.message}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => {
            const isRequester = user?.id === request.requester.id;
            const isVolunteer = request.matchedVolunteers.some(
              (v) => v.id === user?.id
            );

            return (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <Link
                      href={`/help-requests/${request.id}`}
                      className="text-xl font-semibold hover:text-green-600 dark:hover:text-green-400"
                    >
                      {request.title}
                    </Link>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full
                      ${
                        request.status === "OPEN"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : request.status === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      }`}
                    >
                      {request.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3 dark:text-gray-400">
                    {request.description}
                  </p>

                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-500 dark:text-gray-400">
                      Posted by {request.requester.username} on{" "}
                      {formatDate(request.createdAt)}
                    </div>
                    <div>
                      {request.matchedVolunteers.length > 0 && (
                        <span className="text-gray-500 dark:text-gray-400">
                          {request.matchedVolunteers.length} volunteer
                          {request.matchedVolunteers.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border-t px-6 py-4 dark:bg-gray-700 dark:border-gray-600">
                  {!isRequester &&
                    request.status === "OPEN" &&
                    !isVolunteer && (
                      <button
                        onClick={() => handleVolunteer(request.id)}
                        disabled={volunteerLoading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        <FaHandsHelping className="inline mr-2" />
                        Volunteer to Help
                      </button>
                    )}

                  {isVolunteer && (
                    <span className="block text-center text-green-600 font-medium dark:text-green-400">
                      You're helping with this request
                    </span>
                  )}

                  {isRequester && (
                    <Link
                      href={`/help-requests/${request.id}`}
                      className="block text-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Manage Your Request
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {filteredRequests.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No help requests found matching your criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
