"use client";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../lib/auth";

const GET_EMERGENCY_ALERT = gql`
  query GetEmergencyAlert($id: ID!) {
    emergencyAlert(id: $id) {
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
  alertCard: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    marginBottom: "2rem",
  },
  alertHeader: {
    padding: "1.5rem 1.5rem 1rem",
    borderBottom: "1px solid #E5E7EB",
  },
  alertBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },
  alertType: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  alertTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.5rem",
  },
  alertMeta: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.875rem",
    color: "#6B7280",
    marginBottom: "0.5rem",
  },
  alertSeverity: {
    marginLeft: "auto",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  alertContent: {
    padding: "1.5rem",
  },
  alertDescription: {
    color: "#4B5563",
    marginBottom: "1.5rem",
    lineHeight: "1.6",
  },
  alertLocation: {
    backgroundColor: "#F3F4F6",
    padding: "1rem",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  locationIcon: {
    color: "#EF4444",
  },
  safetyTipsCard: {
    backgroundColor: "#DBEAFE",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  },
  safetyTipsTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  safetyTipsList: {
    listStyleType: "disc",
    paddingLeft: "1.5rem",
    color: "#1E3A8A",
  },
  safetyTip: {
    marginBottom: "0.5rem",
  },
  emergencyContactsCard: {
    backgroundColor: "#FEE2E2",
    borderRadius: "0.5rem",
    padding: "1.5rem",
  },
  emergencyContactsTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#B91C1C",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  emergencyContactsList: {
    color: "#991B1B",
  },
  emergencyContact: {
    marginBottom: "0.5rem",
    display: "flex",
    justifyContent: "space-between",
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
  footer: {
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
    padding: "1.5rem",
    textAlign: "center",
    color: "#6B7280",
  },
};

export default function EmergencyAlertDetails() {
  const { id } = useParams();

  // Use auth with try-catch to handle cases where context might not be available
  let auth = useAuth();
  // try {
  //   auth = useAuth();
  // } catch (error) {
  //   console.error("Auth provider not available:", error);
  // }

  const { loading, error, data } = useQuery(GET_EMERGENCY_ALERT, {
    variables: { id },
  });

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

  const getSeverityData = (severity) => {
    switch (severity) {
      case "LOW":
        return {
          badge: { backgroundColor: "#DBEAFE", color: "#1E40AF" },
          icon: "🔵",
          banner: { backgroundColor: "#EFF6FF" },
        };
      case "MEDIUM":
        return {
          badge: { backgroundColor: "#FEF3C7", color: "#92400E" },
          icon: "🟡",
          banner: { backgroundColor: "#FFFBEB" },
        };
      case "HIGH":
        return {
          badge: { backgroundColor: "#FFEDD5", color: "#C2410C" },
          icon: "🟠",
          banner: { backgroundColor: "#FFF7ED" },
        };
      case "CRITICAL":
        return {
          badge: { backgroundColor: "#FEE2E2", color: "#B91C1C" },
          icon: "🔴",
          banner: { backgroundColor: "#FEF2F2" },
        };
      default:
        return {
          badge: { backgroundColor: "#F3F4F6", color: "#4B5563" },
          icon: "ℹ️",
          banner: { backgroundColor: "#F9FAFB" },
        };
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
              <Link href="/emergency-alerts" style={styles.navLink}>
                Alerts
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
              <Link href="/emergency-alerts" style={styles.navLink}>
                Alerts
              </Link>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main style={styles.main}>
          <div style={styles.content}>
            <Link href="/emergency-alerts" style={styles.backLink}>
              ← Back to alerts
            </Link>
            <div style={styles.errorContainer}>
              <p>Error loading emergency alert: {error.message}</p>
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

  const alert = data?.emergencyAlert;

  if (!alert) {
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
              <Link href="/emergency-alerts" style={styles.navLink}>
                Alerts
              </Link>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main style={styles.main}>
          <div style={styles.content}>
            <Link href="/emergency-alerts" style={styles.backLink}>
              ← Back to alerts
            </Link>
            <div style={styles.errorContainer}>
              <p>Emergency alert not found.</p>
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

  const severityData = getSeverityData(alert.severity);

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
            <Link href="/emergency-alerts" style={styles.navLink}>
              Alerts
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.content}>
          <Link href="/emergency-alerts" style={styles.backLink}>
            ← Back to alerts
          </Link>

          <div style={styles.alertCard}>
            <div style={{ ...styles.alertHeader, ...severityData.banner }}>
              <div style={styles.alertBanner}>
                <div style={styles.alertType}>
                  <span style={{ fontSize: "1.25rem" }}>
                    {severityData.icon}
                  </span>
                  <span>Emergency Alert</span>
                </div>
                <span
                  style={{
                    ...styles.alertSeverity,
                    ...severityData.badge,
                  }}
                >
                  {alert.severity}
                </span>
              </div>

              <h1 style={styles.alertTitle}>{alert.title}</h1>

              <div style={styles.alertMeta}>
                <span>
                  Reported by {alert.reporter.username} on{" "}
                  {formatDate(alert.createdAt)}
                </span>
              </div>
            </div>

            <div style={styles.alertContent}>
              <p style={styles.alertDescription}>{alert.description}</p>

              <div style={styles.alertLocation}>
                <span style={styles.locationIcon}>📍</span>
                <strong>Location:</strong> {alert.location}
              </div>

              {/* Safety Tips Section */}
              <div style={styles.safetyTipsCard}>
                <h3 style={styles.safetyTipsTitle}>
                  <span>⚠️</span>
                  Safety Tips
                </h3>
                <ul style={styles.safetyTipsList}>
                  <li style={styles.safetyTip}>
                    Stay informed and follow official guidance
                  </li>
                  <li style={styles.safetyTip}>
                    Be aware of your surroundings
                  </li>
                  <li style={styles.safetyTip}>Have an emergency plan ready</li>
                  <li style={styles.safetyTip}>
                    Help others who may need assistance if it&apos;s safe to do so
                  </li>
                </ul>
              </div>

              {/* Emergency Contacts Section */}
              <div style={styles.emergencyContactsCard}>
                <h3 style={styles.emergencyContactsTitle}>
                  <span>📞</span>
                  Emergency Contacts
                </h3>
                <div style={styles.emergencyContactsList}>
                  <div style={styles.emergencyContact}>
                    <strong>Emergency Services:</strong>
                    <span>911</span>
                  </div>
                  <div style={styles.emergencyContact}>
                    <strong>Police Non-Emergency:</strong>
                    <span>555-123-4567</span>
                  </div>
                  <div style={styles.emergencyContact}>
                    <strong>Community Center:</strong>
                    <span>555-987-6543</span>
                  </div>
                </div>
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
