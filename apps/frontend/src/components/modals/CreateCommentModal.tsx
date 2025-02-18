import { useState } from "react";
import { createComment } from "../../services/api";
import { extractErrorMessage } from "../../utils/error";

type CreateCommentModalProps = {
  projectId: string;
  shouldClose: () => void;
  commentCreated: () => void;
};

const CreateCommentModal = ({
  projectId,
  shouldClose,
  commentCreated,
}: CreateCommentModalProps) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleNewComment = async () => {
    if (!message) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await createComment({
        project: projectId,
        input: {
          message,
        },
      });

      setMessage("");
      setError("");

      shouldClose();
      commentCreated();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold">
          Créer un nouveau Commentaire
        </h3>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Contenu du commentaire{" "}
          </label>
          <input
            type="text"
            id="text"
            name="text"
            value={message}
            onChange={(e) => setMessage((e.target as HTMLInputElement).value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Contenu du commentaire"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => shouldClose()}
            className="rounded-lg bg-gray-300 px-4 py-2"
          >
            Annuler
          </button>
          <button
            onClick={handleNewComment}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCommentModal;
