import Link from "next/link";
import {
  FaStore,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaStar,
} from "react-icons/fa";

export default function BusinessCard({ business, compact = false }) {
  const {
    id,
    name,
    description,
    category,
    address,
    phone,
    email,
    reviews = [],
  } = business;

  const getAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <Link href={`/businesses/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col dark:bg-gray-800">
        <div className="p-6 flex-grow">
          <div className="flex items-center mb-3">
            <FaStore className="text-blue-500 h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">{name}</h2>
          </div>

          {!compact && reviews && reviews.length > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`h-4 w-4 ${
                      parseFloat(getAverageRating()) >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {getAverageRating()} ({reviews.length})
              </span>
            </div>
          )}

          <p
            className={`text-gray-600 mb-4 dark:text-gray-400 ${
              compact ? "line-clamp-2" : ""
            }`}
          >
            {description}
          </p>

          {!compact && (
            <div className="text-sm text-gray-500 space-y-2 dark:text-gray-400">
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span>{address}</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-2" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span>{email}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-3 dark:bg-gray-700">
          <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
            {category}
          </span>
        </div>
      </div>
    </Link>
  );
}
