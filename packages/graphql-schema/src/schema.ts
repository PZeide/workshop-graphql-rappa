export default `#graphql
scalar DateTime

directive @auth(requires: UserRole! = ADMIN) on FIELD_DEFINITION

enum UserRole {
  USER
  ADMIN
}

type User {
  id: ID!
  email: String!
  comments: [Comment!]!
  projects: [Project!]!
  role: UserRole!
}

type Project {
  id: ID!
  name: String!
  description: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  owner: User!
  comments: [Comment!]!
  tasks: [Task!]!
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
  project: Project!
}

type Comment {
  id: ID!
  author: User!
  project: Project!
  message: String!
}

#
# Input types
#

input CreateProjectInput {
  name: String!
  description: String!
}

input UpdateProjectInput {
  name: String
  description: String
}

input CreateTaskInput {
  name: String!
}

input UpdateTaskInput {
  name: String
  state: TaskState
}

input CreateCommentInput {
  message: String!
}

input UpdateCommentInput {
  message: String
}

#
# Root types
#

type Query {
  projects: [Project!]! @auth(requires: USER)
  project(id: ID!): Project! @auth(requires: USER)
}

type Mutation {
  signup(email: String!, password: String!): String!
  login(email: String!, password: String!): String!

  createProject(input: CreateProjectInput!): Project! @auth(requires: USER)
  updateProject(project: ID!, input: UpdateProjectInput!): Project! @auth(requires: USER)
  deleteProject(project: ID!): Boolean! @auth(requires: USER)

  createTask(project: ID!, input: CreateTaskInput!): Task! @auth(requires: USER)
  updateTask(id: ID!, input: UpdateTaskInput!): Task! @auth(requires: USER)
  deleteTask(id: ID!): Boolean! @auth(requires: USER)

  createComment(project: ID!, input: CreateCommentInput!): Comment! @auth(requires: USER)
  updateComment(id: ID!, input: UpdateCommentInput!): Comment! @auth(requires: USER)
  deleteComment(id: ID!): Boolean! @auth(requires: USER)
}

type Subscription {
  projectAdded: Project! @auth(requires: USER)
  projectUpdated: Project! @auth(requires: USER)
  projectDeleted: ID! @auth(requires: USER)

  taskAdded(project: ID!): Task! @auth(requires: USER)
  taskUpdated(project: ID!): Task! @auth(requires: USER)
  taskDeleted(project: ID!): ID! @auth(requires: USER)

  commentAdded(project: ID!): Comment! @auth(requires: USER)
  commentUpdated(project: ID!): Comment! @auth(requires: USER)
  commentDeleted(project: ID!): ID! @auth(requires: USER)
}
`;
