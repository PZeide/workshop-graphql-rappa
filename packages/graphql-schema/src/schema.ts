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

input ProjectInput {
  name: String!
  description: String!
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

  createProject(project: ProjectInput!): Project! @auth(requires: USER)
  deleteProject(project: ID!): Boolean! @auth(requires: ADMIN)
}

type Subscription {
  projectAdded: Project! @auth(requires: USER)
  projectDeleted: Project! @auth(requires: USER)

  commentAdded(projectSlug: String!): Comment! @auth(requires: USER)
  taskAdded(projectSlug: String!): Task! @auth(requires: USER)
}
`;
