import {
  gql,
  MutationCreateCommentArgs,
  MutationCreateProjectArgs,
  MutationCreateTaskArgs,
  MutationDeleteCommentArgs,
  MutationDeleteProjectArgs,
  MutationDeleteTaskArgs,
  MutationLoginArgs,
  MutationSignupArgs,
  MutationUpdateProjectArgs,
} from "@workshop-graphql-rappa/graphql-schema";
import { client } from "./apollo-client";
import { setAuthToken } from "./token";
import { MutationUpdateTaskArgs } from "@workshop-graphql-rappa/graphql-schema/src/client/graphql";

export async function login(input: MutationLoginArgs) {
  const result = await client.mutate({
    mutation: gql(`
      mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password)
      }
    `),
    variables: {
      email: input.email,
      password: input.password,
    },
  });

  if (!result.data) {
    return;
  }

  setAuthToken(result.data.login);
}

export async function signup(input: MutationSignupArgs) {
  const result = await client.mutate({
    mutation: gql(`
      mutation signup($email: String!, $password: String!) {
        signup(email: $email, password: $password)
      }
    `),
    variables: {
      email: input.email,
      password: input.password,
    },
  });

  if (!result.data) {
    return;
  }

  setAuthToken(result.data.signup);
}

export async function createProject(input: MutationCreateProjectArgs) {
  const result = await client.mutate({
    mutation: gql(`
      mutation createProject($input: CreateProjectInput!) {
        createProject(input: $input) {
          id
          name
          description
          owner {
            email
          }
        }
      }
    `),
    variables: {
      input: input.input,
    },
  });

  if (!result.data) {
    return;
  }

  return result.data.createProject;
}

export async function updateProject(input: MutationUpdateProjectArgs) {
  const result = await client.mutate({
    mutation: gql(`
      mutation updateProject($project: ID!, $input: UpdateProjectInput!) {
        updateProject(project: $project, input: $input) {
          id
          name
          description
          owner {
            email
          }
        }
      }
    `),
    variables: {
      project: input.project,
      input: input.input,
    },
  });

  if (!result.data) {
    return;
  }

  return result.data.updateProject;
}

export async function deleteProject(input: MutationDeleteProjectArgs) {
  const result = await client.mutate({
    mutation: gql(`
      mutation deleteProject($project: ID!) {
        deleteProject(project: $project)
      }
    `),
    variables: {
      project: input.project,
    },
  });

  if (!result.data) {
    return;
  }

  return result.data.deleteProject;
}

export async function createTask(input: MutationCreateTaskArgs) {
  const result = await client.mutate({
    mutation: gql(`
      mutation createTask($project: ID!, $input: CreateTaskInput!) {
        createTask(project: $project, input: $input) {
          id
        }
      }
    `),
    variables: {
      project: input.project,
      input: input.input,
    },
  });

  if (!result.data) {
    return;
  }

  return result.data.createTask;
}

export async function updateTask(input: MutationUpdateTaskArgs) {
  const result = await client.mutate({
    mutation: gql(`
      mutation updateTask($task: ID!, $input: UpdateTaskInput!) {
        updateTask(task: $task, input: $input) {
          id
        }
      }
    `),
    variables: {
      task: input.task,
      input: input.input,
    },
  });

  if (!result.data) {
    return;
  }

  return result.data.updateTask;
}

export async function deleteTask(input: MutationDeleteTaskArgs) {
  const result = await client.mutate({
    mutation: gql(`
      mutation deleteTask($task: ID!) {
        deleteTask(task: $task)
      }
    `),
    variables: {
      task: input.task,
    },
  });

  if (!result.data) {
    return;
  }

  return result.data.deleteTask;
}

export async function createComment(input: MutationCreateCommentArgs) {
  const result = await client.mutate({
    mutation: gql(`
      mutation createComment($project: ID!, $input: CreateCommentInput!) {
        createComment(project: $project, input: $input) {
          id
        }
      }
    `),
    variables: {
      project: input.project,
      input: input.input,
    },
  });

  if (!result.data) {
    return;
  }

  return result.data.createComment;
}

export async function deleteComment(input: MutationDeleteCommentArgs) {
  const result = await client.mutate({
    mutation: gql(`
      mutation deleteComment($comment: ID!) {
        deleteComment(comment: $comment)
      }
    `),
    variables: {
      comment: input.comment,
    },
  });

  if (!result.data) {
    return;
  }

  return result.data.deleteComment;
}
