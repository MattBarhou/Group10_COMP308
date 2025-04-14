"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../lib/auth";

const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
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
      suggestedTime
    }
  }
`;

const VOLUNTEER_FOR_EVENT = gql`
  mutation VolunteerForEvent($eventId: ID!) {
    volunteerForEvent(eventId: $eventId) {
      id
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
    gap: "0.5rem",
  },
  volunteerButton: {
    backgroundColor: "#8B5CF6",
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
  pastEventNote: {
    backgroundColor: "#F3F4F6",
    color: "#4B5563",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    marginBottom: "1.5rem",
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
    backgroundColor: "#E0E7FF",
    color: "#4F46E5",
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

export default function EventDetails() {
  const { id } = useParams();

  // Use auth with try-catch to handle cases where context might not be available
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth provider not available:", error);
  }

  const { loading, error, data, refetch } = useQuery(GET_EVENT, {
    variables: { id },
  });

  const [volunteer, { loading: volunteerLoading }] = useMutation(
    VOLUNTEER_FOR_EVENT,
    {
      onCompleted: () => {
        refetch();
      },
    }
  );

  const handleVolunteer = () => {
    volunteer({
      variables: {
        eventId: id,
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
            <Link href="/events" style={styles.backLink}>
              ← Back to events
            </Link>
            <div style={styles.errorContainer}>
              <p>Error loading event: {error.message}</p>
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

  const event = data?.event;

  if (!event) {
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
            <Link href="/events" style={styles.backLink}>
              ← Back to events
            </Link>
            <div style={styles.errorContainer}>
              <p>Event not found.</p>
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

  const isOrganizer = auth?.user?.id === event.organizer.id;
  const isVolunteer = event.volunteers.some((v) => v.id === auth?.user?.id);
  const isPastEvent = new Date(event.date) < new Date();

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
          <Link href="/events" style={styles.backLink}>
            ← Back to events
          </Link>

          <div style={styles.eventCard}>
            <div style={styles.eventHeader}>
              <h1 style={styles.eventTitle}>{event.title}</h1>

              <div style={styles.eventOrganizer}>
                <span style={styles.organizerIcon}>👤</span>
                <span>
                  Organized by <strong>{event.organizer.username}</strong>
                </span>
              </div>
            </div>

            <div style={styles.eventContent}>
              <p style={styles.eventDescription}>{event.description}</p>

              <div style={styles.infoCards}>
                <div style={{ ...styles.infoCard, ...styles.timeCard }}>
                  <div style={styles.infoCardTitle}>
                    <span style={styles.timeIcon}>🕒</span>
                    <span>Date & Time</span>
                  </div>
                  <div style={styles.timeCardContent}>
                    {formatDate(event.date)}
                  </div>
                </div>

                <div style={{ ...styles.infoCard, ...styles.locationCard }}>
                  <div style={styles.infoCardTitle}>
                    <span style={styles.locationIcon}>📍</span>
                    <span>Location</span>
                  </div>
                  <div style={styles.locationCardContent}>{event.location}</div>
                </div>
              </div>

              {event.suggestedTime && (
                <div style={styles.suggestedTimeNote}>
                  <span>💡</span>
                  <div>
                    <strong>AI Suggested Time:</strong>{" "}
                    {formatDate(event.suggestedTime)}
                    <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                      This time was suggested based on local engagement
                      patterns.
                    </p>
                  </div>
                </div>
              )}

              {!isOrganizer && !isPastEvent && !isVolunteer && (
                <button
                  onClick={handleVolunteer}
                  disabled={volunteerLoading}
                  style={{
                    ...styles.volunteerButton,
                    ...(volunteerLoading ? styles.disabledButton : {}),
                  }}
                >
                  <span>👋</span>
                  {volunteerLoading
                    ? "Signing up..."
                    : "Volunteer for this event"}
                </button>
              )}

              {isVolunteer && (
                <div style={styles.alreadyVolunteeringNote}>
                  <span>✅</span>
                  <span>You're volunteering for this event</span>
                </div>
              )}

              {isPastEvent && (
                <div style={styles.pastEventNote}>
                  <p>This event has already taken place.</p>
                </div>
              )}

              <div>
                <h2 style={styles.sectionTitle}>
                  Volunteers ({event.volunteers.length})
                </h2>

                {event.volunteers.length === 0 ? (
                  <p style={styles.noVolunteersMessage}>No volunteers yet.</p>
                ) : (
                  <div style={styles.volunteersGrid}>
                    {event.volunteers.map((volunteer) => (
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
