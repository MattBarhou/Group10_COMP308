import Link from "next/link";
import { FaHandsHelping, FaUser } from "react-icons/fa";
import Button from "../ui/Button";
import { formatDate } from "../../lib/date-utils";

export default function HelpRequestCard({
  helpRequest,
  compact = false,
  isRequester = false,
  isVolunteer = false,
  onVolunteer = null,
  volunteerLoading = false,
}) {
  const {
    id,
    title,
    description,
    requester,
    status,
    createdAt,
    matchedVolunteers,
  } = helpRequest;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <Link
            href={`/help-requests/${id}`}
            className="text-xl font-semibold hover:text-green-600 dark:hover:text-green-400"
          >
            {title}
          </Link>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full
            ${
              status === "OPEN"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                : status === "IN_PROGRESS"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            }`}
          >
            {status.replace("_", " ")}
          </span>
        </div>

        <p
          className={`text-gray-600 mb-4 dark:text-gray-400 ${
            compact ? "line-clamp-2" : ""
          }`}
        >
          {description}
        </p>

        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-500 dark:text-gray-400">
            Posted by {requester?.username || "Anonymous"} on{" "}
            {formatDate(createdAt)}
          </div>
          <div>
            {matchedVolunteers?.length > 0 && (
              <span className="text-gray-500 dark:text-gray-400">
                {matchedVolunteers.length} volunteer
                {matchedVolunteers.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t px-6 py-4 dark:bg-gray-700 dark:border-gray-600">
        {!isRequester && status === "OPEN" && !isVolunteer && onVolunteer && (
          <Button
            onClick={() => onVolunteer(id)}
            variant="success"
            fullWidth
            disabled={volunteerLoading}
          >
            <FaHandsHelping className="mr-2" />
            Volunteer to Help
          </Button>
        )}

        {isVolunteer && (
          <span className="block text-center text-green-600 font-medium dark:text-green-400">
            You're helping with this request
          </span>
        )}

        {isRequester && (
          <Link
            href={`/help-requests/${id}`}
            className="block text-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Manage Your Request
          </Link>
        )}
      </div>
    </div>
  );
}
