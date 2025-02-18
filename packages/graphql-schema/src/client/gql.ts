/* eslint-disable */
import * as types from './graphql.js';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n      mutation login($email: String!, $password: String!) {\n        login(email: $email, password: $password)\n      }\n    ": typeof types.LoginDocument,
    "\n      mutation signup($email: String!, $password: String!) {\n        signup(email: $email, password: $password)\n      }\n    ": typeof types.SignupDocument,
    "\n      mutation createProject($input: CreateProjectInput!) {\n        createProject(input: $input) {\n          id\n          name\n          description\n          owner {\n            email\n          }\n        }\n      }\n    ": typeof types.CreateProjectDocument,
    "\n      mutation updateProject($project: ID!, $input: UpdateProjectInput!) {\n        updateProject(project: $project, input: $input) {\n          id\n          name\n          description\n          owner {\n            email\n          }\n        }\n      }\n    ": typeof types.UpdateProjectDocument,
    "\n      mutation deleteProject($project: ID!) {\n        deleteProject(project: $project)\n      }\n    ": typeof types.DeleteProjectDocument,
    "\n      mutation createTask($project: ID!, $input: CreateTaskInput!) {\n        createTask(project: $project, input: $input) {\n          id\n        }\n      }\n    ": typeof types.CreateTaskDocument,
    "\n      mutation updateTask($task: ID!, $input: UpdateTaskInput!) {\n        updateTask(task: $task, input: $input) {\n          id\n        }\n      }\n    ": typeof types.UpdateTaskDocument,
    "\n      mutation deleteTask($task: ID!) {\n        deleteTask(task: $task)\n      }\n    ": typeof types.DeleteTaskDocument,
    "\n      mutation createComment($project: ID!, $input: CreateCommentInput!) {\n        createComment(project: $project, input: $input) {\n          id\n        }\n      }\n    ": typeof types.CreateCommentDocument,
    "\n      mutation deleteComment($comment: ID!) {\n        deleteComment(comment: $comment)\n      }\n    ": typeof types.DeleteCommentDocument,
    "\n  query GetProjects($filters: ProjectFilters!) {\n    projects(filters: $filters) {\n      id\n      name\n      description\n      updatedAt\n      owner {\n        email\n      }\n    }\n  }\n": typeof types.GetProjectsDocument,
    "\n  query GetProject($id: ID!, $taskFilters: TaskFilters) {\n    project(id: $id) {\n      id\n      name\n      description\n      createdAt\n      owner {\n        id\n      }\n      comments {\n        id\n        message\n        author {\n          id\n          email\n        }\n      }\n      tasks(filters: $taskFilters) {\n        id\n        name\n        state\n      }\n    }\n  }\n": typeof types.GetProjectDocument,
    "\n  subscription SubscribeProjectAdded {\n    projectAdded {\n      id\n    }\n  }\n": typeof types.SubscribeProjectAddedDocument,
    "\n  subscription SubscribeProjectUpdated {\n    projectUpdated {\n      id\n    }\n  }\n": typeof types.SubscribeProjectUpdatedDocument,
    "\n  subscription SubscribeProjectDeleted {\n    projectDeleted\n  }\n": typeof types.SubscribeProjectDeletedDocument,
};
const documents: Documents = {
    "\n      mutation login($email: String!, $password: String!) {\n        login(email: $email, password: $password)\n      }\n    ": types.LoginDocument,
    "\n      mutation signup($email: String!, $password: String!) {\n        signup(email: $email, password: $password)\n      }\n    ": types.SignupDocument,
    "\n      mutation createProject($input: CreateProjectInput!) {\n        createProject(input: $input) {\n          id\n          name\n          description\n          owner {\n            email\n          }\n        }\n      }\n    ": types.CreateProjectDocument,
    "\n      mutation updateProject($project: ID!, $input: UpdateProjectInput!) {\n        updateProject(project: $project, input: $input) {\n          id\n          name\n          description\n          owner {\n            email\n          }\n        }\n      }\n    ": types.UpdateProjectDocument,
    "\n      mutation deleteProject($project: ID!) {\n        deleteProject(project: $project)\n      }\n    ": types.DeleteProjectDocument,
    "\n      mutation createTask($project: ID!, $input: CreateTaskInput!) {\n        createTask(project: $project, input: $input) {\n          id\n        }\n      }\n    ": types.CreateTaskDocument,
    "\n      mutation updateTask($task: ID!, $input: UpdateTaskInput!) {\n        updateTask(task: $task, input: $input) {\n          id\n        }\n      }\n    ": types.UpdateTaskDocument,
    "\n      mutation deleteTask($task: ID!) {\n        deleteTask(task: $task)\n      }\n    ": types.DeleteTaskDocument,
    "\n      mutation createComment($project: ID!, $input: CreateCommentInput!) {\n        createComment(project: $project, input: $input) {\n          id\n        }\n      }\n    ": types.CreateCommentDocument,
    "\n      mutation deleteComment($comment: ID!) {\n        deleteComment(comment: $comment)\n      }\n    ": types.DeleteCommentDocument,
    "\n  query GetProjects($filters: ProjectFilters!) {\n    projects(filters: $filters) {\n      id\n      name\n      description\n      updatedAt\n      owner {\n        email\n      }\n    }\n  }\n": types.GetProjectsDocument,
    "\n  query GetProject($id: ID!, $taskFilters: TaskFilters) {\n    project(id: $id) {\n      id\n      name\n      description\n      createdAt\n      owner {\n        id\n      }\n      comments {\n        id\n        message\n        author {\n          id\n          email\n        }\n      }\n      tasks(filters: $taskFilters) {\n        id\n        name\n        state\n      }\n    }\n  }\n": types.GetProjectDocument,
    "\n  subscription SubscribeProjectAdded {\n    projectAdded {\n      id\n    }\n  }\n": types.SubscribeProjectAddedDocument,
    "\n  subscription SubscribeProjectUpdated {\n    projectUpdated {\n      id\n    }\n  }\n": types.SubscribeProjectUpdatedDocument,
    "\n  subscription SubscribeProjectDeleted {\n    projectDeleted\n  }\n": types.SubscribeProjectDeletedDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation login($email: String!, $password: String!) {\n        login(email: $email, password: $password)\n      }\n    "): (typeof documents)["\n      mutation login($email: String!, $password: String!) {\n        login(email: $email, password: $password)\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation signup($email: String!, $password: String!) {\n        signup(email: $email, password: $password)\n      }\n    "): (typeof documents)["\n      mutation signup($email: String!, $password: String!) {\n        signup(email: $email, password: $password)\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation createProject($input: CreateProjectInput!) {\n        createProject(input: $input) {\n          id\n          name\n          description\n          owner {\n            email\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation createProject($input: CreateProjectInput!) {\n        createProject(input: $input) {\n          id\n          name\n          description\n          owner {\n            email\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation updateProject($project: ID!, $input: UpdateProjectInput!) {\n        updateProject(project: $project, input: $input) {\n          id\n          name\n          description\n          owner {\n            email\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation updateProject($project: ID!, $input: UpdateProjectInput!) {\n        updateProject(project: $project, input: $input) {\n          id\n          name\n          description\n          owner {\n            email\n          }\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation deleteProject($project: ID!) {\n        deleteProject(project: $project)\n      }\n    "): (typeof documents)["\n      mutation deleteProject($project: ID!) {\n        deleteProject(project: $project)\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation createTask($project: ID!, $input: CreateTaskInput!) {\n        createTask(project: $project, input: $input) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation createTask($project: ID!, $input: CreateTaskInput!) {\n        createTask(project: $project, input: $input) {\n          id\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation updateTask($task: ID!, $input: UpdateTaskInput!) {\n        updateTask(task: $task, input: $input) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation updateTask($task: ID!, $input: UpdateTaskInput!) {\n        updateTask(task: $task, input: $input) {\n          id\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation deleteTask($task: ID!) {\n        deleteTask(task: $task)\n      }\n    "): (typeof documents)["\n      mutation deleteTask($task: ID!) {\n        deleteTask(task: $task)\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation createComment($project: ID!, $input: CreateCommentInput!) {\n        createComment(project: $project, input: $input) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation createComment($project: ID!, $input: CreateCommentInput!) {\n        createComment(project: $project, input: $input) {\n          id\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      mutation deleteComment($comment: ID!) {\n        deleteComment(comment: $comment)\n      }\n    "): (typeof documents)["\n      mutation deleteComment($comment: ID!) {\n        deleteComment(comment: $comment)\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjects($filters: ProjectFilters!) {\n    projects(filters: $filters) {\n      id\n      name\n      description\n      updatedAt\n      owner {\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProjects($filters: ProjectFilters!) {\n    projects(filters: $filters) {\n      id\n      name\n      description\n      updatedAt\n      owner {\n        email\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProject($id: ID!, $taskFilters: TaskFilters) {\n    project(id: $id) {\n      id\n      name\n      description\n      createdAt\n      owner {\n        id\n      }\n      comments {\n        id\n        message\n        author {\n          id\n          email\n        }\n      }\n      tasks(filters: $taskFilters) {\n        id\n        name\n        state\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProject($id: ID!, $taskFilters: TaskFilters) {\n    project(id: $id) {\n      id\n      name\n      description\n      createdAt\n      owner {\n        id\n      }\n      comments {\n        id\n        message\n        author {\n          id\n          email\n        }\n      }\n      tasks(filters: $taskFilters) {\n        id\n        name\n        state\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription SubscribeProjectAdded {\n    projectAdded {\n      id\n    }\n  }\n"): (typeof documents)["\n  subscription SubscribeProjectAdded {\n    projectAdded {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription SubscribeProjectUpdated {\n    projectUpdated {\n      id\n    }\n  }\n"): (typeof documents)["\n  subscription SubscribeProjectUpdated {\n    projectUpdated {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription SubscribeProjectDeleted {\n    projectDeleted\n  }\n"): (typeof documents)["\n  subscription SubscribeProjectDeleted {\n    projectDeleted\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;