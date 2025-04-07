const { gql } = require('apollo-server-express');

const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", 
                     import: ["@key", "@shareable"])
  
  type User @key(fields: "id") {
    id: ID!
    username: String!
    email: String!
    role: String!
    profileImage: String
    bio: String
    location: String
    createdAt: String
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    role: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateUserInput {
    username: String
    email: String
    bio: String
    location: String
    profileImage: String
  }

  type Query {
    getCurrentUser: User
    getUserById(id: ID!): User
  }

  type Mutation {
    register(input: RegisterInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    updateUser(input: UpdateUserInput!): User!
    changePassword(currentPassword: String!, newPassword: String!): Boolean!
    deleteAccount: Boolean!
  }
`;

module.exports = typeDefs;