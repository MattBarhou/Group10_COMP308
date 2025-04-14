"use client";
import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";

const GET_BUSINESSES = gql`
  query GetBusinesses {
    getBusinesses {
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
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "0.5rem 0.75rem",
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
    padding: "0.5rem 0.75rem 0.5rem 2.5rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    outline: "none",
  },
  businessesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  businessCard: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  businessCardLink: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  businessCardHeader: {
    padding: "1.5rem 1.5rem 1rem",
    flexGrow: 1,
  },
  businessTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#111827",
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
  businessContact: {
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.25rem",
  },
  businessCardFooter: {
    padding: "1rem 1.5rem",
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
  },
  viewButton: {
    display: "block",
    textAlign: "center",
    color: "#3B82F6",
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

export default function Businesses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Use auth with try-catch to handle cases where context might not be available
  let auth = useAuth();
  // try {
  //   auth = useAuth();
  // } catch (error) {
  //   console.error("Auth provider not available:", error);
  // }

  const { loading, error, data } = useQuery(GET_BUSINESSES);

  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout();
    }
  };

  // Extract unique categories from businesses
  const categories = data?.getBusinesses
    ? [...new Set(data.getBusinesses.map((business) => business.category))]
    : [];

  // Filter businesses based on search term and category
  const filteredBusinesses = data?.getBusinesses
    ? data.getBusinesses.filter((business) => {
        const matchesSearch =
          searchTerm === "" ||
          business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "" || business.category === selectedCategory;

        return matchesSearch && matchesCategory;
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
            <h1 style={styles.headerTitle}>Local Businesses</h1>
            <p>Discover and support local businesses in your community.</p>
          </div>

          <div style={styles.filterContainer}>
            <div style={styles.filterForm}>
              <div style={styles.filterRow}>
                <div style={{ ...styles.filterGroup, position: "relative" }}>
                  <label htmlFor="search" style={styles.label}>
                    Search Businesses
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                      id="search"
                      type="text"
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={styles.searchInput}
                    />
                  </div>
                </div>

                <div style={styles.filterGroup}>
                  <label htmlFor="category" style={styles.label}>
                    Filter by Category
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
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
              <p>Error loading businesses: {error.message}</p>
            </div>
          ) : (
            <div style={styles.businessesGrid}>
              {filteredBusinesses.map((business) => (
                <div key={business.id} style={styles.businessCard}>
                  <Link
                    href={`/businesses/${business.id}`}
                    style={styles.businessCardLink}
                  >
                    <div style={styles.businessCardHeader}>
                      <h2 style={styles.businessTitle}>{business.name}</h2>
                      <div style={styles.businessCategory}>
                        {business.category}
                      </div>
                      <p style={styles.businessDescription}>
                        {business.description}
                      </p>
                      <div style={styles.businessContact}>
                        <div style={styles.contactItem}>
                          📍 {business.address}
                        </div>
                        <div style={styles.contactItem}>
                          📱 {business.phone}
                        </div>
                        <div style={styles.contactItem}>
                          ✉️ {business.email}
                        </div>
                      </div>
                    </div>
                    <div style={styles.businessCardFooter}>
                      <span style={styles.viewButton}>View Details</span>
                    </div>
                  </Link>
                </div>
              ))}

              {filteredBusinesses.length === 0 && (
                <div style={styles.emptyState} className="col-span-full">
                  <p>No businesses found matching your criteria.</p>
                </div>
              )}
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
