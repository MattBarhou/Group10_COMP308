const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
// Load .env variables before using them
require('dotenv').config();
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const PORT = process.env.PORT || 4001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/community-app';
const JWT_SECRET = process.env.JWT_SECRET || 'community_app';

const app = express();

app.use(cors());
app.use(express.json());

const getUser = (token) => {
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded;
        } catch (error) {
            return null;
        }
    }
    return null;
};

async function startServer() {
    const server = new ApolloServer({
        schema: buildSubgraphSchema({ typeDefs, resolvers }),
        context: ({ req }) => {
            const authHeader = req.headers.authorization || '';
            let token = '';
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7).trim();
            }
            const user = getUser(token);
            return { user };
        },
        formatError: (error) => {
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
                console.log(`Auth service running on port ${PORT}`);
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