"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";
import {gql, useMutation} from "@apollo/client";
import {router} from "next/client.js";
import {useRouter} from "next/navigation";

// GraphQL Queries and Mutations

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        username
        email
        role
        profileImage
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
  },
  formContainer: {
    width: "100%",
    maxWidth: "28rem",
  },
  formCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#111827",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
    color: "#374151",
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
  button: {
    width: "100%",
    backgroundColor: "#3B82F6",
    color: "white",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    border: "none",
    fontWeight: "500",
    cursor: "pointer",
  },
  footer: {
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "0.875rem",
    color: "#4B5563",
  },
  footerLink: {
    color: "#3B82F6",
    fontWeight: "500",
    textDecoration: "none",
  },
};

export default function Register() {
  const auth = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("resident");
  const [error, setError] = useState("");
  const [registerUser, {loading}] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      auth.login(data.register.token, data.register.user);
      router.push('/login');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    console.log("Registration attempt with:", {username, email, password, role,});

    if (auth && auth.login) {
      // const mockToken = "mock-token-123";
      // const mockUser = { id: "123", username, email, role };
      // auth.login(mockToken, mockUser);
      await registerUser({
        variables: {
          input: {
            username,
            email,
            password,
            role,
          },
        },
      });
      alert("User Registered successfully! Now you can login")
      router.push('/login')
    } else {
      console.log(
        "Auth provider not available, registration functionality limited"
      );
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
            <Link href="/login" style={styles.loginLink}>
              Login
            </Link>
            <Link href="/register" style={styles.registerLink}>
              Register
            </Link>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.formContainer}>
          <div style={styles.formCard}>
            <h1 style={styles.title}>Create Account</h1>

            {error && (
              <div
                style={{
                  backgroundColor: "#FEE2E2",
                  color: "#B91C1C",
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label htmlFor="username" style={styles.label}>
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="confirmPassword" style={styles.label}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="role" style={styles.label}>
                  I am registering as a:
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={styles.select}
                >
                  <option value="resident">Resident</option>
                  <option value="business_owner">Business Owner</option>
                  <option value="community_organizer">
                    Community Organizer
                  </option>
                </select>
              </div>

              <button type="submit" style={styles.button}>
                Sign Up
              </button>
            </form>

            <div style={styles.footer}>
              Already have an account?{" "}
              <Link href="/login" style={styles.footerLink}>
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
