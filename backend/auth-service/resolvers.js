const jwt = require('jsonwebtoken');
// Load environment variables
require('dotenv').config();
const User = require('./models/User');

// Use the environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'community_app';

// Helper to generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const resolvers = {
    User: {
        // Add a resolver for User references from other services
        __resolveReference: async (reference) => {
            return await User.findById(reference.id);
        }
    },

    Query: {
        getCurrentUser: async (_, __, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            try {
                return await User.findById(user.id);
            } catch (error) {
                throw new Error('Error fetching user data');
            }
        },

        getUserById: async (_, { id }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            try {
                return await User.findById(id);
            } catch (error) {
                throw new Error('Error fetching user data');
            }
        },
    },

    Mutation: {
        register: async (_, { input }) => {
            const { username, email, password, role } = input;

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                throw new Error('User already exists with that email or username');
            }

            try {
                // Create new user
                const user = new User({
                    username,
                    email,
                    password,
                    role,
                });

                const savedUser = await user.save();

                // Generate token
                const token = generateToken(savedUser);

                return {
                    token,
                    user: savedUser,
                };
            } catch (error) {
                throw new Error(`Registration failed: ${error.message}`);
            }
        },

        login: async (_, { input }) => {
            const { email, password } = input;

            // Find user by email
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Check password
            const isMatch = await user.comparePassword(password);

            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            // Generate token
            const token = generateToken(user);

            return {
                token,
                user,
            };
        },

        updateUser: async (_, { input }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            try {
                const updatedUser = await User.findByIdAndUpdate(
                    user.id,
                    { $set: input },
                    { new: true }
                );

                return updatedUser;
            } catch (error) {
                throw new Error(`Update failed: ${error.message}`);
            }
        },

        changePassword: async (_, { currentPassword, newPassword }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            try {
                // Get user with password
                const userDoc = await User.findById(user.id);

                // Verify current password
                const isMatch = await userDoc.comparePassword(currentPassword);

                if (!isMatch) {
                    throw new Error('Current password is incorrect');
                }

                // Update password
                userDoc.password = newPassword;
                await userDoc.save();

                return true;
            } catch (error) {
                throw new Error(`Password change failed: ${error.message}`);
            }
        },

        deleteAccount: async (_, __, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            try {
                await User.findByIdAndDelete(user.id);
                return true;
            } catch (error) {
                throw new Error(`Account deletion failed: ${error.message}`);
            }
        },
    },
};

module.exports = resolvers;