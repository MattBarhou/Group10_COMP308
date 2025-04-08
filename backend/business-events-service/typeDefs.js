const { gql } = require('apollo-server-express');

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@external", "@requires"])

  extend type User @key(fields: "id") {
    id: ID! @external
    businesses: [Business!]!  
  }

  type Business @key(fields: "id") {
    id: ID!
    name: String!
    ownerId: ID!
    owner: User!
    description: String!
    address: String!
    phone: String!
    email: String!
    category: String!
    createdAt: String!
    deals: [Deal]
    reviews: [Review]
  }

  type Deal @key(fields: "id") {
    id: ID!
    businessId: ID!
    title: String!
    description: String!
    startDate: String!
    endDate: String!
    discount: Float
    active: Boolean!
    createdAt: String!
    business: Business
  }

  type Review @key(fields: "id") {
    id: ID!
    businessId: ID!
    userId: ID!
    user: User!
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
    category: String!
  }

  input DealInput {
    businessId: ID!
    title: String!
    description: String!
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
    getBusinesses: [Business]
    getBusinessById(id: ID!): Business
    getBusinessesByOwnerId: [Business]
    getActiveDeals: [Deal]
    getDealsByBusinessId(businessId: ID!): [Deal]
    getReviewsByBusinessId(businessId: ID!): [Review]
  }

  type Mutation {
    createBusiness(input: BusinessInput!): Business!
    createDeal(input: DealInput!): Deal!
    createReview(input: ReviewInput!): Review!
    respondToReview(input: ReviewResponseInput!): Review!
  }
`;

module.exports = typeDefs;