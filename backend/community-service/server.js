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

// Import JWT_SECRET from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'community_app';

const app = express();

app.use(cors());
app.use(express.json());

const getUser = (token) => {
    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
};

async function startServer() {
    const server = new ApolloServer({
        schema: buildSubgraphSchema({ typeDefs, resolvers }),
        context: ({ req }) => {
            const authHeader = req.headers.authorization || '';
            let token = '';
            console.log(authHeader);
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7).trim();
            }
            console.log(token)
            const user = getUser(token);
            console.log(user)
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
        .connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('Connected to MongoDB');
            app.listen(process.env.PORT, () => {
                console.log(`Community service running on port ${process.env.PORT}`);
                console.log(`GraphQL endpoint: http://localhost:${process.env.PORT}${server.graphqlPath}`);
            });
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error);
        });
}

startServer().catch((error) => {
    console.error('Server startup error:', error);
});
