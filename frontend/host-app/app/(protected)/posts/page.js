"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import NavBar from "../../../components/ui/NavBar";
import { useAuth } from "../../../lib/auth";
import { FaComment, FaNewspaper } from "react-icons/fa";

const GET_POSTS = gql`
  query GetPosts {
    posts {
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

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $type: PostType!) {
    createPost(title: $title, content: $content, type: $type) {
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

export default function Posts() {
  const { user } = useAuth();
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("DISCUSSION");

  const { loading, error, data, refetch } = useQuery(GET_POSTS);

  const [createPost, { loading: createLoading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      setShowNewPostForm(false);
      setTitle("");
      setContent("");
      setPostType("DISCUSSION");
      refetch();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({
      variables: {
        title,
        content,
        type: postType,
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

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Community Posts</h1>
            <button
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              {showNewPostForm ? "Cancel" : "New Post"}
            </button>
          </div>

          {showNewPostForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
              <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows="5"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Post Type
                  </label>
                  <select
                    id="type"
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="DISCUSSION">Discussion</option>
                    <option value="NEWS">News</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {createLoading ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
              role="alert"
            >
              <p>Error loading posts: {error.message}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {data?.posts?.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800"
                >
                  <div className="flex items-center mb-3">
                    {post.type === "NEWS" ? (
                      <FaNewspaper className="text-blue-500 h-5 w-5 mr-2" />
                    ) : (
                      <FaComment className="text-green-500 h-5 w-5 mr-2" />
                    )}
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {post.type === "NEWS" ? "News" : "Discussion"}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {post.content}
                  </p>

                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>Posted by {post.author.username}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              ))}

              {data?.posts?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No posts yet. Be the first to create a post!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
