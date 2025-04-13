"use client";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import { FaNewspaper, FaComment, FaUser } from "react-icons/fa";

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      type
      createdAt
      author {
        id
        username
      }
      summary
    }
  }
`;

export default function PostDetails() {
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_POST, {
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
          <p>Error loading post: {error.message}</p>
        </div>
      </div>
    );
  }

  const post = data?.post;

  if (!post) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p>Post not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 dark:bg-gray-800">
        <div className="p-6">
          <div className="flex items-center mb-4">
            {post.type === "NEWS" ? (
              <FaNewspaper className="text-blue-500 h-6 w-6 mr-2" />
            ) : (
              <FaComment className="text-green-500 h-6 w-6 mr-2" />
            )}
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {post.type === "NEWS" ? "Local News" : "Discussion"}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center mb-6 text-sm text-gray-500 dark:text-gray-400">
            <FaUser className="mr-1" />
            <span>
              Posted by <strong>{post.author.username}</strong> on{" "}
              {formatDate(post.createdAt)}
            </span>
          </div>

          {post.summary && (
            <div className="bg-yellow-50 p-4 rounded-lg mb-6 dark:bg-yellow-900">
              <h3 className="font-semibold text-yellow-800 mb-2 dark:text-yellow-300">
                AI-Generated Summary
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                {post.summary}
              </p>
            </div>
          )}

          <div className="prose max-w-none mb-6 text-gray-700 dark:text-gray-300">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Comment section would go here in a future iteration */}
    </div>
  );
}
