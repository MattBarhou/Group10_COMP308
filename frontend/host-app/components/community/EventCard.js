import Link from "next/link";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { formatDate } from "../../lib/date-utils";

export default function EventCard({ event, compact = false, isPast = false }) {
  const { id, title, description, date, location, organizer, volunteers } =
    event;

  return (
    <Link href={`/events/${id}`}>
      <div
        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow h-full flex flex-col dark:bg-gray-800 ${
          isPast ? "opacity-75" : ""
        }`}
      >
        <div className="p-6 flex-grow">
          <div className="flex items-center mb-3">
            <FaCalendarAlt
              className={`h-5 w-5 mr-2 ${
                isPast ? "text-gray-500" : "text-purple-500"
              }`}
            />
            <h3 className="text-xl font-semibold">{title}</h3>
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
              <FaCalendarAlt className="mr-2" />
              <span>{formatDate(date)}</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <span>{location}</span>
            </div>
            {!compact && (
              <div className="flex items-center">
                <FaUser className="mr-2" />
                <span>Organized by {organizer?.username || "Anonymous"}</span>
              </div>
            )}
          </div>
        </div>

        <div
          className={`${
            isPast
              ? "bg-gray-50 dark:bg-gray-700"
              : "bg-purple-50 dark:bg-purple-900"
          } px-6 py-3`}
        >
          <span className="text-sm font-medium">
            {volunteers?.length || 0}{" "}
            {(volunteers?.length || 0) === 1 ? "volunteer" : "volunteers"}{" "}
            {isPast ? "participated" : "signed up"}
          </span>
        </div>
      </div>
    </Link>
  );
}
