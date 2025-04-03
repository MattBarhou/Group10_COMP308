import {ApolloClient, InMemoryCache, createHttpLink, from} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {onError} from "@apollo/client/link/error";

// Error handling link
const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({message, locations, path}) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

// HTTP connection to the API
const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:4000/graphql',
});

// Auth link middleware - adds the token to headers
const authLink = setContext((_, {headers}) => {
    // Get the authentication token from local storage if it exists
    let token = null;

    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    }

    // Return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    };
});

// Create Apollo Client instance
const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
});

export default client;