"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";

const GET_EMERGENCY_ALERTS = gql`
  query GetEmergencyAlerts {
    emergencyAlerts {
      id
      title
      description
      severity
      location
      createdAt
      reporter {
        id
        username
      }
    }
  }
`;

const CREATE_EMERGENCY_ALERT = gql`
  mutation CreateEmergencyAlert(
    $title: String!
    $description: String!
    $severity: AlertSeverity!
    $location: String!
  ) {
    createEmergencyAlert(
      title: $title
      description: $description
      severity: $severity
      location: $location
    ) {
      id
      title
      description
      severity
      location
      createdAt
      reporter {
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
  reportButton: {
    backgroundColor: "#EF4444",
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
    minHeight: "120px",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    outline: "none",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  submitButton: {
    backgroundColor: "#EF4444",
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
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "0.75rem",
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
  alertsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  alertCard: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  alertContent: {
    padding: "1.5rem",
  },
  alertHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "0.75rem",
  },
  alertTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.5rem",
  },
  alertSeverityBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  alertDescription: {
    color: "#4B5563",
    marginBottom: "1rem",
  },
  alertLocation: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#4B5563",
    fontSize: "0.875rem",
    marginBottom: "0.5rem",
  },
  alertFooter: {
    borderTop: "1px solid #E5E7EB",
    padding: "1rem 1.5rem",
    backgroundColor: "#F9FAFB",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  viewDetailsLink: {
    color: "#EF4444",
    textDecoration: "none",
    fontWeight: "500",
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
    borderTopColor: "#EF4444",
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

export default function EmergencyAlerts() {
  const [showNewAlertForm, setShowNewAlertForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [location, setLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  // Use auth with try-catch to handle cases where context might not be available
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth provider not available:", error);
  }

  const { loading, error, data, refetch } = useQuery(GET_EMERGENCY_ALERTS);

  const [createAlert, { loading: createLoading }] = useMutation(
    CREATE_EMERGENCY_ALERT,
    {
      onCompleted: () => {
        setShowNewAlertForm(false);
        setTitle("");
        setDescription("");
        setSeverity("MEDIUM");
        setLocation("");
        refetch();
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    createAlert({
      variables: {
        title,
        description,
        severity,
        location,
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
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "LOW":
        return {
          badge: { backgroundColor: "#DBEAFE", color: "#1E40AF" },
          icon: "🔵",
        };
      case "MEDIUM":
        return {
          badge: { backgroundColor: "#FEF3C7", color: "#92400E" },
          icon: "🟡",
        };
      case "HIGH":
        return {
          badge: { backgroundColor: "#FFEDD5", color: "#C2410C" },
          icon: "🟠",
        };
      case "CRITICAL":
        return {
          badge: { backgroundColor: "#FEE2E2", color: "#B91C1C" },
          icon: "🔴",
        };
      default:
        return {
          badge: { backgroundColor: "#F3F4F6", color: "#4B5563" },
          icon: "ℹ️",
        };
    }
  };

  // Filter alerts based on search term and severity
  const filteredAlerts = data?.emergencyAlerts
    ? data.emergencyAlerts.filter((alert) => {
        const matchesSearch =
          searchTerm === "" ||
          alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSeverity =
          severityFilter === "" || alert.severity === severityFilter;

        return matchesSearch && matchesSeverity;
      })
    : [];

  // Sort alerts by severity (critical first) and then by date
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

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
            <h1 style={styles.headerTitle}>Emergency Alerts</h1>
            <button
              onClick={() => setShowNewAlertForm(!showNewAlertForm)}
              style={styles.reportButton}
            >
              {showNewAlertForm ? "Cancel" : "⚠️ Report Emergency"}
            </button>
          </div>

          {showNewAlertForm && (
            <div style={styles.formContainer}>
              <h2 style={styles.formTitle}>Report an Emergency</h2>
              <form onSubmit={handleSubmit}>
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
                    placeholder="Brief description of the emergency"
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
                    placeholder="Provide detailed information about the emergency"
                  ></textarea>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="severity" style={styles.label}>
                    Severity
                  </label>
                  <select
                    id="severity"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    style={styles.select}
                  >
                    <option value="LOW">Low - Informational, non-urgent</option>
                    <option value="MEDIUM">
                      Medium - Requires attention, not immediate danger
                    </option>
                    <option value="HIGH">
                      High - Urgent situation, potential danger
                    </option>
                    <option value="CRITICAL">
                      Critical - Immediate action required, danger present
                    </option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="location" style={styles.label}>
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="Specific address or area affected"
                  />
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
                    {createLoading ? "Submitting..." : "Submit Alert"}
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
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.inputWithIcon}
                  />
                </div>
              </div>

              <div style={styles.filterGroup}>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  style={styles.select}
                >
                  <option value="">All Severities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
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
              <p>Error loading alerts: {error.message}</p>
            </div>
          ) : sortedAlerts.length > 0 ? (
            <div style={styles.alertsList}>
              {sortedAlerts.map((alert) => {
                const severityStyle = getSeverityColor(alert.severity);

                return (
                  <div key={alert.id} style={styles.alertCard}>
                    <div style={styles.alertContent}>
                      <div style={styles.alertHeader}>
                        <h2 style={styles.alertTitle}>
                          {severityStyle.icon} {alert.title}
                        </h2>
                        <span
                          style={{
                            ...styles.alertSeverityBadge,
                            ...severityStyle.badge,
                          }}
                        >
                          {alert.severity}
                        </span>
                      </div>

                      <p style={styles.alertDescription}>{alert.description}</p>

                      <div style={styles.alertLocation}>
                        <span>📍</span>
                        <span>{alert.location}</span>
                      </div>
                    </div>

                    <div style={styles.alertFooter}>
                      <span>
                        Reported by {alert.reporter.username} on{" "}
                        {formatDate(alert.createdAt)}
                      </span>
                      <Link
                        href={`/emergency-alerts/${alert.id}`}
                        style={styles.viewDetailsLink}
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>No emergency alerts at this time.</p>
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
