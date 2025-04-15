"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Link from "next/link";
import { useAuth } from "../../../../lib/auth";

const GET_MY_EVENTS = gql`
  query GetMyEvents {
    events {
      id
      title
      description
      date
      location
      organizer {
        id
      }
      volunteers {
        id
        username
      }
    }
  }
`;

const CREATE_EVENT = gql`
  mutation CreateEvent(
    $title: String!
    $description: String!
    $date: String!
    $location: String!
  ) {
    createEvent(
      title: $title
      description: $description
      date: $date
      location: $location
    ) {
      id
      title
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
  addButton: {
    backgroundColor: "#8B5CF6",
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
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1.5rem",
  },
  formFullWidth: {
    gridColumn: "span 2",
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
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gridColumn: "span 2",
  },
  submitButton: {
    backgroundColor: "#8B5CF6",
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
  eventsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  eventHeader: {
    padding: "1.5rem 1.5rem 1rem",
  },
  eventTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#111827",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewLink: {
    color: "#8B5CF6",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
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
  pastEvent: {
    opacity: 0.75,
  },
  eventFooter: {
    padding: "1rem 1.5rem",
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  volunteerCount: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  manageLink: {
    color: "#8B5CF6",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  emptyState: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    padding: "3rem",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "1.5rem",
    color: "#9CA3AF",
  },
  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#111827",
  },
  emptyText: {
    color: "#4B5563",
    marginBottom: "1.5rem",
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
  footer: {
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
    padding: "1.5rem",
    textAlign: "center",
    color: "#6B7280",
  },
};

export default function ManageEvents() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  // Use auth with try-catch to handle cases where context might not be available
  let auth = useAuth();
  // try {
  //   auth = useAuth();
  // } catch (error) {
  //   console.error("Auth provider not available:", error);
  // }

  const { loading, error, data, refetch } = useQuery(GET_MY_EVENTS);

  const [createEvent, { loading: createLoading }] = useMutation(CREATE_EVENT, {
    onCompleted: () => {
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
      });
      refetch();
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createEvent({
      variables: {
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        location: formData.location,
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

  // Filter events organized by the current user
  const myEvents =
    data?.events.filter((event) => event.organizer.id === auth?.user?.id) || [];

  // Sort events by date (upcoming first)
  const sortedEvents = [...myEvents].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

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
            <Link href="/events" style={styles.navLink}>
              Events
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
            <h1 style={styles.headerTitle}>Manage Your Events</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              style={styles.addButton}
            >
              {showForm ? "Cancel" : "+ Create Event"}
            </button>
          </div>

          {showForm && (
            <div style={styles.formContainer}>
              <h2 style={styles.formTitle}>Create New Event</h2>
              <form onSubmit={handleSubmit}>
                <div style={styles.formGrid}>
                  <div style={styles.formFullWidth}>
                    <label htmlFor="title" style={styles.label}>
                      Event Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formFullWidth}>
                    <label htmlFor="description" style={styles.label}>
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      style={styles.textarea}
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="date" style={styles.label}>
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label htmlFor="location" style={styles.label}>
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
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
                      {createLoading ? "Creating..." : "Create Event"}
                    </button>
                  </div>
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
              <p>Error loading your events: {error.message}</p>
            </div>
          ) : myEvents.length > 0 ? (
            <>
              {upcomingEvents.length > 0 && (
                <>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      color: "#111827",
                    }}
                  >
                    Upcoming Events
                  </h2>
                  <div style={styles.eventsGrid}>
                    {upcomingEvents.map((event) => (
                      <div key={event.id} style={styles.eventCard}>
                        <div style={styles.eventHeader}>
                          <div style={styles.eventTitle}>
                            <span>{event.title}</span>
                            <Link
                              href={`/events/${event.id}`}
                              style={styles.viewLink}
                            >
                              View
                            </Link>
                          </div>

                          <div style={styles.eventMeta}>
                            <div style={styles.metaItem}>
                              <span style={styles.metaIcon}>🕒</span>
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div style={styles.metaItem}>
                              <span style={styles.metaIcon}>📍</span>
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>

                        <div style={styles.eventFooter}>
                          <div style={styles.volunteerCount}>
                            <span>👥</span>
                            <span>
                              {event.volunteers.length}{" "}
                              {event.volunteers.length === 1
                                ? "volunteer"
                                : "volunteers"}
                            </span>
                          </div>
                          <Link
                            href={`/events/${event.id}/edit`}
                            style={styles.manageLink}
                          >
                            Edit Event
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {pastEvents.length > 0 && (
                <>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      margin: "2rem 0 1rem",
                      color: "#111827",
                    }}
                  >
                    Past Events
                  </h2>
                  <div style={styles.eventsGrid}>
                    {pastEvents.map((event) => (
                      <div
                        key={event.id}
                        style={{ ...styles.eventCard, ...styles.pastEvent }}
                      >
                        <div style={styles.eventHeader}>
                          <div style={styles.eventTitle}>
                            <span>{event.title}</span>
                            <Link
                              href={`/events/${event.id}`}
                              style={styles.viewLink}
                            >
                              View
                            </Link>
                          </div>

                          <div style={styles.eventMeta}>
                            <div style={styles.metaItem}>
                              <span style={styles.metaIcon}>🕒</span>
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div style={styles.metaItem}>
                              <span style={styles.metaIcon}>📍</span>
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>

                        <div style={styles.eventFooter}>
                          <div style={styles.volunteerCount}>
                            <span>👥</span>
                            <span>
                              {event.volunteers.length}{" "}
                              {event.volunteers.length === 1
                                ? "volunteer"
                                : "volunteers"}
                            </span>
                          </div>
                          <span
                            style={{ color: "#9CA3AF", fontSize: "0.875rem" }}
                          >
                            Completed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📅</div>
              <h2 style={styles.emptyTitle}>No Events Yet</h2>
              <p style={styles.emptyText}>
                You haven&apos;t created any events yet. Create your first event to
                get started.
              </p>
              <button
                onClick={() => setShowForm(true)}
                style={styles.addButton}
              >
                Create Your First Event
              </button>
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
