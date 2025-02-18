import { gql } from "@workshop-graphql-rappa/graphql-schema";

export const GET_PROJECTS = gql(`
  query GetProjects($filters: ProjectFilters!) {
    projects(filters: $filters) {
      id
      name
      description
      updatedAt
      owner {
        email
      }
    }
  }
`);

export const GET_PROJECT = gql(`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      createdAt
      owner {
        id
      }
      comments {
        id
        message
        author {
          id
          email
        }
      }
      tasks {
        id
        name
        state
      }
    }
  }
`);

export const SUBSCRIBE_PROJECT_ADDED = gql(`
  subscription SubscribeProjectAdded {
    projectAdded {
      id
    }
  }
`);

export const SUBSCRIBE_PROJECT_UPDATED = gql(`
  subscription SubscribeProjectUpdated {
    projectUpdated {
      id
    }
  }
`);

export const SUBSCRIBE_PROJECT_DELETED = gql(`
  subscription SubscribeProjectDeleted {
    projectDeleted
  }
`);
