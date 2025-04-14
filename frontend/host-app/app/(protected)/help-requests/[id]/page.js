"use client";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../lib/auth";

const GET_HELP_REQUEST = gql`
  query GetHelpRequest($id: ID!) {
    helpRequest(id: $id) {
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
    maxWidth: "800px",
    margin: "0 auto",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    color: "#4B5563",
    textDecoration: "none",
    marginBottom: "1.5rem",
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    marginBottom: "2rem",
  },
  requestHeader: {
    padding: "1.5rem 1.5rem 1rem",
    borderBottom: "1px solid #E5E7EB",
  },
  requestHeaderTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  requestTitle: {
    fontSize: "1.75rem",
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
  requestMeta: {
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  requestContent: {
    padding: "1.5rem",
  },
  requestDescription: {
    color: "#4B5563",
    marginBottom: "1.5rem",
    lineHeight: "1.6",
  },
  actionButton: {
    backgroundColor: "#10B981",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    border: "none",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  disabledButton: {
    opacity: "0.5",
    cursor: "not-allowed",
  },
  alreadyVolunteeringNote: {
    backgroundColor: "#F0FDF4",
    color: "#166534",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  statusUpdateNote: {
    backgroundColor: "#F3F4F6",
    color: "#4B5563",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#111827",
  },
  volunteersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "1rem",
  },
  volunteerCard: {
    backgroundColor: "#F9FAFB",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  volunteerAvatar: {
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "9999px",
    backgroundColor: "#ECFDF5",
    color: "#10B981",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  volunteerName: {
    fontWeight: "500",
    color: "#111827",
  },
  noVolunteersMessage: {
    color: "#6B7280",
    textAlign: "center",
    padding: "2rem 0",
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
  footer: {
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
    padding: "1.5rem",
    textAlign: "center",
    color: "#6B7280",
  },
};

export default function HelpRequestDetail() {
  const { id } = useParams();

  // Use auth with try-catch to handle cases where context might not be available
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth provider not available:", error);
  }

  const { loading, error, data, refetch } = useQuery(GET_HELP_REQUEST, {
    variables: { id },
  });

  const [volunteerForHelpRequest, { loading: volunteerLoading }] = useMutation(
    VOLUNTEER_FOR_HELP_REQUEST,
    {
      onCompleted: () => {
        refetch();
      },
    }
  );

  const handleVolunteer = () => {
    volunteerForHelpRequest({
      variables: {
        requestId: id,
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
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
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
              <Link href="/help-requests" style={styles.navLink}>
                Help Requests
              </Link>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main style={styles.main}>
          <div style={styles.content}>
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
            </div>
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

  if (error) {
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
              <Link href="/help-requests" style={styles.navLink}>
                Help Requests
              </Link>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main style={styles.main}>
          <div style={styles.content}>
            <Link href="/help-requests" style={styles.backLink}>
              ← Back to help requests
            </Link>
            <div style={styles.errorContainer}>
              <p>Error loading help request: {error.message}</p>
            </div>
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

  const request = data?.helpRequest;

  if (!request) {
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
              <Link href="/help-requests" style={styles.navLink}>
                Help Requests
              </Link>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main style={styles.main}>
          <div style={styles.content}>
            <Link href="/help-requests" style={styles.backLink}>
              ← Back to help requests
            </Link>
            <div style={styles.errorContainer}>
              <p>Help request not found.</p>
            </div>
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
            <Link href="/help-requests" style={styles.navLink}>
              Help Requests
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.content}>
          <Link href="/help-requests" style={styles.backLink}>
            ← Back to help requests
          </Link>

          <div style={styles.requestCard}>
            <div style={styles.requestHeader}>
              <div style={styles.requestHeaderTop}>
                <h1 style={styles.requestTitle}>{request.title}</h1>
                <span style={{ ...styles.requestStatus, ...statusStyle }}>
                  {request.status.replace("_", " ")}
                </span>
              </div>

              <div style={styles.requestMeta}>
                <span>
                  Requested by <strong>{request.requester.username}</strong> on{" "}
                  {formatDate(request.createdAt)}
                </span>
              </div>
            </div>

            <div style={styles.requestContent}>
              <p style={styles.requestDescription}>{request.description}</p>

              {!isRequester && request.status === "OPEN" && !isVolunteer && (
                <button
                  onClick={handleVolunteer}
                  disabled={volunteerLoading}
                  style={{
                    ...styles.actionButton,
                    ...(volunteerLoading ? styles.disabledButton : {}),
                  }}
                >
                  <span>🤝</span>
                  {volunteerLoading ? "Signing up..." : "Volunteer to Help"}
                </button>
              )}

              {isVolunteer && (
                <div style={styles.alreadyVolunteeringNote}>
                  <span>✅</span>
                  <span>You're currently helping with this request</span>
                </div>
              )}

              {request.status === "COMPLETED" && (
                <div
                  style={{
                    ...styles.statusUpdateNote,
                    backgroundColor: "#D1FAE5",
                    color: "#065F46",
                  }}
                >
                  <span>🎉</span>
                  <span>This help request has been completed!</span>
                </div>
              )}

              {isRequester && request.status === "OPEN" && (
                <div style={styles.statusUpdateNote}>
                  <span>ℹ️</span>
                  <span>
                    When someone volunteers to help, the status will change to
                    "In Progress".
                  </span>
                </div>
              )}

              {isRequester && request.status === "IN_PROGRESS" && (
                <div style={styles.statusUpdateNote}>
                  <span>ℹ️</span>
                  <span>
                    When the help is complete, you can mark this request as
                    "Completed".
                  </span>
                </div>
              )}

              <div>
                <h2 style={styles.sectionTitle}>
                  Volunteers ({request.matchedVolunteers.length})
                </h2>

                {request.matchedVolunteers.length === 0 ? (
                  <p style={styles.noVolunteersMessage}>No volunteers yet.</p>
                ) : (
                  <div style={styles.volunteersGrid}>
                    {request.matchedVolunteers.map((volunteer) => (
                      <div key={volunteer.id} style={styles.volunteerCard}>
                        <div style={styles.volunteerAvatar}>
                          {volunteer.username.charAt(0).toUpperCase()}
                        </div>
                        <div style={styles.volunteerName}>
                          {volunteer.username}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
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
