import { User } from "@prisma/client";

export function isAdminOrOwner(user: User, objectOwnerId: string) {
  return user.role == "ADMIN" || user.id == objectOwnerId;
}
