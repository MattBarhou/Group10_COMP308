import { useState } from "react";
import Button from "../ui/Button";

export default function PostForm({ onSubmit, loading = false }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("DISCUSSION");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, type: postType });
  };

  return (
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
        <Button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}
