"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";

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

// Inline styles
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f3f4f6",
  },
  nav: {
    backgroundColor: "white",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    padding: "1rem",
  },
  navInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#111827",
    textDecoration: "none",
  },
  navLinks: {
    display: "flex",
    gap: "1rem",
  },
  navLink: {
    color: "#4B5563",
    textDecoration: "none",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
  },
  main: {
    flexGrow: 1,
    padding: "2rem",
  },
  content: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  headerTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#111827",
  },
  newPostButton: {
    backgroundColor: "#3B82F6",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  formTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#111827",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    outline: "none",
    minHeight: "150px",
  },
  select: {
    width: "100%",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    outline: "none",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "3rem 0",
  },
  spinner: {
    width: "3rem",
    height: "3rem",
    border: "0.25rem solid #E5E7EB",
    borderTop: "0.25rem solid #3B82F6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderLeftWidth: "4px",
    borderLeftColor: "#EF4444",
    color: "#B91C1C",
    padding: "1rem",
    marginBottom: "1rem",
    borderRadius: "0.25rem",
  },
  postsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  postCard: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  postHeader: {
    padding: "1.5rem 1.5rem 1rem",
  },
  postType: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  postTypeIcon: {
    marginRight: "0.5rem",
    color: "#3B82F6",
  },
  postTypeLabel: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#6B7280",
  },
  postTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#111827",
  },
  postContent: {
    padding: "0 1.5rem 1.5rem",
    color: "#4B5563",
  },
  postFooter: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem 1.5rem",
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem 0",
    color: "#6B7280",
  },
  footer: {
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
    padding: "1.5rem",
    textAlign: "center",
    color: "#6B7280",
  },
};

export default function Posts() {
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("DISCUSSION");

  // Use auth with a try-catch to handle cases where context might not be available
  let auth = useAuth();
  // try {
  //   auth = useAuth();
  // } catch (error) {
  //   console.error("Auth provider not available:", error);
  // }

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

  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout();
    }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <Link href="/" style={styles.logo}>
            Community App
          </Link>
          <div style={styles.navLinks}>
            <Link href="/dashboard" style={styles.navLink}>
              Dashboard
            </Link>
            <Link href="/profile" style={styles.navLink}>
              Profile
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.headerTitle}>Community Posts</h1>
            <button
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              style={styles.newPostButton}
            >
              {showNewPostForm ? "Cancel" : "+ New Post"}
            </button>
          </div>

          {showNewPostForm && (
            <div style={styles.formContainer}>
              <h2 style={styles.formTitle}>Create a New Post</h2>
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label htmlFor="title" style={styles.label}>
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="content" style={styles.label}>
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    style={styles.textarea}
                  ></textarea>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="type" style={styles.label}>
                    Post Type
                  </label>
                  <select
                    id="type"
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    style={styles.select}
                  >
                    <option value="DISCUSSION">Discussion</option>
                    <option value="NEWS">News</option>
                  </select>
                </div>

                <div style={styles.formActions}>
                  <button
                    type="submit"
                    disabled={createLoading}
                    style={styles.submitButton}
                  >
                    {createLoading ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
            </div>
          ) : error ? (
            <div style={styles.errorContainer}>
              <p>Error loading posts: {error.message}</p>
            </div>
          ) : (
            <div style={styles.postsList}>
              {data?.posts?.map((post) => (
                <div key={post.id} style={styles.postCard}>
                  <div style={styles.postHeader}>
                    <div style={styles.postType}>
                      <span style={styles.postTypeIcon}>
                        {post.type === "NEWS" ? "📰" : "💬"}
                      </span>
                      <span style={styles.postTypeLabel}>
                        {post.type === "NEWS" ? "News" : "Discussion"}
                      </span>
                    </div>

                    <Link
                      href={`/posts/${post.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <h2 style={styles.postTitle}>{post.title}</h2>
                    </Link>
                  </div>

                  <div style={styles.postContent}>
                    <p>
                      {post.content.length > 200
                        ? post.content.substring(0, 200) + "..."
                        : post.content}
                    </p>
                  </div>

                  <div style={styles.postFooter}>
                    <span>Posted by {post.author.username}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              ))}

              {data?.posts?.length === 0 && (
                <div style={styles.emptyState}>
                  <p>No posts yet. Be the first to create a post!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer style={styles.footer}>
        <p>
          © {new Date().getFullYear()} Community Engagement App. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
