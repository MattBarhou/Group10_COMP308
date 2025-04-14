"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../lib/auth";

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
  loginLink: {
    color: "#4B5563",
    textDecoration: "none",
  },
  registerLink: {
    backgroundColor: "#3B82F6",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
  },
  main: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: "#3B82F6",
    color: "white",
    padding: "5rem 1.5rem",
    textAlign: "center",
  },
  heroInner: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
  },
  heroText: {
    fontSize: "1.25rem",
    maxWidth: "800px",
    margin: "0 auto 2.5rem",
  },
  ctaButton: {
    backgroundColor: "white",
    color: "#3B82F6",
    padding: "0.75rem 2rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
    fontWeight: "500",
    display: "inline-block",
  },
  dashboardButton: {
    backgroundColor: "white",
    color: "#3B82F6",
    padding: "0.75rem 2rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
    fontWeight: "500",
    display: "inline-block",
  },
  featuresSection: {
    padding: "5rem 1.5rem",
    backgroundColor: "white",
  },
  featuresInner: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "3rem",
    textAlign: "center",
    color: "#111827",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
  },
  featureCard: {
    padding: "2rem",
    borderRadius: "0.5rem",
    backgroundColor: "#F9FAFB",
    textAlign: "center",
  },
  featureIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "3rem",
    height: "3rem",
    borderRadius: "9999px",
    backgroundColor: "#EBF5FF",
    color: "#3B82F6",
    margin: "0 auto 1rem",
    fontSize: "1.5rem",
  },
  featureTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    color: "#111827",
  },
  featureText: {
    color: "#4B5563",
  },
  howItWorksSection: {
    padding: "5rem 1.5rem",
    backgroundColor: "#F9FAFB",
  },
  stepsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  stepCard: {
    textAlign: "center",
  },
  stepNumber: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "3rem",
    height: "3rem",
    borderRadius: "9999px",
    backgroundColor: "#EBF5FF",
    color: "#3B82F6",
    margin: "0 auto 1rem",
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
  stepTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    color: "#111827",
  },
  stepText: {
    color: "#4B5563",
  },
  ctaSection: {
    padding: "5rem 1.5rem",
    backgroundColor: "#3B82F6",
    color: "white",
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#1F2937",
    color: "white",
    padding: "3rem 1.5rem",
  },
  footerInner: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "2rem",
    marginBottom: "2rem",
  },
  footerColumn: {
    marginBottom: "1.5rem",
  },
  footerTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  footerLinks: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  footerLink: {
    marginBottom: "0.5rem",
  },
  footerLinkAnchor: {
    color: "#9CA3AF",
    textDecoration: "none",
  },
  copyright: {
    borderTop: "1px solid #374151",
    paddingTop: "1.5rem",
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: "0.875rem",
  },
};

export default function Home() {
  let auth = useAuth();
  // try {
  //   auth = useAuth();
  // } catch (error) {
  //   console.error("Auth provider not available:", error);
  // }

  const isLoggedIn = auth && auth.user;

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <Link href="/" style={styles.logo}>
            Community App
          </Link>
          <div style={styles.navLinks}>
            {!isLoggedIn ? (
              <>
                <Link href="/login" style={styles.loginLink}>
                  Login
                </Link>
                <Link href="/register" style={styles.registerLink}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" style={styles.loginLink}>
                  Dashboard
                </Link>
                <button
                  onClick={() => auth.logout()}
                  style={{
                    ...styles.registerLink,
                    backgroundColor: "#F87171",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroInner}>
            <h1 style={styles.heroTitle}>Connect With Your Community</h1>
            <p style={styles.heroText}>
              Stay informed, support local businesses, and help your neighbors
              in one place.
            </p>
            {!isLoggedIn ? (
              <Link href="/register" style={styles.ctaButton}>
                Join Your Community
              </Link>
            ) : (
              <Link href="/dashboard" style={styles.dashboardButton}>
                Go to Dashboard
              </Link>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section style={styles.featuresSection}>
          <div style={styles.featuresInner}>
            <h2 style={styles.sectionTitle}>Connecting People & Places</h2>

            <div style={styles.featuresGrid}>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📰</div>
                <h3 style={styles.featureTitle}>Local News & Discussions</h3>
                <p style={styles.featureText}>
                  Stay informed about what&apos;s happening in your neighborhood and
                  join community discussions.
                </p>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🏪</div>
                <h3 style={styles.featureTitle}>Support Local Businesses</h3>
                <p style={styles.featureText}>
                  Discover and support local businesses, find deals, and leave
                  reviews.
                </p>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🤝</div>
                <h3 style={styles.featureTitle}>Help & Get Help</h3>
                <p style={styles.featureText}>
                  Request assistance from neighbors or volunteer to help others
                  in your community.
                </p>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🔔</div>
                <h3 style={styles.featureTitle}>Emergency Alerts</h3>
                <p style={styles.featureText}>
                  Get notified about urgent issues in your area and stay safe
                  with real-time updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section style={styles.howItWorksSection}>
          <div style={styles.featuresInner}>
            <h2 style={styles.sectionTitle}>How It Works</h2>

            <div style={styles.stepsContainer}>
              <div style={styles.stepCard}>
                <div style={styles.stepNumber}>1</div>
                <h3 style={styles.stepTitle}>Create an Account</h3>
                <p style={styles.stepText}>
                  Sign up as a resident, business owner, or community organizer
                  to access features specific to your role.
                </p>
              </div>

              <div style={styles.stepCard}>
                <div style={styles.stepNumber}>2</div>
                <h3 style={styles.stepTitle}>Connect With Your Community</h3>
                <p style={styles.stepText}>
                  Browse local businesses, join events, participate in
                  discussions, and offer help to neighbors.
                </p>
              </div>

              <div style={styles.stepCard}>
                <div style={styles.stepNumber}>3</div>
                <h3 style={styles.stepTitle}>Make a Difference</h3>
                <p style={styles.stepText}>
                  Strengthen your community by supporting local initiatives,
                  helping neighbors, and staying connected.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section style={styles.ctaSection}>
          <div style={styles.heroInner}>
            <h2 style={styles.heroTitle}>Join Your Community Today</h2>
            <p style={styles.heroText}>
              Connect with neighbors, support local businesses, and make your
              community stronger.
            </p>
            {!isLoggedIn ? (
              <Link href="/register" style={styles.ctaButton}>
                Get Started
              </Link>
            ) : (
              <Link href="/dashboard" style={styles.dashboardButton}>
                Go to Dashboard
              </Link>
            )}
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerGrid}>
            <div style={styles.footerColumn}>
              <h3 style={styles.footerTitle}>Community Engagement App</h3>
              <p style={{ color: "#9CA3AF", marginBottom: "1rem" }}>
                Connecting people and strengthening communities through
                technology.
              </p>
            </div>

            <div style={styles.footerColumn}>
              <h3 style={styles.footerTitle}>Features</h3>
              <ul style={styles.footerLinks}>
                <li style={styles.footerLink}>
                  <Link href="/businesses" style={styles.footerLinkAnchor}>
                    Local Businesses
                  </Link>
                </li>
                <li style={styles.footerLink}>
                  <Link href="/events" style={styles.footerLinkAnchor}>
                    Community Events
                  </Link>
                </li>
                <li style={styles.footerLink}>
                  <Link href="/help-requests" style={styles.footerLinkAnchor}>
                    Help Requests
                  </Link>
                </li>
                <li style={styles.footerLink}>
                  <Link
                    href="/emergency-alerts"
                    style={styles.footerLinkAnchor}
                  >
                    Emergency Alerts
                  </Link>
                </li>
                <li style={styles.footerLink}>
                  <Link href="/posts" style={styles.footerLinkAnchor}>
                    News & Discussions
                  </Link>
                </li>
              </ul>
            </div>

            <div style={styles.footerColumn}>
              <h3 style={styles.footerTitle}>About</h3>
              <ul style={styles.footerLinks}>
                <li style={styles.footerLink}>
                  <a href="#" style={styles.footerLinkAnchor}>
                    Our Mission
                  </a>
                </li>
                <li style={styles.footerLink}>
                  <a href="#" style={styles.footerLinkAnchor}>
                    Meet the Team
                  </a>
                </li>
                <li style={styles.footerLink}>
                  <a href="#" style={styles.footerLinkAnchor}>
                    Careers
                  </a>
                </li>
                <li style={styles.footerLink}>
                  <a href="#" style={styles.footerLinkAnchor}>
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div style={styles.footerColumn}>
              <h3 style={styles.footerTitle}>Legal</h3>
              <ul style={styles.footerLinks}>
                <li style={styles.footerLink}>
                  <a href="#" style={styles.footerLinkAnchor}>
                    Privacy Policy
                  </a>
                </li>
                <li style={styles.footerLink}>
                  <a href="#" style={styles.footerLinkAnchor}>
                    Terms of Service
                  </a>
                </li>
                <li style={styles.footerLink}>
                  <a href="#" style={styles.footerLinkAnchor}>
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div style={styles.copyright}>
            <p>
              © {new Date().getFullYear()} Community Engagement App. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
