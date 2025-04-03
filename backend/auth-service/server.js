const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

// Environment variables should be properly set in production
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27018/community-app';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JWT authentication middleware
const getUser = (token) => {
    if (token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
    return null;
};

// Apollo Server setup
async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req}) => {
            // Get token from headers
            const token = req.headers.authorization?.split(' ')[1] || '';

            // Verify token and get user
            const user = getUser(token);

            return {user};
        },
        formatError: (error) => {
            console.log(error);
            return {
                message: error.message,
                locations: error.locations,
                path: error.path,
            };
        },
    });

    await server.start();
    server.applyMiddleware({app});

    // Connect to MongoDB
    mongoose
        .connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
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