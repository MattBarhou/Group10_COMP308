"use client";
import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "../lib/auth";
import { getApolloClient } from "../lib/apollo-client";

export function Providers({ children }) {
  const client = getApolloClient();

  return (
    <ApolloProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  );
}
