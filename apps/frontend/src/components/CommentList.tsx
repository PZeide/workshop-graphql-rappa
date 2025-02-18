import { Trash } from "lucide-react";
import { UserRole } from "@workshop-graphql-rappa/graphql-schema";
import { GetProjectQuery } from "@workshop-graphql-rappa/graphql-schema/src/client/graphql.js";
import { deleteComment } from "../services/api";
import { extractErrorMessage } from "../utils/error";

type CommentListProps = {
  userRole: UserRole;
  comments: GetProjectQuery["project"]["comments"];
  commentDeleted: () => void;
};

export const CommentList = ({
  userRole,
  comments,
  commentDeleted,
}: CommentListProps) => {
  if (!comments.length) {
    return (
      <p className="text-center text-gray-500 italic">
        Aucun commentaire pour le moment.
      </p>
    );
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({
        comment: commentId,
      });

      commentDeleted();
    } catch (e) {
      alert(`Impossible de changer la tâche ${extractErrorMessage(e)}`);
    }
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="group rounded-xl border border-gray-200/50 bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 hover:border-indigo-200/50 hover:shadow-lg"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-medium text-white">
              {comment.author.email[0].toUpperCase()}
            </div>
            <div className="text-sm font-medium text-gray-600">
              {comment.author.email}
            </div>
          </div>
          <div className="pl-10 text-gray-800">{comment.message}</div>
          {userRole === "ADMIN" && (
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteComment(comment.id);
                }}
              >
                <Trash />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
