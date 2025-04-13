import Link from "next/link";
import { FaNewspaper, FaComment, FaUser } from "react-icons/fa";
import { formatDate } from "../../lib/date-utils";

export default function PostCard({ post, compact = false }) {
  const { id, title, content, type, createdAt, author, summary } = post;

  return (
    <Link href={`/posts/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden dark:bg-gray-800">
        <div className="p-6">
          <div className="flex items-center mb-3">
            {type === "NEWS" ? (
              <FaNewspaper className="text-blue-500 h-5 w-5 mr-2" />
            ) : (
              <FaComment className="text-green-500 h-5 w-5 mr-2" />
            )}
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {type === "NEWS" ? "News" : "Discussion"}
            </span>
          </div>

          <h2 className="text-xl font-semibold mb-2">{title}</h2>

          <p
            className={`text-gray-600 mb-4 dark:text-gray-400 ${
              compact ? "line-clamp-2" : ""
            }`}
          >
            {summary || content}
          </p>

          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <FaUser className="mr-1" />
              <span>{author.username}</span>
            </div>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
