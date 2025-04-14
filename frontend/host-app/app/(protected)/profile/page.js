"use client";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useAuth } from "../../../lib/auth";
import Link from "next/link";

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      username
      email
      bio
      location
      profileImage
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
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
  header: {
    marginBottom: "2rem",
  },
  headerTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#111827",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    marginBottom: "2rem",
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid #E5E7EB",
  },
  tab: {
    padding: "1rem 1.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  activeTab: {
    backgroundColor: "#EBF5FF",
    color: "#1E40AF",
    borderBottom: "2px solid #3B82F6",
  },
  inactiveTab: {
    color: "#6B7280",
    borderBottom: "2px solid transparent",
  },
  cardContent: {
    padding: "1.5rem",
  },
  successMessage: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    marginBottom: "1.5rem",
  },
  errorMessage: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    marginBottom: "1.5rem",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  formRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  formRowItem: {
    flex: 1,
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#4B5563",
    marginBottom: "0.5rem",
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
  },
  button: {
    backgroundColor: "#3B82F6",
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
  accountInfo: {
    backgroundColor: "#F9FAFB",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
  },
  accountInfoTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "1rem",
  },
  infoRow: {
    display: "flex",
    marginBottom: "0.5rem",
  },
  infoLabel: {
    width: "8rem",
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  infoValue: {
    fontSize: "0.875rem",
    color: "#111827",
    fontWeight: "500",
  },
  footer: {
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
    padding: "1.5rem",
    textAlign: "center",
    color: "#6B7280",
  },
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    bio: "",
    location: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Use auth with try-catch to handle cases where context might not be available
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth provider not available:", error);
  }

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    },
    onError: (error) => {
      setUpdateError(error.message);
    },
  });

  const [changePassword, { loading: passwordLoading }] = useMutation(
    CHANGE_PASSWORD,
    {
      onCompleted: () => {
        setPasswordSuccess(true);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setPasswordSuccess(false), 3000);
      },
      onError: (error) => {
        setPasswordError(error.message);
      },
    }
  );

  // Initialize form data with user data when available
  useState(() => {
    if (auth?.user) {
      setProfileData({
        username: auth.user.username || "",
        email: auth.user.email || "",
        bio: auth.user.bio || "",
        location: auth.user.location || "",
      });
    }
  }, [auth?.user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setUpdateError("");
    updateUser({
      variables: {
        input: profileData,
      },
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    changePassword({
      variables: {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
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
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.headerTitle}>Your Profile</h1>
          </div>

          <div style={styles.card}>
            <div style={styles.tabs}>
              <div
                style={{
                  ...styles.tab,
                  ...(activeTab === "profile"
                    ? styles.activeTab
                    : styles.inactiveTab),
                }}
                onClick={() => setActiveTab("profile")}
              >
                Profile Information
              </div>
              <div
                style={{
                  ...styles.tab,
                  ...(activeTab === "security"
                    ? styles.activeTab
                    : styles.inactiveTab),
                }}
                onClick={() => setActiveTab("security")}
              >
                Security
              </div>
            </div>

            <div style={styles.cardContent}>
              {activeTab === "profile" && (
                <div>
                  <div style={styles.accountInfo}>
                    <h3 style={styles.accountInfoTitle}>Account Information</h3>
                    <div style={styles.infoRow}>
                      <div style={styles.infoLabel}>Username:</div>
                      <div style={styles.infoValue}>
                        {auth?.user?.username || "Loading..."}
                      </div>
                    </div>
                    <div style={styles.infoRow}>
                      <div style={styles.infoLabel}>Email:</div>
                      <div style={styles.infoValue}>
                        {auth?.user?.email || "Loading..."}
                      </div>
                    </div>
                    <div style={styles.infoRow}>
                      <div style={styles.infoLabel}>Role:</div>
                      <div style={styles.infoValue}>
                        {auth?.user?.role === "resident"
                          ? "Resident"
                          : auth?.user?.role === "business_owner"
                          ? "Business Owner"
                          : "Community Organizer"}
                      </div>
                    </div>
                    <div style={styles.infoRow}>
                      <div style={styles.infoLabel}>Member Since:</div>
                      <div style={styles.infoValue}>
                        {auth?.user?.createdAt
                          ? formatDate(auth.user.createdAt)
                          : "Loading..."}
                      </div>
                    </div>
                  </div>

                  {updateSuccess && (
                    <div style={styles.successMessage}>
                      Profile updated successfully!
                    </div>
                  )}

                  {updateError && (
                    <div style={styles.errorMessage}>{updateError}</div>
                  )}

                  <form onSubmit={handleProfileSubmit}>
                    <div style={styles.formRow}>
                      <div style={styles.formRowItem}>
                        <label htmlFor="username" style={styles.label}>
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={profileData.username}
                          onChange={handleProfileChange}
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.formRowItem}>
                        <label htmlFor="email" style={styles.label}>
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          style={styles.input}
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label htmlFor="location" style={styles.label}>
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={profileData.location}
                        onChange={handleProfileChange}
                        placeholder="e.g. San Francisco, CA"
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label htmlFor="bio" style={styles.label}>
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        placeholder="Tell us a bit about yourself..."
                        style={styles.textarea}
                      ></textarea>
                    </div>

                    <div style={styles.formActions}>
                      <button
                        type="submit"
                        disabled={updateLoading}
                        style={{
                          ...styles.button,
                          ...(updateLoading ? styles.disabledButton : {}),
                        }}
                      >
                        {updateLoading ? "Updating..." : "Update Profile"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  {passwordSuccess && (
                    <div style={styles.successMessage}>
                      Password changed successfully!
                    </div>
                  )}

                  {passwordError && (
                    <div style={styles.errorMessage}>{passwordError}</div>
                  )}

                  <form onSubmit={handlePasswordSubmit}>
                    <div style={styles.formGroup}>
                      <label htmlFor="currentPassword" style={styles.label}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label htmlFor="newPassword" style={styles.label}>
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label htmlFor="confirmPassword" style={styles.label}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formActions}>
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        style={{
                          ...styles.button,
                          ...(passwordLoading ? styles.disabledButton : {}),
                        }}
                      >
                        {passwordLoading
                          ? "Changing Password..."
                          : "Change Password"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
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
