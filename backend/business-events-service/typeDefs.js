const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Business {
    id: ID!
    name: String!
    ownerId: ID!
    description: String!
    address: String!
    phone: String!
    email: String!
    images: [String]
    category: String!
    createdAt: String!
    deals: [Deal]
    reviews: [Review]
  }

  type Deal {
    id: ID!
    businessId: ID!
    title: String!
    description: String!
    image: String
    startDate: String!
    endDate: String!
    discount: Float
    active: Boolean!
    createdAt: String!
    business: Business
  }

  type Review {
    id: ID!
    businessId: ID!
    userId: ID!
    rating: Int!
    text: String!
    sentimentScore: Float
    sentimentFeedback: SentimentFeedback
    response: ReviewResponse
    createdAt: String!
    business: Business
  }

  type ReviewResponse {
    text: String
    createdAt: String
  }

  type SentimentFeedback {
    score: Float!
    sentiment: String!
    feedback: String!
  }

  input BusinessInput {
    name: String!
    description: String!
    address: String!
    phone: String!
    email: String!
    images: [String]
    category: String!
  }

  input DealInput {
    businessId: ID!
    title: String!
    description: String!
    image: String
    startDate: String!
    endDate: String!
    discount: Float
  }

  input ReviewInput {
    businessId: ID!
    rating: Int!
    text: String!
  }

  input ReviewResponseInput {
    reviewId: ID!
    text: String!
  }

  type Query {
    # Business queries
    getBusinesses: [Business]
    getBusinessById(id: ID!): Business
    getBusinessesByOwnerId: [Business]
    
    # Deal queries
    getActiveDeals: [Deal]
    getDealsByBusinessId(businessId: ID!): [Deal]
    
    # Review queries
    getReviewsByBusinessId(businessId: ID!): [Review]
  }

  type Mutation {
    # Business mutations
    createBusiness(input: BusinessInput!): Business!
    
    # Deal mutations
    createDeal(input: DealInput!): Deal!
    
    # Review mutations
    createReview(input: ReviewInput!): Review!
    respondToReview(input: ReviewResponseInput!): Review!
  }
`;

module.exports = typeDefs; 