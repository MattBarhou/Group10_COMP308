"use client";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../lib/auth";
import { FaHandsHelping, FaUser, FaCheck } from "react-icons/fa";

const GET_HELP_REQUEST = gql`
  query GetHelpRequest($id: ID!) {
    helpRequest(id: $id) {
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

export default function HelpRequestDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const { loading, error, data, refetch } = useQuery(GET_HELP_REQUEST, {
    variables: { id },
  });

  const [volunteerForHelpRequest, { loading: volunteerLoading }] = useMutation(
    VOLUNTEER_FOR_HELP_REQUEST,
    {
      onCompleted: () => {
        refetch();
      },
    }
  );

  const handleVolunteer = () => {
    volunteerForHelpRequest({
      variables: {
        requestId: id,
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
          <p>Error loading help request: {error.message}</p>
        </div>
      </div>
    );
  }

  const request = data?.helpRequest;

  if (!request) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p>Help request not found.</p>
        </div>
      </div>
    );
  }

  const isRequester = user?.id === request.requester.id;
  const isVolunteer = request.matchedVolunteers.some((v) => v.id === user?.id);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 dark:bg-gray-800">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{request.title}</h1>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full
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

          <div className="flex items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
            <FaUser className="mr-1" />
            <span>
              Requested by <strong>{request.requester.username}</strong> on{" "}
              {formatDate(request.createdAt)}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 dark:bg-gray-700">
            <p className="text-gray-700 dark:text-gray-300">
              {request.description}
            </p>
          </div>

          {!isRequester && request.status === "OPEN" && !isVolunteer && (
            <div className="mb-6">
              <button
                onClick={handleVolunteer}
                disabled={volunteerLoading}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
              >
                <FaHandsHelping className="mr-2" />
                {volunteerLoading ? "Signing up..." : "Volunteer to Help"}
              </button>
            </div>
          )}

          {isVolunteer && (
            <div className="bg-green-50 p-4 rounded-lg mb-6 dark:bg-green-900">
              <div className="flex items-center">
                <FaCheck className="text-green-600 mr-2 dark:text-green-400" />
                <p className="text-green-800 font-medium dark:text-green-300">
                  You're helping with this request
                </p>
              </div>
            </div>
          )}

          {isRequester && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6 dark:bg-blue-900">
              <p className="text-blue-800 dark:text-blue-300">
                This is your help request. You can view volunteers who have
                offered to help below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Volunteers Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 dark:bg-gray-800">
        <div className="border-b px-6 py-4 dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            Volunteers ({request.matchedVolunteers.length})
          </h2>
        </div>

        <div className="p-6">
          {request.matchedVolunteers.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No volunteers yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {request.matchedVolunteers.map((volunteer) => (
                <div
                  key={volunteer.id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-700"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-200 flex items-center justify-center dark:bg-green-900">
                    <FaUser className="text-green-600 dark:text-green-300" />
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
