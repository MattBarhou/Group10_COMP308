"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "../lib/auth";
import NavBar from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import { useAuth } from "../lib/auth";

export default function Layout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          <ProtectedLayout>{children}</ProtectedLayout>
        </body>
      </html>
    </AuthProvider>
  );
}

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
