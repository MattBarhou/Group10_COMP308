"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";
import {
  FaBell,
  FaExclamationTriangle,
  FaSearch,
  FaPlus,
} from "react-icons/fa";

const GET_EMERGENCY_ALERTS = gql`
  query GetEmergencyAlerts {
    emergencyAlerts {
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

const CREATE_EMERGENCY_ALERT = gql`
  mutation CreateEmergencyAlert(
    $title: String!
    $description: String!
    $severity: AlertSeverity!
    $location: String!
  ) {
    createEmergencyAlert(
      title: $title
      description: $description
      severity: $severity
      location: $location
    ) {
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

export default function EmergencyAlerts() {
  const { user } = useAuth();
  const [showNewAlertForm, setShowNewAlertForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [location, setLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_EMERGENCY_ALERTS);

  const [createAlert, { loading: createLoading }] = useMutation(
    CREATE_EMERGENCY_ALERT,
    {
      onCompleted: () => {
        setShowNewAlertForm(false);
        setTitle("");
        setDescription("");
        setSeverity("MEDIUM");
        setLocation("");
        refetch();
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    createAlert({
      variables: {
        title,
        description,
        severity,
        location,
      },
    });
  };

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

  // Filter alerts based on search term and severity
  const filteredAlerts = data?.emergencyAlerts
    ? data.emergencyAlerts.filter((alert) => {
        const matchesSearch =
          searchTerm === "" ||
          alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSeverity =
          severityFilter === "" || alert.severity === severityFilter;

        return matchesSearch && matchesSeverity;
      })
    : [];

  // Sort alerts by severity and date (critical first, then by most recent)
  const sortedAlerts = [...(filteredAlerts || [])].sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Emergency Alerts</h1>
        <button
          onClick={() => setShowNewAlertForm(!showNewAlertForm)}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          {showNewAlertForm ? "Cancel" : "Report Emergency"}
        </button>
      </div>

      {showNewAlertForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Report an Emergency</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="5"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600"
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                htmlFor="severity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Severity
              </label>
              <select
                id="severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createLoading}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {createLoading ? "Submitting..." : "Submit Alert"}
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
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="md:w-64">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Severities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert"
        >
          <p>Error loading alerts: {error.message}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sortedAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-red-500 h-5 w-5 mr-2" />
                  <Link
                    href={`/emergency-alerts/${alert.id}`}
                    className="text-xl font-semibold hover:text-red-600 dark:hover:text-red-400"
                  >
                    {alert.title}
                  </Link>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                    alert.severity
                  )}`}
                >
                  {alert.severity}
                </span>
              </div>

              <p className="text-gray-600 mb-4 dark:text-gray-400">
                {alert.description}
              </p>

              <div className="text-sm text-gray-500 mb-2 dark:text-gray-400">
                <strong>Location:</strong> {alert.location}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Reported by {alert.reporter.username}</span>
                <span>{formatDate(alert.createdAt)}</span>
              </div>
            </div>
          ))}

          {sortedAlerts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No emergency alerts at this time.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
