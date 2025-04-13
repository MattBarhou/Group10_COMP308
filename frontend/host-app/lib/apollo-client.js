import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Create a HTTP link to the GraphQL API
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
});

// Auth link to add the token to the headers
const authLink = setContext((_, { headers }) => {
  // Get the token from localStorage if available
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  // Return the headers to the context
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create the Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add fields that should be merged
          getBusinesses: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          events: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          posts: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          helpRequests: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          emergencyAlerts: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

export default client;
