import Link from "next/link";
import { FaExclamationTriangle, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { formatDate } from "../../lib/date-utils";

export default function AlertCard({ alert, compact = false }) {
  const { id, title, description, severity, location, createdAt, reporter } =
    alert;

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

  return (
    <Link href={`/emergency-alerts/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden dark:bg-gray-800">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 h-5 w-5 mr-2" />
              <h2 className="text-xl font-semibold">{title}</h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                severity
              )}`}
            >
              {severity}
            </span>
          </div>

          <p
            className={`text-gray-600 mb-4 dark:text-gray-400 ${
              compact ? "line-clamp-2" : ""
            }`}
          >
            {description}
          </p>

          <div className="text-sm text-gray-500 space-y-2 dark:text-gray-400">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <span>{location}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FaUser className="mr-1" />
                <span>{reporter?.username || "Anonymous"}</span>
              </div>
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
