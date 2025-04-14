"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Link from "next/link";
import { useAuth } from "../../../../lib/auth";

const GET_MY_BUSINESSES = gql`
  query GetMyBusinesses {
    getBusinessesByOwnerId {
      id
      name
      description
      category
      address
      phone
      email
    }
  }
`;

const CREATE_BUSINESS = gql`
  mutation CreateBusiness($input: BusinessInput!) {
    createBusiness(input: $input) {
      id
      name
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
    backgroundColor: "#3B82F6",
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
  businessesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  businessCard: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  businessHeader: {
    padding: "1.5rem 1.5rem 1rem",
  },
  businessTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#111827",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  businessCategory: {
    display: "inline-block",
    backgroundColor: "#EBF5FF",
    color: "#1E40AF",
    fontSize: "0.75rem",
    fontWeight: "500",
    padding: "0.25rem 0.5rem",
    borderRadius: "9999px",
    marginBottom: "0.75rem",
  },
  businessDescription: {
    color: "#4B5563",
    fontSize: "0.875rem",
    marginBottom: "1rem",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  businessFooter: {
    padding: "1rem 1.5rem",
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
    display: "flex",
    justifyContent: "space-between",
  },
  footerLink: {
    color: "#3B82F6",
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
    borderTopColor: "#3B82F6",
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

export default function ManageBusinesses() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    address: "",
    phone: "",
    email: "",
  });

  // Use auth with try-catch to handle cases where context might not be available
  let auth = useAuth();
  // try {
  //   auth = useAuth();
  // } catch (error) {
  //   console.error("Auth provider not available:", error);
  // }

  const { loading, error, data, refetch } = useQuery(GET_MY_BUSINESSES);

  const [createBusiness, { loading: createLoading }] = useMutation(
    CREATE_BUSINESS,
    {
      onCompleted: () => {
        setShowForm(false);
        setFormData({
          name: "",
          description: "",
          category: "",
          address: "",
          phone: "",
          email: "",
        });
        refetch();
      },
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createBusiness({
      variables: {
        input: formData,
      },
    });
  };

  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout();
    }
  };

  const myBusinesses = data?.getBusinessesByOwnerId || [];

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
            <Link href="/businesses" style={styles.navLink}>
              Businesses
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
            <h1 style={styles.headerTitle}>Manage Your Businesses</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              style={styles.addButton}
            >
              {showForm ? "Cancel" : "+ Add Business"}
            </button>
          </div>

          {showForm && (
            <div style={styles.formContainer}>
              <h2 style={styles.formTitle}>Add New Business</h2>
              <form onSubmit={handleSubmit}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label htmlFor="name" style={styles.label}>
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="category" style={styles.label}>
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                      placeholder="e.g. Restaurant, Retail, Services"
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

                  <div style={styles.formGroup}>
                    <label htmlFor="address" style={styles.label}>
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="phone" style={styles.label}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formFullWidth}>
                    <label htmlFor="email" style={styles.label}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
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
                      {createLoading ? "Creating..." : "Create Business"}
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
              <p>Error loading your businesses: {error.message}</p>
            </div>
          ) : myBusinesses.length > 0 ? (
            <div style={styles.businessesGrid}>
              {myBusinesses.map((business) => (
                <div key={business.id} style={styles.businessCard}>
                  <div style={styles.businessHeader}>
                    <div style={styles.businessTitle}>
                      <span>{business.name}</span>
                      <Link
                        href={`/businesses/${business.id}`}
                        style={{
                          textDecoration: "none",
                          color: "#3B82F6",
                          fontSize: "0.875rem",
                        }}
                      >
                        View
                      </Link>
                    </div>
                    <div style={styles.businessCategory}>
                      {business.category}
                    </div>
                    <p style={styles.businessDescription}>
                      {business.description}
                    </p>
                  </div>
                  <div style={styles.businessFooter}>
                    <Link
                      href={`/businesses/${business.id}/deals`}
                      style={styles.footerLink}
                    >
                      Manage Deals
                    </Link>
                    <Link
                      href={`/businesses/${business.id}/reviews`}
                      style={styles.footerLink}
                    >
                      View Reviews
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🏪</div>
              <h2 style={styles.emptyTitle}>No Businesses Yet</h2>
              <p style={styles.emptyText}>
                You haven&apos;t created any businesses yet. Add your first business
                to get started.
              </p>
              <button
                onClick={() => setShowForm(true)}
                style={styles.addButton}
              >
                Add Your First Business
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
