const Business = require('./models/Business');
const Deal = require('./models/Deal');
const Review = require('./models/Review');
const { analyzeSentiment, getSentimentFeedback } = require('./utils/sentimentAnalysis');

// Helper functions
const checkBusinessOwner = async (businessId, userId) => {
    const business = await Business.findById(businessId);
    if (!business) {
        throw new Error('Business not found');
    }

    if (business.ownerId.toString() !== userId.toString()) {
        throw new Error('You do not have permission to perform this action');
    }

    return business;
};

const resolvers = {
    Business: {
        deals: async (parent) => {
            return await Deal.find({ businessId: parent.id });
        },
        reviews: async (parent) => {
            return await Review.find({ businessId: parent.id });
        }
    },

    Deal: {
        business: async (parent) => {
            return await Business.findById(parent.businessId);
        }
    },

    Review: {
        business: async (parent) => {
            return await Business.findById(parent.businessId);
        },
        sentimentFeedback: (parent) => {
            if (parent.sentimentScore !== undefined) {
                return getSentimentFeedback(parent.sentimentScore);
            }
            return null;
        }
    },

    Query: {
        // Business queries
        getBusinesses: async () => {
            return await Business.find().sort({ createdAt: -1 });
        },

        getBusinessById: async (_, { id }) => {
            return await Business.findById(id);
        },

        getBusinessesByOwnerId: async (_, __, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            if (user.role !== 'business_owner') {
                throw new Error('Only business owners can access this resource');
            }

            return await Business.find({ ownerId: user.id }).sort({ createdAt: -1 });
        },

        // Deal queries
        getDealsByBusinessId: async (_, { businessId }) => {
            return await Deal.find({ businessId }).sort({ createdAt: -1 });
        },

        getActiveDeals: async () => {
            const now = new Date();
            return await Deal.find({
                active: true,
                startDate: { $lte: now },
                endDate: { $gte: now }
            }).sort({ createdAt: -1 });
        },

        // Review queries
        getReviewsByBusinessId: async (_, { businessId }) => {
            return await Review.find({ businessId }).sort({ createdAt: -1 });
        }
    },

    Mutation: {
        // Business mutations
        createBusiness: async (_, { input }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            if (user.role !== 'business_owner') {
                throw new Error('Only business owners can create businesses');
            }

            const business = new Business({
                ...input,
                ownerId: user.id,
                createdAt: new Date()
            });

            return await business.save();
        },

        // Deal mutations
        createDeal: async (_, { input }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            await checkBusinessOwner(input.businessId, user.id);

            const deal = new Deal({
                ...input,
                active: true,
                createdAt: new Date()
            });

            return await deal.save();
        },

        // Review mutations
        createReview: async (_, { input }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            const { businessId, rating, text } = input;

            // Check if business exists
            const business = await Business.findById(businessId);
            if (!business) {
                throw new Error('Business not found');
            }

            // Prevent business owners from reviewing their own business
            if (user.role === 'business_owner' && business.ownerId.toString() === user.id) {
                throw new Error('You cannot review your own business');
            }

            // Analyze sentiment
            const sentimentScore = analyzeSentiment(text);

            const review = new Review({
                businessId,
                userId: user.id,
                rating,
                text,
                sentimentScore,
                createdAt: new Date()
            });

            return await review.save();
        },

        respondToReview: async (_, { input }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }

            const { reviewId, text } = input;

            const review = await Review.findById(reviewId);
            if (!review) {
                throw new Error('Review not found');
            }

            // Check if user is the business owner
            await checkBusinessOwner(review.businessId, user.id);

            // Add response to review
            review.response = {
                text,
                createdAt: new Date()
            };

            return await review.save();
        }
    }
};

module.exports = resolvers; 