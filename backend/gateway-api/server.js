const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } = require('@apollo/gateway');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    willSendRequest({ request, context }) {
        // Forward the authorization header
        if (context?.headers?.authorization) {
            request.http.headers.set('authorization', context.headers.authorization);
        }
    }
}

// Setup Apollo Gateway
const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
        subgraphs: [
            { name: 'auth', url: process.env.AUTH_SERVICE_URL || 'http://localhost:4001/graphql' },
            { name: 'business-events', url: process.env.BUSINESS_EVENTS_SERVICE_URL || 'http://localhost:4002/graphql' },
            { name: 'community', url: process.env.COMMUNITY_SERVICE_URL || 'http://localhost:4003/graphql' },
        ],
    }),
    buildService({ name, url }) {
        return new AuthenticatedDataSource({ url });
    },
});

// Initialize Apollo Server
async function startServer() {
    const app = express();
    app.use(cors());

    const server = new ApolloServer({
        gateway,
        subscriptions: false,
        introspection: true,
        context: ({ req }) => {
            return {
                headers: {
                    authorization: req.headers.authorization || '',
                },
            };
        },
    });

    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`Gateway API running at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer().catch((err) => {
    console.error('Error starting the gateway server:', err);
});