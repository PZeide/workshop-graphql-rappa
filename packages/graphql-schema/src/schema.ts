export default `#graphql
scalar DateTime

directive @auth(requires: UserRole = ADMIN) on OBJECT | FIELD_DEFINITION

enum UserRole {
  USER
  ADMIN
}

type User {
  id: ID!
  email: String!
  comments: [Comment!]!
  role: UserRole!
}

type Project {
  id: ID!
  slug: String!
  name: String!
  description: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  comments: [Comment!]!
}

enum TaskState {
  TODO
  IN_PROGRESS
  DONE
}

type Task {
  id: ID!
  name: String!
  state: TaskState!
}

type Comment {
  id: ID!
  author: User!
  project: Project!
  message: String!
}

#
# Root types
#

type Query {
  projects: [Project!]!
  project(slug: String!): Project!
}

type Mutation {
  signup(email: String!, password: String!): String!
  login(email: String!, password: String!): String!
}

type Subscription {
  # Subscription for CREATION / DELETION / UPDATE
  commentAdded(projectSlug: String!): Comment!
  taskAdded(projectSlug: String!): Task!
}
`;
