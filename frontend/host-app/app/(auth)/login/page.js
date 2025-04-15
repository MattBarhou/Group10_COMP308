"use client";
import { useState } from "react";
import Link from "next/link";
import {gql, useMutation} from "@apollo/client";
import {router} from "next/client.js";
import {useRouter} from "next/navigation";
import {useAuth} from "@/lib/auth.js";

// GraphQL Queries and Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
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

export default function Login() {
  const auth = useAuth();
  const [error, setError] = useState('');
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, {loading}] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      auth.login(data.login.token, data.login.user);
      router.push('/');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    console.log("Login attempt with:", email, password);
    try {
      await loginUser({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
    } catch (err) {
      // Error handling is already done in onError callback
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
            <h1 style={styles.title}>Sign In</h1>

            <form onSubmit={handleSubmit}>
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

              <button type="submit" style={styles.button}>
                Sign In
              </button>
            </form>

            <div style={styles.footer}>
              Don&apos;t have an account?{" "}
              <Link href="/register" style={styles.footerLink}>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
