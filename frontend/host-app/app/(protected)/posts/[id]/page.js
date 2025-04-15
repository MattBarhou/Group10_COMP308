"use client";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../lib/auth";

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
    maxWidth: "800px",
    margin: "0 auto",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    color: "#4B5563",
    marginBottom: "1.5rem",
    textDecoration: "none",
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
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#111827",
  },
  postAuthor: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  authorIcon: {
    marginRight: "0.25rem",
  },
  summaryBlock: {
    backgroundColor: "#FEF3C7",
    padding: "1rem",
    borderRadius: "0.375rem",
    marginBottom: "1.5rem",
  },
  summaryTitle: {
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#92400E",
  },
  summaryText: {
    color: "#92400E",
  },
  postContent: {
    padding: "0 1.5rem 1.5rem",
    color: "#4B5563",
  },
  paragraph: {
    marginBottom: "1rem",
    lineHeight: "1.6",
  },
  postFooter: {
    padding: "1rem 1.5rem",
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
    fontSize: "0.875rem",
    color: "#6B7280",
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
  notFoundContainer: {
    backgroundColor: "#FEF3C7",
    borderLeftWidth: "4px",
    borderLeftColor: "#F59E0B",
    color: "#92400E",
    padding: "1rem",
    marginBottom: "1rem",
    borderRadius: "0.25rem",
  },
  footer: {
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
    padding: "1.5rem",
    textAlign: "center",
    color: "#6B7280",
  },
};

export default function PostDetails() {
  const { id } = useParams();

  // Use auth with a try-catch to handle cases where context might not be available
  let auth = useAuth();
  // try {
  //   auth = useAuth();
  // } catch (error) {
  //   console.error("Auth provider not available:", error);
  // }

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
            <Link href="/posts" style={styles.navLink}>
              Posts
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.content}>
          <Link href="/posts" style={styles.backLink}>
            ← Back to posts
          </Link>

          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
            </div>
          ) : error ? (
            <div style={styles.errorContainer}>
              <p>Error loading post: {error.message}</p>
            </div>
          ) : !data?.post ? (
            <div style={styles.notFoundContainer}>
              <p>Post not found.</p>
            </div>
          ) : (
            <div style={styles.postCard}>
              <div style={styles.postHeader}>
                <div style={styles.postType}>
                  <span style={styles.postTypeIcon}>
                    {data.post.type === "NEWS" ? "📰" : "💬"}
                  </span>
                  <span style={styles.postTypeLabel}>
                    {data.post.type === "NEWS" ? "Local News" : "Discussion"}
                  </span>
                </div>

                <h1 style={styles.postTitle}>{data.post.title}</h1>

                <div style={styles.postAuthor}>
                  <span style={styles.authorIcon}>👤</span>
                  <span>
                    Posted by <strong>{data.post.author.username}</strong> on{" "}
                    {formatDate(data.post.createdAt)}
                  </span>
                </div>

                {data.post.summary && (
                  <div style={styles.summaryBlock}>
                    <h3 style={styles.summaryTitle}>AI-Generated Summary</h3>
                    <p style={styles.summaryText}>{data.post.summary}</p>
                  </div>
                )}
              </div>

              <div style={styles.postContent}>
                {data.post.content.split("\n").map((paragraph, index) => (
                  <p key={index} style={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
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
