"use client";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import { FaExclamationTriangle, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const GET_EMERGENCY_ALERT = gql`
  query GetEmergencyAlert($id: ID!) {
    emergencyAlert(id: $id) {
      id
      title
      description
      severity
      location
      createdAt
      reporter {
        id
        username
      }
    }
  }
`;

export default function EmergencyAlertDetails() {
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_EMERGENCY_ALERT, {
    variables: { id },
  });

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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "LOW":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-300";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300";
      case "HIGH":
        return "text-orange-500 bg-orange-100 dark:bg-orange-900 dark:text-orange-300";
      case "CRITICAL":
        return "text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
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
          <p>Error loading emergency alert: {error.message}</p>
        </div>
      </div>
    );
  }

  const alert = data?.emergencyAlert;

  if (!alert) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p>Emergency alert not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 dark:bg-gray-800">
        <div className="bg-red-50 px-6 py-4 flex items-center justify-between dark:bg-red-900">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-600 h-6 w-6 mr-3 dark:text-red-400" />
            <h1 className="text-2xl font-bold text-red-800 dark:text-red-300">
              Emergency Alert
            </h1>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(
              alert.severity
            )}`}
          >
            {alert.severity}
          </span>
        </div>

        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4">{alert.title}</h2>

          <div className="flex items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
            <FaUser className="mr-1" />
            <span>
              Reported by <strong>{alert.reporter.username}</strong> on{" "}
              {formatDate(alert.createdAt)}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 dark:bg-gray-700">
            <p className="text-gray-700 mb-4 dark:text-gray-300">
              {alert.description}
            </p>

            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <span>
                <strong>Location:</strong> {alert.location}
              </span>
            </div>
          </div>

          {/* Safety Tips Section */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 dark:bg-blue-900">
            <h3 className="font-semibold text-blue-800 mb-2 dark:text-blue-300">
              Safety Tips
            </h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1 dark:text-blue-300">
              <li>Stay informed and follow official guidance</li>
              <li>Be aware of your surroundings</li>
              <li>Have an emergency plan ready</li>
              <li>Help others who may need assistance if it's safe to do so</li>
            </ul>
          </div>

          {/* Emergency Contacts Section */}
          <div className="bg-red-50 p-4 rounded-lg dark:bg-red-900">
            <h3 className="font-semibold text-red-800 mb-2 dark:text-red-300">
              Emergency Contacts
            </h3>
            <ul className="text-red-700 space-y-1 dark:text-red-300">
              <li>
                <strong>Emergency Services:</strong> 911
              </li>
              <li>
                <strong>Police Non-Emergency:</strong> 555-123-4567
              </li>
              <li>
                <strong>Community Center:</strong> 555-987-6543
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
