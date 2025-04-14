"use client";
import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";

const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      description
      date
      location
      organizer {
        id
        username
      }
      volunteers {
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
  filterContainer: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  filterForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
  },
  filterGroup: {
    flexGrow: 1,
  },
  label: {
    display: "block",
    fontWeight: "500",
    marginBottom: "0.5rem",
    color: "#4B5563",
    fontSize: "0.875rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    outline: "none",
  },
  searchIcon: {
    position: "absolute",
    top: "50%",
    left: "0.75rem",
    transform: "translateY(-50%)",
    color: "#9CA3AF",
  },
  searchInput: {
    width: "100%",
    paddingLeft: "2.5rem",
    padding: "0.75rem 0.75rem 0.75rem 2.5rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    outline: "none",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#111827",
  },
  eventsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem",
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  eventCardLink: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  eventCardHeader: {
    padding: "1.5rem 1.5rem 1rem",
    flexGrow: 1,
  },
  eventTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "0.75rem",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  eventIcon: {
    color: "#8B5CF6",
  },
  eventDescription: {
    color: "#4B5563",
    fontSize: "0.875rem",
    marginBottom: "1rem",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  eventMeta: {
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.25rem",
  },
  metaIcon: {
    marginRight: "0.5rem",
  },
  eventCardFooter: {
    padding: "1rem 1.5rem",
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
    fontSize: "0.875rem",
    color: "#6B7280",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  volunteerCount: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  pastEvent: {
    opacity: 0.75,
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
    borderTopColor: "#8B5CF6",
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

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");

  // Use auth with try-catch to handle cases where context might not be available
  let auth = useAuth();
  // try {
  //   auth = useAuth();
  // } catch (error) {
  //   console.error("Auth provider not available:", error);
  // }

  const { loading, error, data } = useQuery(GET_EVENTS);

  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout();
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Filter events based on search term
  const filteredEvents = data?.events
    ? data.events.filter((event) => {
        return (
          searchTerm === "" ||
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  // Sort events by date (upcoming first)
  const sortedEvents = [...(filteredEvents || [])].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.date) >= now
  );
  const pastEvents = sortedEvents.filter((event) => new Date(event.date) < now);

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
            <h1 style={styles.headerTitle}>Community Events</h1>
            <p>Discover and participate in local events and activities.</p>
          </div>

          <div style={styles.filterContainer}>
            <div style={styles.filterForm}>
              <div style={styles.filterRow}>
                <div style={{ ...styles.filterGroup, position: "relative" }}>
                  <label htmlFor="search" style={styles.label}>
                    Search Events
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                      id="search"
                      type="text"
                      placeholder="Search by title, description or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={styles.searchInput}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
            </div>
          ) : error ? (
            <div style={styles.errorContainer}>
              <p>Error loading events: {error.message}</p>
            </div>
          ) : (
            <>
              {/* Upcoming Events */}
              <h2 style={styles.sectionTitle}>Upcoming Events</h2>

              {upcomingEvents.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>No upcoming events found.</p>
                </div>
              ) : (
                <div style={styles.eventsGrid}>
                  {upcomingEvents.map((event) => (
                    <div key={event.id} style={styles.eventCard}>
                      <Link
                        href={`/events/${event.id}`}
                        style={styles.eventCardLink}
                      >
                        <div style={styles.eventCardHeader}>
                          <h3 style={styles.eventTitle}>
                            <span style={styles.eventIcon}>📅</span>
                            {event.title}
                          </h3>

                          <p style={styles.eventDescription}>
                            {event.description}
                          </p>

                          <div style={styles.eventMeta}>
                            <div style={styles.metaItem}>
                              <span style={styles.metaIcon}>🕒</span>
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div style={styles.metaItem}>
                              <span style={styles.metaIcon}>📍</span>
                              <span>{event.location}</span>
                            </div>
                            <div style={styles.metaItem}>
                              <span style={styles.metaIcon}>👤</span>
                              <span>
                                Organized by {event.organizer.username}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div style={styles.eventCardFooter}>
                          <div style={styles.volunteerCount}>
                            <span>👥</span>
                            <span>
                              {event.volunteers.length}{" "}
                              {event.volunteers.length === 1
                                ? "volunteer"
                                : "volunteers"}{" "}
                              signed up
                            </span>
                          </div>
                          <span style={{ color: "#8B5CF6", fontWeight: "500" }}>
                            View Details
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <>
                  <h2 style={styles.sectionTitle}>Past Events</h2>
                  <div style={styles.eventsGrid}>
                    {pastEvents.map((event) => (
                      <div
                        key={event.id}
                        style={{ ...styles.eventCard, ...styles.pastEvent }}
                      >
                        <Link
                          href={`/events/${event.id}`}
                          style={styles.eventCardLink}
                        >
                          <div style={styles.eventCardHeader}>
                            <h3 style={styles.eventTitle}>
                              <span style={styles.eventIcon}>📅</span>
                              {event.title}
                            </h3>

                            <p style={styles.eventDescription}>
                              {event.description}
                            </p>

                            <div style={styles.eventMeta}>
                              <div style={styles.metaItem}>
                                <span style={styles.metaIcon}>🕒</span>
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <div style={styles.metaItem}>
                                <span style={styles.metaIcon}>📍</span>
                                <span>{event.location}</span>
                              </div>
                              <div style={styles.metaItem}>
                                <span style={styles.metaIcon}>👤</span>
                                <span>
                                  Organized by {event.organizer.username}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div style={styles.eventCardFooter}>
                            <div style={styles.volunteerCount}>
                              <span>👥</span>
                              <span>
                                {event.volunteers.length}{" "}
                                {event.volunteers.length === 1
                                  ? "volunteer"
                                  : "volunteers"}{" "}
                                participated
                              </span>
                            </div>
                            <span
                              style={{ color: "#8B5CF6", fontWeight: "500" }}
                            >
                              View Details
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
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
