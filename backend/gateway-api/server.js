const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } = require('@apollo/gateway');
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
        ],
    }),
    buildService({ name, url }) {
        return new AuthenticatedDataSource({ url });
    },
});

// Initialize Apollo Server
async function startServer() {
    const server = new ApolloServer({
        gateway,
        subscriptions: false,
        introspection: true,
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: PORT },
        context: async ({ req }) => {
            return {
                headers: {
                    authorization: req.headers.authorization || '',
                },
            };
        },
    });

    console.log(`Gateway API running at ${url}`);
}

startServer().catch((err) => {
    console.error('Error starting the gateway server:', err);
});