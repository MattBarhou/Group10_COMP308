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
        __resolveReference: async (ref) => {
            return await Business.findById(ref.id);
        },
        deals: async (parent) => {
            return await Deal.find({ businessId: parent.id });
        },
        reviews: async (parent) => {
            return await Review.find({ businessId: parent.id });
        },
        owner: (business) => {
            return { id: business.ownerId }; // Return a reference to User
        },
    },

    Deal: {
        __resolveReference: async (ref) => {
            return await Deal.findById(ref.id);
        },
        business: async (parent) => {
            return await Business.findById(parent.businessId);
        },
    },

    Review: {
        __resolveReference: async (ref) => {
            return await Review.findById(ref.id);
        },
        business: async (parent) => {
            return await Business.findById(parent.businessId);
        },
        sentimentFeedback: (parent) => {
            if (parent.sentimentScore !== undefined) {
                return getSentimentFeedback(parent.sentimentScore);
            }
            return null;
        },
        user: (review) => {
            return { id: review.userId }; // Return a reference to User
        },
    },

    User: {
        businesses: async (user) => {
            return await Business.find({ ownerId: user.id });
        },
    },

    Query: {
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
        getDealsByBusinessId: async (_, { businessId }) => {
            return await Deal.find({ businessId }).sort({ createdAt: -1 });
        },
        getActiveDeals: async () => {
            const now = new Date();
            return await Deal.find({
                active: true,
                startDate: { $lte: now },
                endDate: { $gte: now },
            }).sort({ createdAt: -1 });
        },
        getReviewsByBusinessId: async (_, { businessId }) => {
            return await Review.find({ businessId }).sort({ createdAt: -1 });
        },
    },

    Mutation: {
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
                createdAt: new Date().toISOString(),
            });
            return await business.save();
        },
        createDeal: async (_, { input }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            await checkBusinessOwner(input.businessId, user.id);
            const deal = new Deal({
                ...input,
                active: true,
                createdAt: new Date().toISOString(),
            });
            return await deal.save();
        },
        createReview: async (_, { input }, { user }) => {
            if (!user) {
                throw new Error('Authentication required');
            }
            const { businessId, rating, text } = input;
            const business = await Business.findById(businessId);
            if (!business) {
                throw new Error('Business not found');
            }
            if (user.role === 'business_owner' && business.ownerId.toString() === user.id) {
                throw new Error('You cannot review your own business');
            }
            const sentimentScore = analyzeSentiment(text);
            const review = new Review({
                businessId,
                userId: user.id,
                rating,
                text,
                sentimentScore,
                createdAt: new Date().toISOString(),
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
            await checkBusinessOwner(review.businessId, user.id);
            review.response = {
                text,
                createdAt: new Date().toISOString(),
            };
            return await review.save();
        },
    },
};

module.exports = resolvers;