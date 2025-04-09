const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    posts: [Post]
    helpRequests: [HelpRequest]
    emergencyAlerts: [EmergencyAlert]
    events: [Event]
  }

  type Post @key(fields: "id") {
    id: ID!
    title: String!
    content: String!
    author: User!
    createdAt: String!
    type: PostType!
    summary: String
  }

  type HelpRequest @key(fields: "id") {
    id: ID!
    title: String!
    description: String!
    requester: User!
    createdAt: String!
    status: RequestStatus!
    matchedVolunteers: [User]
  }

  type EmergencyAlert @key(fields: "id") {
    id: ID!
    title: String!
    description: String!
    reporter: User!
    createdAt: String!
    severity: AlertSeverity!
    location: String!
  }

  type Event @key(fields: "id") {
    id: ID!
    title: String!
    description: String!
    organizer: User!
    date: String!
    location: String!
    volunteers: [User]
    suggestedTime: String
  }

  enum PostType {
    NEWS
    DISCUSSION
  }

  enum RequestStatus {
    OPEN
    IN_PROGRESS
    COMPLETED
  }

  enum AlertSeverity {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  type Query {
    posts: [Post]
    helpRequests: [HelpRequest]
    emergencyAlerts: [EmergencyAlert]
    events: [Event]
    post(id: ID!): Post
    helpRequest(id: ID!): HelpRequest
    emergencyAlert(id: ID!): EmergencyAlert
    event(id: ID!): Event
  }

  type Mutation {
    createPost(title: String!, content: String!, type: PostType!): Post
    createHelpRequest(title: String!, description: String!): HelpRequest
    createEmergencyAlert(title: String!, description: String!, severity: AlertSeverity!, location: String!): EmergencyAlert
    createEvent(title: String!, description: String!, date: String!, location: String!): Event
    volunteerForEvent(eventId: ID!): Event
    volunteerForHelpRequest(requestId: ID!): HelpRequest
  }
`;

module.exports = typeDefs; 