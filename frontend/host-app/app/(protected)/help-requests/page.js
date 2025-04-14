"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";

const GET_HELP_REQUESTS = gql`
  query GetHelpRequests {
    helpRequests {
      id
      title
      description
      requester {
        id
        username
      }
      status
      createdAt
      matchedVolunteers {
        id
        username
      }
    }
  }
`;

const CREATE_HELP_REQUEST = gql`
  mutation CreateHelpRequest($title: String!, $description: String!) {
    createHelpRequest(title: $title, description: $description) {
      id
      title
    }
  }
`;

const VOLUNTEER_FOR_HELP_REQUEST = gql`
  mutation VolunteerForHelpRequest($requestId: ID!) {
    volunteerForHelpRequest(requestId: $requestId) {
      id
      status
      matchedVolunteers {
        id
        username
      }
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
  askButton: {
    backgroundColor: "#10B981",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    border: "none",
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
    fontWeight: "500",
    marginBottom: "0.5rem",
    color: "#4B5563",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    outline: "none",
    minHeight: "150px",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  submitButton: {
    backgroundColor: "#10B981",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    border: "none",
    fontWeight: "500",
    cursor: "pointer",
  },
  disabledButton: {
    opacity: "0.5",
    cursor: "not-allowed",
  },
  filterContainer: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  filterForm: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
  },
  filterGroup: {
    flexGrow: 1,
  },
  searchInput: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9CA3AF",
  },
  inputWithIcon: {
    width: "100%",
    padding: "0.75rem",
    paddingLeft: "2.5rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    outline: "none",
  },
  requestsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  requestHeader: {
    padding: "1.5rem 1.5rem 1rem",
  },
  requestHeaderTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "0.5rem",
  },
  requestTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#111827",
  },
  requestStatus: {
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  openStatus: {
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
  },
  inProgressStatus: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  completedStatus: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
  },
  requestDescription: {
    color: "#4B5563",
    marginBottom: "1rem",
  },
  requestMeta: {
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  requestFooter: {
    borderTop: "1px solid #E5E7EB",
    padding: "1rem 1.5rem",
    backgroundColor: "#F9FAFB",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestFooterText: {
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  volunteerButton: {
    backgroundColor: "#10B981",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    fontWeight: "500",
    fontSize: "0.875rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  helpingText: {
    color: "#10B981",
    fontWeight: "500",
    fontSize: "0.875rem",
  },
  manageText: {
    color: "#3B82F6",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "0.875rem",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "4rem 0",
  },
  spinner: {
    width: "3rem",
    height: "3rem",
    border: "0.25rem solid #E5E7EB",
    borderTopColor: "#10B981",
    borderRadius: "50%",
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    padding: "1rem",
    borderRadius: "0.375rem",
    marginBottom: "1rem",
    color: "#B91C1C",
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 0",
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

export default function HelpRequests() {
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Use auth with try-catch to handle cases where context might not be available
  let auth = useAuth();
  // try {
  //   auth = useAuth();
  // } catch (error) {
  //   console.error("Auth provider not available:", error);
  // }

  const { loading, error, data, refetch } = useQuery(GET_HELP_REQUESTS);

  const [createHelpRequest, { loading: createLoading }] = useMutation(
    CREATE_HELP_REQUEST,
    {
      onCompleted: () => {
        setShowNewRequestForm(false);
        setTitle("");
        setDescription("");
        refetch();
      },
    }
  );

  const [volunteerForHelpRequest, { loading: volunteerLoading }] = useMutation(
    VOLUNTEER_FOR_HELP_REQUEST,
    {
      onCompleted: () => {
        refetch();
      },
    }
  );

  const handleCreateRequest = (e) => {
    e.preventDefault();
    createHelpRequest({
      variables: {
        title,
        description,
      },
    });
  };

  const handleVolunteer = (requestId) => {
    volunteerForHelpRequest({
      variables: {
        requestId,
      },
    });
  };

  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout();
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Filter help requests based on search term and status
  const filteredRequests = data?.helpRequests
    ? data.helpRequests.filter((request) => {
        const matchesSearch =
          searchTerm === "" ||
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "" || request.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

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
            <h1 style={styles.headerTitle}>Neighborhood Help Requests</h1>
            <button
              onClick={() => setShowNewRequestForm(!showNewRequestForm)}
              style={styles.askButton}
            >
              {showNewRequestForm ? "Cancel" : "+ Ask for Help"}
            </button>
          </div>

          {showNewRequestForm && (
            <div style={styles.formContainer}>
              <h2 style={styles.formTitle}>Request Help from Neighbors</h2>
              <form onSubmit={handleCreateRequest}>
                <div style={styles.formGroup}>
                  <label htmlFor="title" style={styles.label}>
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="e.g. Need help moving furniture"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="description" style={styles.label}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    style={styles.textarea}
                    placeholder="Describe what you need help with in detail..."
                  ></textarea>
                </div>

                <div style={styles.formActions}>
                  <button
                    type="submit"
                    disabled={createLoading}
                    style={{
                      ...styles.submitButton,
                      ...(createLoading ? styles.disabledButton : {}),
                    }}
                  >
                    {createLoading ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={styles.filterContainer}>
            <div style={styles.filterForm}>
              <div style={styles.filterGroup}>
                <div style={styles.searchInput}>
                  <span style={styles.searchIcon}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search help requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.inputWithIcon}
                  />
                </div>
              </div>

              <div style={styles.filterGroup}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={styles.select}
                >
                  <option value="">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
            </div>
          ) : error ? (
            <div style={styles.errorContainer}>
              <p>Error loading help requests: {error.message}</p>
            </div>
          ) : filteredRequests.length > 0 ? (
            <div style={styles.requestsList}>
              {filteredRequests.map((request) => {
                const isRequester = auth?.user?.id === request.requester.id;
                const isVolunteer = request.matchedVolunteers.some(
                  (v) => v.id === auth?.user?.id
                );

                let statusStyle;
                switch (request.status) {
                  case "OPEN":
                    statusStyle = styles.openStatus;
                    break;
                  case "IN_PROGRESS":
                    statusStyle = styles.inProgressStatus;
                    break;
                  case "COMPLETED":
                    statusStyle = styles.completedStatus;
                    break;
                  default:
                    statusStyle = styles.openStatus;
                }

                return (
                  <div key={request.id} style={styles.requestCard}>
                    <div style={styles.requestHeader}>
                      <div style={styles.requestHeaderTop}>
                        <h3 style={styles.requestTitle}>{request.title}</h3>
                        <span
                          style={{ ...styles.requestStatus, ...statusStyle }}
                        >
                          {request.status.replace("_", " ")}
                        </span>
                      </div>

                      <p style={styles.requestDescription}>
                        {request.description}
                      </p>

                      <div style={styles.requestMeta}>
                        <span>
                          Requested by {request.requester.username} on{" "}
                          {formatDate(request.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div style={styles.requestFooter}>
                      <span style={styles.requestFooterText}>
                        {request.matchedVolunteers.length > 0
                          ? `${request.matchedVolunteers.length} volunteer${
                              request.matchedVolunteers.length > 1 ? "s" : ""
                            }`
                          : "No volunteers yet"}
                      </span>

                      {!isRequester &&
                        request.status === "OPEN" &&
                        !isVolunteer && (
                          <button
                            onClick={() => handleVolunteer(request.id)}
                            disabled={volunteerLoading}
                            style={{
                              ...styles.volunteerButton,
                              ...(volunteerLoading
                                ? styles.disabledButton
                                : {}),
                            }}
                          >
                            <span>🤝</span>
                            Volunteer to Help
                          </button>
                        )}

                      {isVolunteer && (
                        <span style={styles.helpingText}>
                          You&apos;re helping with this request
                        </span>
                      )}

                      {isRequester && (
                        <Link
                          href={`/help-requests/${request.id}`}
                          style={styles.manageText}
                        >
                          Manage Your Request
                        </Link>
                      )}

                      {!isRequester &&
                        !isVolunteer &&
                        request.status !== "OPEN" && (
                          <Link
                            href={`/help-requests/${request.id}`}
                            style={styles.manageText}
                          >
                            View Details
                          </Link>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>No help requests found matching your criteria.</p>
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
