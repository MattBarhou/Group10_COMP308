const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const PORT = process.env.PORT || 4002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/community-app';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const app = express();

app.use(cors());
app.use(express.json());

const getUser = (token) => {
    if (token) {
        try {
            console.log('Attempting to verify token:', token);
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log('Decoded token:', decoded);
            return decoded;
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return null;
        }
    }
    console.log('No token provided');
    return null;
};

async function startServer() {
    const server = new ApolloServer({
        schema: buildSubgraphSchema({ typeDefs, resolvers }),
        context: ({ req }) => {
            console.log('Incoming request headers:', req.headers);
            const token = req.headers.authorization?.split(' ')[1] || '';
            console.log('Extracted token:', token);
            const user = getUser(token);
            console.log('User context:', user);
            return { user };
        },
        formatError: (error) => {
            console.error('GraphQL Error:', error);
            return {
                message: error.message,
                locations: error.locations,
                path: error.path,
            };
        },
    });

    await server.start();
    server.applyMiddleware({ app });

    mongoose
        .connect(MONGODB_URI)
        .then(() => {
            console.log('Connected to MongoDB');
            app.listen(PORT, () => {
                console.log(`Business events service running on port ${PORT}`);
                console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
            });
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error);
        });
}

startServer().catch((error) => {
    console.error('Server startup error:', error);
});