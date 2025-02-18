import {
  User as PrismaUser,
  UserRole as PrismaUserRole,
  Task as PrismaTask,
  TaskState as PrismaTaskState,
} from "@prisma/client";
import {
  User as GQLUser,
  UserRole as GQLUserRole,
  Task as GQLTask,
  TaskState as GQLTaskState,
} from "@workshop-graphql-rappa/graphql-schema";

export function isAdminOrOwner(user: PrismaUser, objectOwnerId: string) {
  return user.role == "ADMIN" || user.id == objectOwnerId;
}

export function toGQLUser(user: PrismaUser): Partial<GQLUser> {
  const roleMappings: Record<PrismaUserRole, GQLUserRole> = {
    ADMIN: GQLUserRole.Admin,
    USER: GQLUserRole.User,
  };

  return {
    id: user.id,
    email: user.email,
    role: roleMappings[user.role],
  };
}

export function toGQLTask(task: PrismaTask): Partial<GQLTask> {
  const stateMappings: Record<PrismaTaskState, GQLTaskState> = {
    TODO: GQLTaskState.Todo,
    IN_PROGRESS: GQLTaskState.InProgress,
    DONE: GQLTaskState.Done,
  };

  return {
    id: task.id,
    name: task.name,
    state: stateMappings[task.state],
  };
}
