"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth";
import Link from "next/link";

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
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "2rem",
  },
  headerTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#111827",
  },
  headerSubtitle: {
    color: "#4B5563",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  },
  cardLink: {
    display: "block",
    height: "100%",
    textDecoration: "none",
    color: "inherit",
  },
  cardContent: {
    padding: "1.5rem",
    flexGrow: 1,
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  icon: {
    width: "2.5rem",
    height: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    marginRight: "0.75rem",
    fontSize: "1.25rem",
  },
  newsIcon: {
    backgroundColor: "#EBF5FF",
    color: "#3B82F6",
  },
  helpIcon: {
    backgroundColor: "#D1FAE5",
    color: "#10B981",
  },
  alertIcon: {
    backgroundColor: "#FEE2E2",
    color: "#EF4444",
  },
  eventIcon: {
    backgroundColor: "#F5F3FF",
    color: "#8B5CF6",
  },
  businessIcon: {
    backgroundColor: "#FEF3C7",
    color: "#F59E0B",
  },
  profileIcon: {
    backgroundColor: "#E0E7FF",
    color: "#6366F1",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#111827",
  },
  cardText: {
    color: "#4B5563",
    marginBottom: "1rem",
  },
  cardFooter: {
    padding: "1rem 1.5rem",
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
  },
  roleSpecificSection: {
    marginTop: "2rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#111827",
  },
  footer: {
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
    padding: "1.5rem",
    textAlign: "center",
    color: "#6B7280",
  },
};

export default function Dashboard() {
  const router = useRouter();
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth provider not available:", error);
  }

  useEffect(() => {
    if (!auth || !auth.user) {
      router.push("/login");
    }
  }, [auth, router]);

  if (!auth || !auth.user) {
    return null;
  }

  const { user } = auth;

  const handleLogout = () => {
    auth.logout();
  };

  const roleText =
    user.role === "resident"
      ? "Resident"
      : user.role === "business_owner"
      ? "Business Owner"
      : "Community Organizer";

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
            <h1 style={styles.headerTitle}>Welcome, {user.username}!</h1>
            <p style={styles.headerSubtitle}>{roleText}</p>
          </div>

          {/* Main Feature Cards */}
          <div style={styles.grid}>
            <div style={styles.card}>
              <Link href="/posts" style={styles.cardLink}>
                <div style={styles.cardContent}>
                  <div style={styles.iconContainer}>
                    <div style={{ ...styles.icon, ...styles.newsIcon }}>📰</div>
                    <h2 style={styles.cardTitle}>Local News & Discussions</h2>
                  </div>
                  <p style={styles.cardText}>
                    Stay updated with what's happening in your community.
                  </p>
                </div>
                <div style={styles.cardFooter}>View posts</div>
              </Link>
            </div>

            <div style={styles.card}>
              <Link href="/help-requests" style={styles.cardLink}>
                <div style={styles.cardContent}>
                  <div style={styles.iconContainer}>
                    <div style={{ ...styles.icon, ...styles.helpIcon }}>🤝</div>
                    <h2 style={styles.cardTitle}>Help Requests</h2>
                  </div>
                  <p style={styles.cardText}>
                    Request help or offer assistance to neighbors in need.
                  </p>
                </div>
                <div style={styles.cardFooter}>Browse requests</div>
              </Link>
            </div>

            <div style={styles.card}>
              <Link href="/emergency-alerts" style={styles.cardLink}>
                <div style={styles.cardContent}>
                  <div style={styles.iconContainer}>
                    <div style={{ ...styles.icon, ...styles.alertIcon }}>
                      🚨
                    </div>
                    <h2 style={styles.cardTitle}>Emergency Alerts</h2>
                  </div>
                  <p style={styles.cardText}>
                    Get notified about urgent issues in your area.
                  </p>
                </div>
                <div style={styles.cardFooter}>View alerts</div>
              </Link>
            </div>

            <div style={styles.card}>
              <Link href="/events" style={styles.cardLink}>
                <div style={styles.cardContent}>
                  <div style={styles.iconContainer}>
                    <div style={{ ...styles.icon, ...styles.eventIcon }}>
                      📅
                    </div>
                    <h2 style={styles.cardTitle}>Community Events</h2>
                  </div>
                  <p style={styles.cardText}>
                    Discover and participate in local events and activities.
                  </p>
                </div>
                <div style={styles.cardFooter}>Browse events</div>
              </Link>
            </div>

            <div style={styles.card}>
              <Link href="/businesses" style={styles.cardLink}>
                <div style={styles.cardContent}>
                  <div style={styles.iconContainer}>
                    <div style={{ ...styles.icon, ...styles.businessIcon }}>
                      🏪
                    </div>
                    <h2 style={styles.cardTitle}>Local Businesses</h2>
                  </div>
                  <p style={styles.cardText}>
                    Support businesses in your community and find local deals.
                  </p>
                </div>
                <div style={styles.cardFooter}>View businesses</div>
              </Link>
            </div>

            <div style={styles.card}>
              <Link href="/profile" style={styles.cardLink}>
                <div style={styles.cardContent}>
                  <div style={styles.iconContainer}>
                    <div style={{ ...styles.icon, ...styles.profileIcon }}>
                      👤
                    </div>
                    <h2 style={styles.cardTitle}>Your Profile</h2>
                  </div>
                  <p style={styles.cardText}>
                    Manage your profile and account settings.
                  </p>
                </div>
                <div style={styles.cardFooter}>Edit profile</div>
              </Link>
            </div>
          </div>

          {/* Role-specific section */}
          {user.role === "business_owner" && (
            <div style={styles.roleSpecificSection}>
              <h2 style={styles.sectionTitle}>Business Management</h2>
              <div style={styles.grid}>
                <div style={styles.card}>
                  <Link href="/businesses/manage" style={styles.cardLink}>
                    <div style={styles.cardContent}>
                      <div style={styles.iconContainer}>
                        <div style={{ ...styles.icon, ...styles.businessIcon }}>
                          🏢
                        </div>
                        <h2 style={styles.cardTitle}>Manage Your Business</h2>
                      </div>
                      <p style={styles.cardText}>
                        Update your business profile, create deals, and respond
                        to reviews.
                      </p>
                    </div>
                    <div style={styles.cardFooter}>Manage business</div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {user.role === "community_organizer" && (
            <div style={styles.roleSpecificSection}>
              <h2 style={styles.sectionTitle}>Community Organization</h2>
              <div style={styles.grid}>
                <div style={styles.card}>
                  <Link href="/events/manage" style={styles.cardLink}>
                    <div style={styles.cardContent}>
                      <div style={styles.iconContainer}>
                        <div style={{ ...styles.icon, ...styles.eventIcon }}>
                          📋
                        </div>
                        <h2 style={styles.cardTitle}>Manage Events</h2>
                      </div>
                      <p style={styles.cardText}>
                        Create and manage community events and activities.
                      </p>
                    </div>
                    <div style={styles.cardFooter}>Organize events</div>
                  </Link>
                </div>
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
